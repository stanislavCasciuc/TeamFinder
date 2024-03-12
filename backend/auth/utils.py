from datetime import datetime, timedelta

from fastapi import Depends, HTTPException
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy import and_
from sqlalchemy.orm import Session


from functions.functions import get_user, get_current_user, oauth2_scheme
from storage.models import get_db, User

from storage.variables import SECRET_KEY, ALGORITHM

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)



def authenticate_user(db: Session, email: str, password: str):
    user = get_user(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta or None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_users_organization(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        organization_id: str = payload.get("organization_id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    organization_data = db.query(User.organization_id.label("id"), User.id).filter(and_(User.id == user_id, User.organization_id == organization_id)).first()
    if organization_data is None:
        raise credentials_exception
    return organization_data




