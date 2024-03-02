from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from backend.functions.functions import  get_current_user, get_department_name_by_id
from backend.storage.model import get_db, User, Organization
from backend.users.shemas import AllUsers, ExtendedUserData


async def get_all_users(current_user, db: Session = Depends(get_db)):
    if "organization_admin" not in current_user.roles:
        raise HTTPException(status_code=401, detail="User dont have permission to list all")
    all_users = db.query(User).filter(User.organization_id == current_user.organization_id).all()
    response_users = []
    for user in all_users:
        user.departament_name = get_department_name_by_id(user.departament_id, db)
        user = AllUsers(id=user.id, name=user.name, roles=user.roles)
        response_users.append(user)
    return response_users


async def get_my_user(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.roles:
        raise HTTPException(status_code=400, detail="Inactive user")

    organization = db.query(Organization).filter(Organization.id == current_user.organization_id).first()
    current_user.organization_name = organization.name
    current_user.organization_address = organization.address
    current_user.departament_name = get_department_name_by_id(current_user.departament_id, db)

    return ExtendedUserData(id=current_user.id, name=current_user.name, email=current_user.email, organization_id=current_user.organization_id, organization_name=current_user.organization_name, organization_address=current_user.organization_address, departament_id=current_user.departament_id, departament_name=current_user.departament_name, roles=current_user.roles)