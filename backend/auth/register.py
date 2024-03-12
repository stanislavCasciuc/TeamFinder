from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session


from auth.schemas import RegisterUser, RegisterEmployee, OrganizationData
from auth.utils import get_password_hash, create_access_token, get_users_organization
from departament.schemas import UserData
from functions.functions import get_current_user
from storage.models import get_db, Organization, User
from storage.variables import ORGANIZATION_ADMIN, EMPLOYEE

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
    access_token_expires = timedelta(minutes=60*24)
    access_token = create_access_token(
        data={"sub": current_user.id, "organization_id": current_user.id,}, expires_delta=access_token_expires
    )
    return {"token": access_token}

@router.post('/user/register/employee')
async def create_user(user: RegisterEmployee, organization_data: OrganizationData = Depends(get_users_organization) , db: Session = Depends(get_db)):
        hashed_password = get_password_hash(user.password)
        db_user = User(name=user.name, email=user.email, hashed_password=hashed_password,organization_id=organization_data.id)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        if not db_user.id:
            return HTTPException(status_code=500, detail="Error creating user")
        return
