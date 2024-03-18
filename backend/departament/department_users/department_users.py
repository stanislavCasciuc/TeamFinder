from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import parse_obj_as
from sqlalchemy.orm import Session

from departament.department.schemas import UserData, AssignDepartment, UserDataResponse
from functions.functions import get_current_user
from storage.models import get_db, Department, User

router = APIRouter()

@router.post('/department/assign', response_model=UserDataResponse)
async def assign_department(current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db), assign_user_id: AssignDepartment = Depends()):
    if not current_user.is_department_manager:
        raise HTTPException(status_code=401, detail="Unauthorized, you are not a department manager")

    department = db.query(Department).filter(Department.department_manager_id == current_user.id).first()
    if not department:
        raise HTTPException(status_code=403, detail="You are not a department manager")

    user = db.query(User).filter(User.id == assign_user_id.user_id).first()

    if user.is_department_manager:
        raise HTTPException(status_code=403, detail="You can't assign a department manager to a department")

    if user.department_id:
        raise HTTPException(status_code=403, detail="User is already part of a department")

    if user.organization_id != department.organization_id:
        raise HTTPException(status_code=403, detail="User is not part of the organization")

    user.department_id = department.id
    db.commit()
    response = UserDataResponse(user_id=user.id,  username=user.name)
    return response

@router.get('/department/users/{department_id}', response_model = List[UserDataResponse])
async def get_departament_users(department_id: int,current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_organization_admin and not current_user.is_department_manager:
        raise HTTPException(status_code=403, detail="You are not a organization admin")

    db_users = db.query(User).filter(User.department_id == department_id).all()

    user_dicts = [{"username": user.name, "user_id": user.id} for user in db_users]
    response = parse_obj_as(List[UserDataResponse], user_dicts)
    return response

@router.delete("/department/user/{user_id}")
async def update_department_id(user_id: int ,current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_department_manager:
        raise HTTPException(status_code=403, detail="You are not department manager")
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.department_id = None
    db.commit()
    return {"detail": "User removed successfully"}