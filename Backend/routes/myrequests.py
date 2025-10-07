from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone, timedelta
import uuid

from database import get_db
from utils import get_current_user
from models import BloodRequest, BloodRequestHistory, User
from schemas import (
    BloodRequestCreate,
    BloodRequestResponse,
    BloodRequestUpdate,
    BloodRequestHistoryResponse,
    MyRequestsByStatus,
    SuccessSchema,
    DonorInfo
)

router = APIRouter(prefix="/blood-request", tags=["Blood-Requests"])

# ---------------------------
# Create a new blood request
# ---------------------------
@router.post("/", response_model=SuccessSchema)
def make_request(request_data: BloodRequestCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    uid = str(uuid.uuid4())
    now = datetime.now(timezone.utc)

    new_request = BloodRequest(
        id=uid,
        user_id=current_user.id,
        blood_group=request_data.blood_group,
        units=request_data.units,
        urgency_level=request_data.urgency_level,
        hospital_name=request_data.hospital_name,
        description=request_data.description,
        doctor_name=request_data.doctor_name,
        contact_number=request_data.contact_number,
        additional_info=request_data.additional_info,
        status="Pending",
        created_at=now,
        updated_at=now
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return SuccessSchema(
        id=new_request.id,
        message="Request added successfully",
        operation=True
    )

# ---------------------------
# Get all requests of current user grouped by status
# ---------------------------
@router.get("/my-requests", response_model=MyRequestsByStatus)
def get_my_requests(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # First, expire old Pending requests
    expire_old_requests(db)

    requests = db.query(BloodRequest).filter(BloodRequest.user_id == current_user.id).all()

    grouped_requests = {
        "Pending": [],
        "Accepted": [],
        "Completed": [],
        "Cancelled": [],
        "Dead": []
    }

    for r in requests:
        donor_info = None
        if r.accepted_by:
            donor = db.query(User).filter(User.id == r.accepted_by).first()
            donor_info = DonorInfo(id=donor.id, name=donor.Name, score=donor.score)

        grouped_requests[r.status].append(
            BloodRequestResponse(
                id=r.id,
                user_id=r.user_id,
                accepted_by=donor_info,
                blood_group=r.blood_group,
                units=r.units,
                urgency_level=r.urgency_level,
                hospital_name=r.hospital_name,
                description=r.description,
                doctor_name=r.doctor_name,
                contact_number=r.contact_number,
                additional_info=r.additional_info,
                status=r.status,
                created_at=r.created_at,
                updated_at=r.updated_at
            )
        )

    return grouped_requests

# ---------------------------
# Update request status
# ---------------------------
@router.patch("/", response_model=BloodRequestResponse)
def update_request_status(request_data: BloodRequestUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    blood_request = db.query(BloodRequest).filter(
        BloodRequest.id == request_data.request_id,
        BloodRequest.user_id == current_user.id
    ).first()

    if not blood_request:
        raise HTTPException(status_code=404, detail="Request not found")

    now = datetime.now(timezone.utc)

    # Save history
    history = BloodRequestHistory(
        id=str(uuid.uuid4()),
        request_id=blood_request.id,
        previous_status=blood_request.status,
        new_status=request_data.status,
        changed_at=now
    )
    db.add(history)

    # Update request
    blood_request.status = request_data.status
    blood_request.updated_at = now
    db.commit()
    db.refresh(blood_request)

    # Include donor info if exists
    donor_info = None
    if blood_request.accepted_by:
        donor = db.query(User).filter(User.id == blood_request.accepted_by).first()
        donor_info = DonorInfo(id=donor.id, name=donor.Name, score=donor.score)

    return BloodRequestResponse(
        id=blood_request.id,
        user_id=blood_request.user_id,
        accepted_by=donor_info,
        blood_group=blood_request.blood_group,
        units=blood_request.units,
        urgency_level=blood_request.urgency_level,
        hospital_name=blood_request.hospital_name,
        description=blood_request.description,
        doctor_name=blood_request.doctor_name,
        contact_number=blood_request.contact_number,
        additional_info=blood_request.additional_info,
        status=blood_request.status,
        created_at=blood_request.created_at,
        updated_at=blood_request.updated_at
    )

# ---------------------------
# Get history of a specific request
# ---------------------------
@router.get("/history/{request_id}", response_model=List[BloodRequestHistoryResponse])
def get_request_history(request_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    blood_request = db.query(BloodRequest).filter(
        BloodRequest.id == request_id,
        BloodRequest.user_id == current_user.id
    ).first()

    if not blood_request:
        raise HTTPException(status_code=404, detail="Request not found")

    return [
        BloodRequestHistoryResponse(
            request_id=h.request_id,
            previous_status=h.previous_status,
            new_status=h.new_status,
            changed_at=h.changed_at
        )
        for h in blood_request.modifications
    ]

# ---------------------------
# Cancel a request (Pending or Accepted)
# ---------------------------
@router.post("/cancel/{request_id}", response_model=SuccessSchema)
def cancel_request(request_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    request = db.query(BloodRequest).filter(
        BloodRequest.id == request_id,
        BloodRequest.user_id == current_user.id
    ).first()
    
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    previous_status = request.status

    if previous_status in ["Pending", "Accepted"]:
        if request.accepted_by:
            # Free the donor
            donor = db.query(User).filter(User.id == request.accepted_by).first()
            request.accepted_by = None
            # Rollback donor eligibility if tracked

        request.status = "Cancelled"
        request.updated_at = datetime.now(timezone.utc)

        # Log history
        history = BloodRequestHistory(
            id=str(uuid.uuid4()),
            request_id=request.id,
            previous_status=previous_status,
            new_status="Cancelled",
            changed_at=datetime.now(timezone.utc)
        )
        db.add(history)
        db.commit()
        db.refresh(request)

        return SuccessSchema(
            id=request.id,
            message=f"Request cancelled successfully from {previous_status} state",
            operation=True
        )

    else:
        raise HTTPException(
            status_code=400,
            detail=f"Request cannot be cancelled from {previous_status} state"
        )

# ---------------------------
# Expire old Pending requests (Dead state)
# ---------------------------
def expire_old_requests(db: Session):
    now = datetime.now(timezone.utc)
    expiry_time = now - timedelta(days=2)

    old_requests = db.query(BloodRequest).filter(
        BloodRequest.status == "Pending",
        BloodRequest.created_at < expiry_time
    ).all()

    for request in old_requests:
        previous_status = request.status
        request.status = "Dead"
        request.updated_at = now

        history = BloodRequestHistory(
            id=str(uuid.uuid4()),
            request_id=request.id,
            previous_status=previous_status,
            new_status="Dead",
            changed_at=now
        )
        db.add(history)
    
    db.commit()
