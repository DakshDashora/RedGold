from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException
from schemas import RegisterSchema, SuccessSchema, LoginSchema, TokenSchema
from sqlalchemy.orm import Session
from database import get_db
from models import User
from sqlalchemy import or_
from passlib.hash import bcrypt
import uuid
from utils import create_token
router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=SuccessSchema)
def register(user: RegisterSchema, db: Session = Depends(get_db)):
  
    prev = db.query(User).filter(
        or_(User.Email == user.Email, User.PhoneNumber == user.PhoneNumber)
    ).first()

    if prev:
        raise HTTPException(status_code=403, detail="User already exists")

    try:
    
        hashedpw = bcrypt.hash(user.password)
    
        uid = str(uuid.uuid4())      
        new_user = User(
            id=uid,
            Email=user.Email,
            password=hashedpw,
            Name=user.Name,
            Dob=user.Dob,
            BloodGroup=user.BloodGroup,
            PhoneNumber=user.PhoneNumber,
            Address=user.Address,
            City=user.City,
            MedicalCondition=user.MedicalCondition,
            EmergencyContactName=user.EmergencyContactName,
            EmergencyContactPhone=user.EmergencyContactPhone
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return SuccessSchema(
            id=new_user.id,
            message="User added successfully",
            operation=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login", response_model=TokenSchema)
def login_function(user: LoginSchema, db: Session= Depends(get_db)):
    db_user=db.query(User).filter(User.Email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="Username not found")
    
    if not bcrypt.verify(user.password, db_user.password):
        raise HTTPException(401, detail="Invalid Password")
   
    token_data={
        'id':db_user.id,
        'email':db_user.Email, 
        }
    token=TokenSchema(token=create_token(data=token_data, expires=timedelta(hours=24)),token_type='bearer')
   
    return token


