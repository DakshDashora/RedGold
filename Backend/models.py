from datetime import datetime, timezone
from sqlalchemy import Column, Date, DateTime, ForeignKey, String, Integer, Text
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True)
    Email = Column(String(50), nullable=False, unique=True, index=True)
    password = Column(String(50), nullable=False)
    Name = Column(String(50), nullable=False)
    Dob = Column(Date, nullable=False)
    BloodGroup = Column(String(5), nullable=False)
    PhoneNumber = Column(String(15), nullable=False, unique=True, index=True)
    Address = Column(Text, nullable=False)
    City = Column(String(50), nullable=False, index=True)
    MedicalCondition = Column(Text, nullable=True)
    EmergencyContactName = Column(String(50), nullable=False)
    EmergencyContactPhone = Column(String(15), nullable=False)

    # Relationships
    blood_requests = relationship(
        "BloodRequest",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
        foreign_keys="BloodRequest.user_id"  # explicitly specify FK to avoid ambiguity
    )

    accepted_requests = relationship(
        "BloodRequest",
        back_populates="accepted_user",
        foreign_keys="BloodRequest.accepted_by"
    )


class BloodRequest(Base):
    __tablename__ = "blood_requests"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    blood_group = Column(String(10), nullable=False)
    units = Column(Integer, nullable=False)
    urgency_level = Column(String(50), nullable=False)
    hospital_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    doctor_name = Column(String(100), nullable=True)
    contact_number = Column(String(15), nullable=False)
    additional_info = Column(Text, nullable=True)
    status = Column(String(20), default="Pending", nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)
    accepted_by = Column(String(50), ForeignKey("users.id"), nullable=True, default=None)
    proof_document = Column(String, nullable=True)
    score = Column(Integer, default=0)
    # Relationships
    user = relationship(
        "User",
        back_populates="blood_requests",
        foreign_keys=[user_id]
    )

    accepted_user = relationship(
        "User",
        back_populates="accepted_requests",
        foreign_keys=[accepted_by]
    )

    modifications = relationship(
        "BloodRequestHistory",
        back_populates="request",
        cascade="all, delete-orphan",
        passive_deletes=True
    )


class BloodRequestHistory(Base):
    __tablename__ = "blood_request_history"

    id = Column(String, primary_key=True)
    request_id = Column(String, ForeignKey("blood_requests.id", ondelete="CASCADE"), nullable=False)
    previous_status = Column(String(20), nullable=False)
    new_status = Column(String(20), nullable=False)
    changed_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc), nullable=False)

    request = relationship(
        "BloodRequest",
        back_populates="modifications",
        foreign_keys=[request_id]
    )
