from typing import List

from fastapi import Depends, HTTPException
from pydantic import parse_obj_as
from sqlalchemy.orm import Session

from functions.functions import get_current_user, get_department_name_by_id, get_user_roles
from storage.model import get_db, User, Organization
from storage.variables import ORGANIZATION_ADMIN, DEPARTMENT_MANAGER, PROJECT_MANAGER

from users.shemas import AllUsers, ExtendedUserData


async def get_all_users(current_user, db: Session = Depends(get_db)):
    if not current_user.is_organization_admin:
        raise HTTPException(status_code=401, detail="Unauthorized, you are not organization admin")
    all_users = db.query(User).filter(User.organization_id == current_user.organization_id).all()
    dict_users = [{"id": user.id, "name": user.name, "roles": get_user_roles(user.id, db), "department_name": get_department_name_by_id(user.department_id, db)} for user in all_users]
    response_users = parse_obj_as(List[AllUsers], dict_users)
    return response_users


async def get_my_user(current_user: ExtendedUserData = Depends(get_current_user), db: Session = Depends(get_db)):
    organization = db.query(Organization).filter(Organization.id == current_user.organization_id).first()
    current_user.organization_name = organization.name
    current_user.organization_address = organization.address
    current_user.department_name = get_department_name_by_id(current_user.department_id, db)
    current_user.roles = get_user_roles(current_user.id, db)
    return current_user
def set_user_roles(roles, db_user):
    if ORGANIZATION_ADMIN in roles:
        setattr(db_user, 'is_organization_admin', True)
    if DEPARTMENT_MANAGER in roles:
        setattr(db_user, 'is_department_manager', True)
    if PROJECT_MANAGER in roles:
        setattr(db_user, 'is_project_manager', True)