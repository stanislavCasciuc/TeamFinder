from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session


from auth.schemas import RegisterUser
from auth.utils import get_password_hash
from storage.model import get_db, Organization, User
from storage.variables import ORGANIZATION_ADMIN, EMPLOYEE

router = APIRouter()


@router.post('/users/register/')
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
            if user.role == "employee":
                db_organization = db.query(Organization).filter(Organization.id == user.organization_id).first()
                if not db_organization:
                    raise HTTPException(status_code=404, detail="Organization not found")
                user_roles = [EMPLOYEE]
            else:
                raise HTTPException(status_code=400, detail="Invalid role")
        hashed_password = get_password_hash(user.password)
        db_user = User(name=user.name, email=user.email, hashed_password=hashed_password,
                                    organization_id=user.organization_id, is_organization_admin=ORGANIZATION_ADMIN in user_roles, is_department_manager=False, is_project_manager=False, departament_id=user.department_id)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        if not db_user.id:
            return HTTPException(status_code=500, detail="Error creating user")
        return
