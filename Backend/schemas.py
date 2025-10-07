from datetime import  date
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class RegisterSchema(BaseModel):
    Email:str
    password:str
    Name:str
    Dob:date
    BloodGroup:str
    PhoneNumber:str
    Address:str
    City:str
    MedicalCondition:str | None = None
    EmergencyContactName:str
    EmergencyContactPhone:str

class SuccessSchema(BaseModel):
    id:str | None= None
    message:str
    operation:bool

class LoginSchema(BaseModel):
    email:str
    password :str

class TokenSchema(BaseModel):
    token:str
    token_type:str


class BloodRequestCreate(BaseModel):
    blood_group: str
    units: int
    urgency_level: str
    hospital_name: str
    description: Optional[str] = None
    doctor_name: Optional[str] = None
    contact_number: str
    additional_info: Optional[str] = None


class BloodRequestUpdate(BaseModel):
    request_id: str  # now passed in schema
    status: str  # Pending | Accepted | Completed





class BloodRequestHistoryResponse(BaseModel):
    request_id: str
    previous_status: str
    new_status: str
    changed_at: datetime

    class Config:
        from_attributes = True



class DonorEligibilityResponse(BaseModel):
    eligible: bool
    next_eligible_date: Optional[datetime] = None

# Response schema for showing nearby requests to a donor
class NearbyRequestResponse(BaseModel):
    id: str
    user_id: str
    blood_group: str
    units: int
    urgency_level: str
    hospital_name: str
    description: Optional[str] =None
    
class DonationHistoryResponse(BaseModel):
    request_id: str
    blood_group: str
    units: int
    hospital_name: str
    status: str
    donated_at: datetime  # when the donation was last updated (usually completion time)

    class Config:
        from_attributes = True

class DonorInfo(BaseModel):
    id: str
    name: str
    score: int

class BloodRequestResponse(BaseModel):
    id: str
    user_id: str
    accepted_by: Optional[DonorInfo] = None  
    blood_group: str
    units: int
    urgency_level: str
    hospital_name: str
    description: str
    doctor_name: str
    contact_number: str
    additional_info: Optional[str]= None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        form_attributes= True

class MyRequestsByStatus(BaseModel):
    Pending: Optional[List[BloodRequestResponse]] = []
    Accepted: Optional[List[BloodRequestResponse]] = []
    Completed: Optional[List[BloodRequestResponse]] = []
    Cancelled: Optional[List[BloodRequestResponse]] = []  

