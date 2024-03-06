from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import parse_obj_as
from sqlalchemy.orm import Session


from auth.utils import get_current_user
from departament.schemas import DepartmentResponse, DepartmentData, UserData, MyDepartment, UserDataResponse, \
    AssignDepartment, UserDataExtended

from departament.utils import get_department_manager_name
from functions.functions import get_user_roles

from storage.model import get_db, Department,  User


router = APIRouter()





@router.post('/department/create/', response_model = DepartmentResponse)
async def create_departament(department_data: DepartmentData = Depends(), current_user: UserData = Depends(get_current_user)  , db: Session = Depends(get_db)):

    if not current_user.is_organization_admin:
        raise HTTPException(status_code=403, detail="You are not allowed to create department, only organization admin can create departments")

    department_manager_user = db.query(User).filter(User.id == department_data.department_manager).first()
    if not department_manager_user.is_department_manager:
        raise HTTPException(status_code=403, detail="User is not a department manager")


    if department_manager_user.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="User is not part of the organization")


    department = Department(
        name=department_data.department_name,
        organization_id=current_user.organization_id,
        department_manager_id=department_data.department_manager
    )

    db.add(department)
    db.commit()
    db.refresh(department)

    if not department.id:
        return HTTPException(status_code=500, detail="Error creating departament")

    department_manager_user.department_id = department.id
    db.commit()


    response = DepartmentResponse(department_id=department.id, department_manager_name=department_manager_user.name, name=department.name)
    return response





@router.get('/department/all/', response_model = list[DepartmentResponse])
async def get_all_departaments(current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):

    if not current_user.is_organization_admin:
        raise HTTPException(status_code=403, detail="You are not allowed to list all departments")
    all_departments = db.query(Department).filter(Department.organization_id == current_user.organization_id).all()
    response = []

    for departament in all_departments:
        department_manager_name= get_department_manager_name(departament.department_manager_id, db)
        response.append(DepartmentResponse(department_id=departament.id,  name=departament.name, department_manager_name=department_manager_name))
    return response

@router.get('/department/my', response_model = MyDepartment)
async def get_departament(current_user: UserData= Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_department_manager:
        raise HTTPException(status_code=403, detail="You are not department manager")
    department = db.query(Department).filter(Department.department_manager_id == current_user.id).first()
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")

    db_department_users = db.query(User).filter(User.department_id == department.id).all()
    department_users = []
    for user in db_department_users:
        user_roles = get_user_roles(user.id, db)
        department_user = UserDataExtended(user_id=user.id, username=user.name, roles=user_roles)
        department_users.append(department_user)
    response = MyDepartment(department_id=department.id, department_name=department.name,  department_users=department_users)
    return response


@router.post('/department/assign/', response_model=UserDataResponse)
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
    response = UserDataResponse(user_id=user.department_id,  username=user.name)
    return response

@router.get('/department/users/{department_id}', response_model = List[UserDataResponse])
async def get_departament_users(department_id: int,current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_organization_admin:
        raise HTTPException(status_code=403, detail="You are not a organization admin")

    db_users = db.query(User).filter(User.department_id == department_id).all()

    user_dicts = [{"username": user.name, "user_id": user.id} for user in db_users]
    response = parse_obj_as(List[UserDataResponse], user_dicts)
    return response