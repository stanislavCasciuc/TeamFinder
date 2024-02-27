

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.config import SessionLocal
from backend.model import Organization, User

from schemas import OrganizationUser

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get('/')
async def read_root():
    return {"Hello": "World"}

@router.get("/users/")
def get_all_users(db:  Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@router.post('/create_admin/')
async def create_user(user: OrganizationUser, db: Session = Depends(get_db)):
    try:
        with db.begin():
            db_organization = Organization(name=user.organization_name, address=user.address)
            db.add(db_organization)
            db.flush()  # Ensure the organization gets an ID before referencing it

            db_user = User(name=user.name, email=user.email, password=user.password,
                                        organization_id=db_organization.id, role="admin")

            return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")

# @router.get('/create_user/')
# async def create_user(user: OrganizationUser, db: Session = Depends(get_db)):
#     try:
#         with db.begin():
#             db_organization = Organization(name=user.organization_name, address=user.address)
#             db.add(db_organization)
#             db.flush()  # Ensure the organization gets an ID before referencing it
#
#             db_user = User(name=user.name, email=user.email, password=user.password,
#                                         organization_id=db_organization.id, role="user")
#
#             return db_user
#     except Exception as e:
#         db.rollback()
#         raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")
