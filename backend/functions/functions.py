from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from storage.variables import SECRET_KEY, ALGORITHM, ORGANIZATION_ADMIN, DEPARTMENT_MANAGER, PROJECT_MANAGER, EMPLOYEE
from storage.model import get_db, User, Department
from storage.model import Skills

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


def get_department_name_by_id(department_id, db: Session=Depends(get_db)):
    department = db.query(Department).filter(Department.id == department_id).first()
    if not department:
        return None
    return department.name

def get_user_roles(user_id, db: Session=Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    user_roles = [EMPLOYEE]
    if user.is_organization_admin:
        user_roles.append(ORGANIZATION_ADMIN)
    if user.is_department_manager:
        user_roles.append(DEPARTMENT_MANAGER)
    if user.is_project_manager:
        user_roles.append(PROJECT_MANAGER)
    return user_roles

def get_skill_name_by_id(skill_id, db: Session=Depends(get_db)):
    skill = db.query(Skills).filter(Skills.id == skill_id).first()
    if not skill:
        return None
    return skill.name