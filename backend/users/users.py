from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.functions.functions import get_current_user
from backend.storage.model import get_db, User
from backend.storage.variables import ROLES, Organization_Admin, Employee
from backend.users.shemas import UserData, AllUsers, ExtendedUserData, UserRoles
from backend.users.utils import get_my_user, get_all_users

router= APIRouter()

@router.get("/users/all", response_model = List[AllUsers] )
async def read_users_all(current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    all_users = await get_all_users(current_user, db)
    return all_users


@router.get("/users/me", response_model = ExtendedUserData)
async def read_users_me(current_user: UserData = Depends(get_my_user)):
    return current_user

@router.put("/users/roles/update", response_model = UserData)
async def update_roles(current_user: UserData = Depends(get_current_user),  user_roles: UserRoles = Depends(), db: Session = Depends(get_db)):
    if Organization_Admin not in current_user.roles:
        raise HTTPException(status_code=403, detail="You are not allowed to update roles")

    user_roles.roles= list(set(user_roles.roles))

    for role in user_roles.roles:
        if role not in ROLES:
            raise HTTPException(status_code=400, detail="Invalid role")

    if Employee not in user_roles.roles:
        raise HTTPException(status_code=400, detail="User must have at least the employee role")

    db_user = db.query(User).filter(User.id == user_roles.user_id).first()
    if Organization_Admin in db_user.roles and Organization_Admin not in user_roles.roles:
        raise HTTPException(status_code=400, detail="You can't remove the organization admin role")
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    setattr(db_user, 'roles', user_roles.roles)
    db.commit()

    return db_user


