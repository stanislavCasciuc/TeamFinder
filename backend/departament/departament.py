from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session



from backend.auth.utils import get_current_user
from backend.departament.schemas import DepartamentData, DepartamentResponse, UserData

from backend.storage.model import get_db, Departament,  User


router = APIRouter()

@router.post('/departament/create/', response_model = DepartamentResponse)
async def create_departament(departament_data: DepartamentData = Depends(), user_data: UserData= Depends(get_current_user)  , db: Session = Depends(get_db)):
    user_data.roles = db.query(UserMainRoles).filter(UserMainRoles.user_id == user_data.id).first().role_name
    if "organization_admin" not in user_data.roles:
        raise HTTPException(status_code=403, detail="You are not allowed to create departament")

    db_departament_manger_user = db.query(User).filter(User.id == departament_data.departament_manager).first()

    if db_departament_manger_user.organization_id != user_data.organization_id:
        raise HTTPException(status_code=403, detail="User is not part of the organization")


    db_departament = Departament(
        name=departament_data.departament_name,
        organization_id=user_data.organization_id,
        departament_manager=departament_data.departament_manager
    )

    db.add(db_departament)
    db.commit()
    db.refresh(db_departament)

    if not db_departament.id:
        return HTTPException(status_code=500, detail="Error creating departament")

    db_user_role = UserMainRoles(user_id=departament_data.departament_manager, role_name="departament_manager")
    db.add(db_user_role)
    db.commit()


    setattr(db_departament_manger_user, 'departament_id', db_departament.id)
    db.commit()
    response = DepartamentResponse(id=db_departament.id, organization_id=db_departament.organization_id, name=db_departament.name)
    return response

@router.get('/departament/all/', response_model = list[DepartamentResponse])
async def get_all_departaments(user_data: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    user_data.roles = get_user_roles(db, user_data.id)
    if "organization_admin" not in user_data.roles:
        raise HTTPException(status_code=403, detail="You are not allowed to list all departaments")
    all_departaments = db.query(Departament).filter(Departament.organization_id == user_data.organization_id).all()
    response = []
    for departament in all_departaments:
        response.append(DepartamentResponse(id=departament.id, organization_id=departament.organization_id, name=departament.name))
    return response

@router.get('/departament/', response_model = DepartamentResponse)
async def get_departament(user_data: UserData= Depends(get_current_user), db: Session = Depends(get_db)):
    user_data.roles = get_user_roles(db, user_data.id)
    if not user_data.roles:
        raise HTTPException(status_code=403, detail="You are not allowed to list all departaments")
    departament = db.query(Departament).filter(Departament.id == user_data.departament_id).first()
    if not departament:
        raise HTTPException(status_code=404, detail="Departament not found")
    response = DepartamentResponse(id=departament.id, organization_id=departament.organization_id, name=departament.name)
    return response


# @router.post('/departament/assign/', response_model = DepartamentResponse)
# async def assign_departament(user_data: UserData= Depends(get_current_user), db: Session = Depends(get_db)):
#     user_data.roles = get_user_roles(db, user_data.id)
#     if not user_data.roles:
#         raise HTTPException(status_code=401, detail="Unauthorized")
#
#     departament = db.query(Departament).filter(Departament.id == user_data.departament_id).first()
#     if departament:
#         db.delete(departament)
#         db.commit()
#     user = db.query(UserMainRoles).filter(UserMainRoles.user_id == user_data.id).first()
#     user.role_name = "departament_manager"
#     user.departament_id = departament.id
#     db.commit()
#     response = DepartamentResponse(id=departament.id, organization_id=departament.organization_id, name=departament.name)
#     return response