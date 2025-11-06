from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from typing import List
import uuid
import os
from sqlalchemy import func
from database import get_db
from models import User, BloodRequest, BloodRequestHistory
from schemas import (
    SuccessSchema,
    NearbyRequestResponse,
    DonationHistoryResponse,
    DonorEligibilityResponse,
)
from utils import get_current_user

router = APIRouter(prefix="/donor", tags=["Donor"])

PROOF_UPLOAD_DIR = "proof_uploads"
os.makedirs(PROOF_UPLOAD_DIR, exist_ok=True)

# ---------------- Helper: compatible blood groups ----------------
def compatible_groups(bg: str) -> List[str]:
    mapping = {
        "O-": ["O-", "O+", "A+", "A-", "B+", "B-", "AB+", "AB-"],
        "O+": ["O+", "A+", "B+", "AB+"],
        "A-": ["A-", "A+", "AB-", "AB+"],
        "A+": ["A+", "AB+"],
        "B-": ["B-", "B+", "AB-", "AB+"],
        "B+": ["B+", "AB+"],
        "AB-": ["AB-", "AB+"],
        "AB+": ["AB+"]
    }
    return mapping.get(bg.upper(), [])

# ---------------- 1️⃣ Nearby compatible requests ----------------
@router.get("/nearby-requests", response_model=List[NearbyRequestResponse])
def get_nearby_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    compatible = compatible_groups(current_user.BloodGroup)

    return (
        db.query(BloodRequest)
        .filter(
            BloodRequest.user.has(func.lower(User.City) == func.lower(current_user.City)),
            BloodRequest.blood_group.in_(compatible),
            BloodRequest.status == "Pending"
        )
        .all()
    )

# ---------------- 2️⃣ Donation history ----------------
@router.get("/history", response_model=List[DonationHistoryResponse])
def get_donation_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    donations = db.query(BloodRequest).filter(
        BloodRequest.accepted_by == current_user.id
    ).order_by(BloodRequest.updated_at.desc()).all()

    return [
        DonationHistoryResponse(
            request_id=r.id,
            blood_group=r.blood_group,
            units=r.units,
            hospital_name=r.hospital_name,
            status=r.status,
            donated_at=r.updated_at
        )
        for r in donations
    ]

# ---------------- 3️⃣ Check donor eligibility ----------------
@router.get("/eligibility", response_model=DonorEligibilityResponse)
def check_eligibility(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    last_donation = db.query(BloodRequest).filter(
        BloodRequest.accepted_by == current_user.id,
        BloodRequest.status.in_(["Completed", "Verified"])
    ).order_by(BloodRequest.updated_at.desc()).first()

    if last_donation:
        next_eligible = last_donation.updated_at + timedelta(days=180)
        eligible = datetime.now(timezone.utc) >= next_eligible
        return DonorEligibilityResponse(
            eligible=eligible,
            next_eligible_date=None if eligible else next_eligible
        )
    return DonorEligibilityResponse(eligible=True, next_eligible_date=None)

# ---------------- 4️⃣ Accept a blood request ----------------
@router.post("/accept/{request_id}", response_model=SuccessSchema)
def accept_request(request_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    request = db.query(BloodRequest).filter(
        BloodRequest.id == request_id,
        BloodRequest.status == "Pending"
    ).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found or not pending")

    last_donation = db.query(BloodRequest).filter(
        BloodRequest.accepted_by == current_user.id,
        BloodRequest.status.in_(["Completed", "Verified"])
    ).order_by(BloodRequest.updated_at.desc()).first()
    if last_donation and datetime.now(timezone.utc) < last_donation.updated_at + timedelta(days=180):
        raise HTTPException(status_code=400, detail="You are not eligible to donate yet")

    previous_status = request.status
    request.status = "Accepted"
    request.accepted_by = current_user.id
    request.updated_at = datetime.now(timezone.utc)

    db.add(BloodRequestHistory(
        id=str(uuid.uuid4()),
        request_id=request.id,
        previous_status=previous_status,
        new_status="Accepted",
        changed_at=datetime.now(timezone.utc)
    ))
    db.commit()
    db.refresh(request)

    return SuccessSchema(id=request.id, message="Request accepted successfully", operation=True)

# ---------------- 5️⃣ Cancel a blood request ----------------
@router.post("/cancel/{request_id}", response_model=SuccessSchema)
def cancel_request(request_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    request = db.query(BloodRequest).filter(
        BloodRequest.id == request_id,
        BloodRequest.accepted_by == current_user.id
    ).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found or not accepted by you")

    previous_status = request.status
    request.accepted_by = None
    request.status = "Pending"
    request.updated_at = datetime.now(timezone.utc)

    if hasattr(current_user, "score"):
        current_user.score = max(0, (current_user.score or 0) - 5)

    db.add(BloodRequestHistory(
        id=str(uuid.uuid4()),
        request_id=request.id,
        previous_status=previous_status,
        new_status="Cancelled",
        changed_at=datetime.now(timezone.utc)
    ))
    db.commit()
    db.refresh(request)

    return SuccessSchema(id=request.id, message="Request cancelled successfully", operation=True)

# ---------------- 6️⃣ Complete donation ----------------
@router.put("/complete/{request_id}", response_model=SuccessSchema)
def mark_donation_complete(request_id: str, proof: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    request = db.query(BloodRequest).filter(
        BloodRequest.id == request_id,
        BloodRequest.accepted_by == current_user.id
    ).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found or not accepted by you")

    file_path = os.path.join(PROOF_UPLOAD_DIR, f"{request_id}_{proof.filename}")
    with open(file_path, "wb") as f:
        f.write(proof.file.read())

    previous_status = request.status
    request.status = "Completed"
    request.proof_document = file_path
    request.updated_at = datetime.now(timezone.utc)

    if hasattr(current_user, "score"):
        current_user.score = (current_user.score or 0) + 5

    db.add(BloodRequestHistory(
        id=str(uuid.uuid4()),
        request_id=request.id,
        previous_status=previous_status,
        new_status="Completed",
        changed_at=datetime.now(timezone.utc)
    ))
    db.commit()
    db.refresh(request)

    return SuccessSchema(id=request.id, message="Donation completed and proof uploaded", operation=True)

# ---------------- 7️⃣ No-show handling ----------------
def handle_no_shows(db: Session):
    now = datetime.now(timezone.utc)
    expired_requests = db.query(BloodRequest).filter(
        BloodRequest.status == "Accepted",
        BloodRequest.updated_at < now - timedelta(hours=24)
    ).all()

    for request in expired_requests:
        donor = db.query(User).filter(User.id == request.accepted_by).first()
        if donor and hasattr(donor, "score"):
            donor.score = max(0, (donor.score or 0) - 10)

        previous_status = request.status
        request.status = "Pending"
        request.accepted_by = None
        request.updated_at = now

        db.add(BloodRequestHistory(
            id=str(uuid.uuid4()),
            request_id=request.id,
            previous_status=previous_status,
            new_status="No-Show",
            changed_at=now
        ))

    db.commit()

@router.post("/check-no-shows", response_model=SuccessSchema)
def check_no_shows(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    background_tasks.add_task(handle_no_shows, db)
    return SuccessSchema(id=None, message="No-show check triggered", operation=True)
