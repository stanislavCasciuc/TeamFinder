from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session


from auth.utils import get_current_user
from departament.schemas import DepartamentData, DepartamentResponse, UserData
from storage.model import get_db, Departament, UserMainRoles

router = APIRouter()

@router.post('/departament/create/', response_model = DepartamentResponse)
async def create_departament(departament_data: DepartamentData = Depends(), user_data: UserData= Depends(get_current_user)  , db: Session = Depends(get_db)):
    user_data.role = db.query(UserMainRoles).filter(UserMainRoles.user_id == user_data.id).first().role_name
    if user_data.role != "organization_admin":
        raise HTTPException(status_code=403, detail="You are not allowed to create departament")
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
    response = DepartamentResponse(id=db_departament.id, organization_id=db_departament.organization_id, name=db_departament.name)
    return response
