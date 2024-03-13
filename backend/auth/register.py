import uuid
from datetime import timedelta, datetime

from fastapi import APIRouter, Depends, HTTPException
from jose import JWTError, jwt
from sqlalchemy import and_
from sqlalchemy.orm import Session


from auth.schemas import RegisterUser, RegisterEmployee, OrganizationData
from auth.utils import get_password_hash, create_access_token, get_users_organization
from departament.schemas import UserData
from functions.functions import get_current_user
from storage.models import get_db, Organization, User, Invite
from storage.variables import ORGANIZATION_ADMIN, EMPLOYEE, SECRET_KEY, ALGORITHM

router = APIRouter()


@router.post('/user/register/admin')
async def create_user(user: RegisterUser, db: Session = Depends(get_db)):
        if user.role == "organization_admin":
            db_organization = Organization(name=user.organization_name, address=user.organization_address)
            db.add(db_organization)
            db.commit()
            db.flush()
            if not db_organization.id:
                return HTTPException(status_code=500, detail="Error creating organization")
            user.organization_id = db_organization.id
            user_roles = [ORGANIZATION_ADMIN, EMPLOYEE]
        else:
            raise HTTPException(status_code=400, detail="Invalid role")
        hashed_password = get_password_hash(user.password)
        db_user = User(name=user.name, email=user.email, hashed_password=hashed_password,
                                    organization_id=user.organization_id, is_organization_admin=ORGANIZATION_ADMIN in user_roles)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        if not db_user.id:
            return HTTPException(status_code=500, detail="Error creating user")
        return

@router.get('/register/invite')
async def invite_user(current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_organization_admin:
        raise HTTPException(status_code=400, detail="User is not an organization admin")
    public_id = str(uuid.uuid4())
    expires_date = datetime.utcnow() + timedelta(days=1)
    db_invite = Invite(organization_id=current_user.organization_id, public_id=public_id, expires_date=expires_date)
    db.add(db_invite)
    db.commit()
    if not db_invite.id:
        return HTTPException(status_code=500, detail="Error creating invite")
    return {"public_id": public_id}

@router.post('/user/register/employee')
async def create_user(user: RegisterEmployee, db: Session = Depends(get_db)):
    invite_data = db.query(Invite).filter(Invite.public_id == user.public_id).first()
    if not invite_data:
        return HTTPException(status_code=404, detail="Invite not found")
    if invite_data.expires_date < datetime.utcnow():
        return HTTPException(status_code=400, detail="Invite expired")
    hashed_password = get_password_hash(user.password)
    db_user = User(name=user.name, email=user.email, hashed_password=hashed_password,organization_id=invite_data.organization_id)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    if not db_user.id:
        return HTTPException(status_code=500, detail="Error creating user")
    return
