from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import parse_obj_as
from sqlalchemy.orm import Session



from auth.utils import get_current_user
from departament.schemas import DepartamentData, DepartamentResponse, UserData, MyDepartament, UserDataResponse, \
    AssignDepartment, UserNames
from departament.utils import get_department_manager_name
from functions.functions import get_department_name_by_id

from storage.model import get_db, Departament,  User
from storage.variables import Organization_Admin, Department_Manager

router = APIRouter()

@router.post('/department/create/', response_model = DepartamentResponse)
async def create_departament(departament_data: DepartamentData = Depends(), current_user: UserData = Depends(get_current_user)  , db: Session = Depends(get_db)):

    if Organization_Admin not in current_user.roles:
        raise HTTPException(status_code=403, detail="You are not allowed to create departament")

    db_departament_manger_user = db.query(User).filter(User.id == departament_data.departament_manager).first()
    if Department_Manager not in db_departament_manger_user.roles:
        raise HTTPException(status_code=403, detail="User is not a department manager")


    if db_departament_manger_user.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="User is not part of the organization")


    db_departament = Departament(
        name=departament_data.departament_name,
        organization_id=current_user.organization_id,
        departament_manager_id=departament_data.departament_manager
    )

    db.add(db_departament)
    db.commit()
    db.refresh(db_departament)

    if not db_departament.id:
        return HTTPException(status_code=500, detail="Error creating departament")

    db_departament_manger_user.departament_id = db_departament.id
    db.commit()

    departament_manager_name = get_department_manager_name(departament_data.departament_manager, db)
    response = DepartamentResponse(id=db_departament.id, departament_manager_name=departament_manager_name, name=db_departament.name)
    return response





@router.get('/department/all/', response_model = list[DepartamentResponse])
async def get_all_departaments(current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):

    if Organization_Admin not in current_user.roles:
        raise HTTPException(status_code=403, detail="You are not allowed to list all departaments")
    all_departaments = db.query(Departament).filter(Departament.organization_id == current_user.organization_id).all()
    response = []

    for departament in all_departaments:
        departament_manager_name= get_department_manager_name(departament.departament_manager_id, db)
        response.append(DepartamentResponse(id=departament.id,  name=departament.name, departament_manager_name=departament_manager_name))
    return response

@router.get('/department/my', response_model = MyDepartament)
async def get_departament(current_user: UserData= Depends(get_current_user), db: Session = Depends(get_db)):
    if Department_Manager not in current_user.roles:
        raise HTTPException(status_code=403, detail="You are not departament manager")
    departament = db.query(Departament).filter(Departament.departament_manager_id == current_user.id).first()
    if not departament:
        raise HTTPException(status_code=404, detail="Departament not found")

    db_departament_users= db.query(User).filter(User.departament_id == departament.id).all()
    departament_users = []
    for user in db_departament_users:
        departament_user = UserData(user_id=user.id, username=user.name, roles=user.roles)
        departament_users.append(departament_user)
    response = MyDepartament(department_id=departament.id, department_name=departament.name,  department_users=departament_users)
    return response


@router.post('/departament/assign/', response_model = UserDataResponse)
async def assign_departament(current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db), assign_user_id: AssignDepartment = Depends()):
    if Department_Manager not in current_user.roles:
        raise HTTPException(status_code=401, detail="Unauthorized")

    department = db.query(Departament).filter(Departament.departament_manager_id == current_user.id).first()
    if not department:
        raise HTTPException(status_code=403, detail="You are not a departament manager")

    user = db.query(User).filter(User.id == assign_user_id.user_id).first()

    if Department_Manager in user.roles:
        raise HTTPException(status_code=403, detail="You can't assign a department manager to a department")

    if user.departament_id:
        raise HTTPException(status_code=403, detail="User is already part of a department")

    if user.organization_id != department.organization_id:
        raise HTTPException(status_code=403, detail="User is not part of the organization")

    user.departament_id = department.id
    db.commit()
    response = UserDataResponse(user_id=user.departament_id,  username=user.name)
    return response

@router.get('/department/users/{department_id}', response_model = List[UserDataResponse])
async def get_departament_users(department_id: int,current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if Organization_Admin not in current_user.roles:
        raise HTTPException(status_code=403, detail="You are not a organization admin")

    db_users = db.query(User).filter(User.departament_id == department_id).all()

    user_dicts = [{"username": user.name, "user_id": user.id} for user in db_users]
    response = parse_obj_as(List[UserDataResponse], user_dicts)
    return response