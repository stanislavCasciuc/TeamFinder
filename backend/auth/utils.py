from datetime import datetime, timedelta

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from sqlalchemy.orm.base import instance_dict



from backend.storage.model import User, get_db, UserMainRoles, Organization

SECRET_KEY = "c588be47a9b0a8ac4f95d6c74c37f42659b1c85a7f85bf139c0ef131f6e19e1e"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

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


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user(db, email)
    if user is None:
        raise credentials_exception
    return user

async def get_my_user(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.role = db.query(UserMainRoles).filter(UserMainRoles.user_id == current_user.id).first().role_name
    if not current_user.role:
        raise HTTPException(status_code=400, detail="Inactive user")
    organization = db.query(Organization).filter(Organization.id == current_user.organization_id).first()
    current_user.organization_name = organization.name
    current_user.organization_address = organization.address

    if current_user.hashed_password:
        del current_user.hashed_password

    return current_user

async def get_all_users(current_user,db: Session = Depends(get_db)):
    if not current_user.role == "organization_admin":
        raise HTTPException(status_code=401, detail="User dont have permission to list all")
    all_users= db.query(User).all()
    for user in all_users:
        user.role = db.query(UserMainRoles).filter(UserMainRoles.user_id == user.id).first().role_name
        organization = db.query(Organization).filter(Organization.id == user.organization_id).first()
        user.organization_name = organization.name
        user.organization_address = organization.address
        if user.hashed_password:
            del user.hashed_password
    return all_users