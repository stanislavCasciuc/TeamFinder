import uuid
from datetime import timedelta, datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session


from auth_register.schemas import RegisterUser, RegisterEmployee
from auth_register.utils import get_password_hash
from departament.department.schemas import UserData
from functions.functions import get_current_user
from storage.models import get_db, Organization, User, Invite
from storage.variables import ORGANIZATION_ADMIN, EMPLOYEE

router = APIRouter()


@router.post('/user/register/admin')
async def create_user(user: RegisterUser, db: Session = Depends(get_db)):
    db_organization = Organization(name=user.organization_name, address=user.organization_address)
    try:
        db.add(db_organization)
        db.commit()
        db.flush()
        if not db_organization.id:
            raise HTTPException(status_code=500, detail="Error creating organization")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating organization: {e}")
    user.organization_id = db_organization.id
    user_roles = [ORGANIZATION_ADMIN, EMPLOYEE]
    hashed_password = get_password_hash(user.password)
    db_user = User(name=user.name, email=user.email, hashed_password=hashed_password,
                                organization_id=user.organization_id, is_organization_admin=ORGANIZATION_ADMIN in user_roles)
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        if not db_user.id:
            raise HTTPException(status_code=500, detail="Error creating user")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=e)
    return {"detail": "User created successfully"}

@router.get('/register/invite')
async def invite_user(current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_organization_admin:
        raise HTTPException(status_code=400, detail="User is not an organization admin")
    invite = db.query(Invite).filter(Invite.organization_id == current_user.organization_id).first()
    public_id = str(uuid.uuid4())
    expires_date = datetime.utcnow() + timedelta(days=1)
    if not invite:
        invite = Invite(organization_id=current_user.organization_id, public_id=public_id, expires_date=expires_date)
        db.add(invite)
    elif invite.expires_date < datetime.utcnow():
        invite.public_id = public_id
        invite.expires_date = expires_date

    db.commit()
    db.refresh(invite)
    if not invite.id:
        return HTTPException(status_code=500, detail="Error creating invite")
    return {"public_id": invite.public_id}

@router.post('/user/register/employee')
async def create_user(user: RegisterEmployee, db: Session = Depends(get_db)):
    invite_data = db.query(Invite).filter(Invite.public_id == user.public_id).first()
    if not invite_data:
        raise HTTPException(status_code=404, detail="Invite not found")
    if invite_data.expires_date < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invite expired")
    hashed_password = get_password_hash(user.password)
    db_user = User(name=user.name, email=user.email, hashed_password=hashed_password,organization_id=invite_data.organization_id)
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        if not db_user.id:
            raise HTTPException(status_code=500, detail="Error creating user")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=e)
    return {"detail": "User created successfully"}
