from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.auth.schemas import RegisterUser, ResponseUser
from backend.auth.utils import get_password_hash
from backend.storage.model import get_db, Organization, User

router = APIRouter()


@router.post('/register/')
async def create_user(user: RegisterUser, db: Session = Depends(get_db)):
        if user.organization_admin:
            user.role = "organization_admin"
            db_organization = Organization(name=user.organization_name, address=user.organization_address)
            db.add(db_organization)
            db.commit()
            db.flush()
            if not db_organization.id:
                return HTTPException(status_code=500, detail="Error creating organization")
            user.organization_id = db_organization.id
        else:
            db_organization = db.query(Organization).filter(Organization.id == user.organization_id).first()
            user.role = "employee"
            if not db_organization:
                raise HTTPException(status_code=404, detail="Organization not found")
        hashed_password = get_password_hash(user.password)
        db_user = User(name=user.name, email=user.email, hashed_password=hashed_password,
                                    organization_id=user.organization_id, role=user.role)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        if not db_user.id:
            return HTTPException(status_code=500, detail="Error creating user")
        response_user = ResponseUser(id=db_user.id, organization_id=db_user.organization_id)
        return response_user
