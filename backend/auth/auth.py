from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from fastapi.security import OAuth2PasswordRequestForm

from backend.auth.schemas import Token, TokenData, ResponseAllUsers
from backend.auth.utils import authenticate_user, create_access_token, get_my_user, get_all_users
from backend.storage.model import get_db, UserMainRoles

ACCESS_TOKEN_EXPIRE_MINUTES = 30


router = APIRouter()

@router.post("/token", response_model = Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password", headers={"WWW-Authenticate": "Bearer"})
    user.role = db.query(UserMainRoles).filter(UserMainRoles.user_id == user.id).first().role_name
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "id": user.id, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer" }

@router.get("/users/login", response_model = TokenData)
async def read_users_me(current_user: TokenData = Depends(get_my_user)):
    return current_user



@router.get("/users/all", response_model = ResponseAllUsers )
async def read_users_all(current_user: TokenData = Depends(get_my_user), db: Session = Depends(get_db)):
    all_users = await get_all_users(current_user, db)
    response = ResponseAllUsers(all_users = all_users)
    return response
