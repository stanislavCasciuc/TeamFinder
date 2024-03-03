from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from backend.storage.variables import SECRET_KEY, ALGORITHM
from backend.storage.model import get_db, User, Departament

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_user(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()
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


def get_department_name_by_id(departament_id, db):
    departament = db.query(Departament).filter(Departament.id == departament_id).first()
    if not departament:
        return None
    return departament.name