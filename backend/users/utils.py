from typing import List

from fastapi import Depends, HTTPException
from pydantic import parse_obj_as
from sqlalchemy.orm import Session

from functions.functions import get_department_name_by_id, get_user_roles, get_skill_name_by_id
from skills.user_skills.utils import months_until_current_date
from storage.models import get_db, User, Organization, UserSkills
from storage.variables import ORGANIZATION_ADMIN, DEPARTMENT_MANAGER, PROJECT_MANAGER

from users.shemas import AllUsers, Skill


async def get_all_users(current_user, db: Session = Depends(get_db)):
    if not (current_user.is_organization_admin or current_user.is_department_manager):
        raise HTTPException(status_code=401, detail="Unauthorized, you are not organization admin")
    all_users = db.query(User).filter(User.organization_id == current_user.organization_id).all()
    dict_users = [{"id": user.id, "name": user.name, "roles": get_user_roles(user.id, db), "department_name": get_department_name_by_id(user.department_id, db)} for user in all_users]
    response_users = parse_obj_as(List[AllUsers], dict_users)
    return response_users


async def get_my_user(current_user, db: Session = Depends(get_db)):
    organization = db.query(Organization).filter(Organization.id == current_user.organization_id).first()
    current_user.organization_name = organization.name
    current_user.organization_address = organization.address
    current_user.department_name = get_department_name_by_id(current_user.department_id, db)
    current_user.roles = get_user_roles(current_user.id, db)
    user_skills = db.query(UserSkills).filter(UserSkills.user_id == current_user.id).all()
    current_user.skills=[]
    for skill in user_skills:
        skill_name = get_skill_name_by_id(skill.skill_id, db)
        experience = months_until_current_date(skill.experience)
        current_user.skills.append(Skill(id=skill.skill_id, name=skill_name, level=skill.level, experience=experience))
    return current_user
def set_user_roles(roles, db_user):
    if ORGANIZATION_ADMIN in roles:
        setattr(db_user, 'is_organization_admin', True)
    else:
        setattr(db_user, 'is_organization_admin', False)
    if DEPARTMENT_MANAGER in roles:
        setattr(db_user, 'is_department_manager', True)
    else:
        setattr(db_user, 'is_department_manager', False)
    if PROJECT_MANAGER in roles:
        setattr(db_user, 'is_project_manager', True)
    else:
        setattr(db_user, 'is_project_manager', False)