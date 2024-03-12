from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import parse_obj_as
from sqlalchemy import and_
from sqlalchemy.orm import Session

from functions.functions import get_current_user
from storage.models import get_db, User
from storage.variables import ROLES, EMPLOYEE, ORGANIZATION_ADMIN, DEPARTMENT_MANAGER
from users.shemas import UserData, AllUsers,  UserRoles, UserNames, Profil
from users.utils import get_my_user, get_all_users, set_user_roles

router = APIRouter()

@router.get("/users/all", response_model = List[AllUsers] )
async def read_users_all(current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    all_users = await get_all_users(current_user, db)
    return all_users


@router.get("/users/me", response_model=Profil)
async def read_users_me(current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    return await get_my_user(current_user, db)

@router.get("/users/{user_id}", response_model = Profil)
async def read_user(user_id: int, current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_organization_admin:
        raise HTTPException(status_code=401, detail="Unauthorized, you are not organization admin")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user = await get_my_user(user, db)
    return user

@router.put("/users/roles/update", response_model = UserData)
async def update_roles(current_user: UserData = Depends(get_current_user),  user_roles: UserRoles = Depends(), db: Session = Depends(get_db)):
    if not current_user.is_organization_admin:
        raise HTTPException(status_code=403, detail="Unauthorized, you are not organization admin")

    user_roles.roles = list(set(user_roles.roles))

    for role in user_roles.roles:
        if role not in ROLES:
            raise HTTPException(status_code=400, detail="Invalid roles")



    if EMPLOYEE not in user_roles.roles:
        raise HTTPException(status_code=400, detail="User must have at least the employee role")

    db_user = db.query(User).filter(User.id == user_roles.user_id).first()
    if db_user.is_organization_admin and ORGANIZATION_ADMIN not in user_roles.roles:
        raise HTTPException(status_code=400, detail="You can't remove the organization admin role")

    if db_user.is_department_manager and DEPARTMENT_MANAGER not in user_roles.roles and db_user.department_id:
        raise HTTPException(status_code=400, detail="User is department manager, you can't remove the department manager role")


    # if db_user.is_project_manager and PROJECT_MANAGER not in user_roles.roles and db_user.department_id:
    #      raise HTTPException(status_code=400, detail="User is department manager, you can't remove the department manager role")

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    set_user_roles(user_roles.roles, db_user)
    db.commit()

    response = UserData(id=db_user.id, name=db_user.name, email=db_user.email, organization_id=db_user.organization_id, department_id=db_user.department_id, roles=user_roles.roles)
    return response

@router.get("/users/department_managers/{user_id}", response_model=List[UserNames])
async def get_department_managers(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_organization_admin:
        raise HTTPException(status_code=403, detail="You are not organization admin")


    db_department_managers = db.query(User).filter(
        and_(
            User.organization_id == current_user.organization_id,
            User.is_department_manager == True,
            User.department_id == None
        )
    ).all()

    managers = [{"username": manager.name, "user_id": manager.id} for manager in db_department_managers]
    response = parse_obj_as(List[UserNames], managers)
    return response

# @router.delete("/user/{user_id}")
# async def delete_user(user_id: int, current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
#     if not current_user.is_organization_admin:
#         raise HTTPException(status_code=403, detail="You are not organization admin")
#     user = db.query(User).filter(User.id == user_id).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#
#
#
#     db.delete(user)
#     db.commit()
#     return {"detail": "User deleted"}





