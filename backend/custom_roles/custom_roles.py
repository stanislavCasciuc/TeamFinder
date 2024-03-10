from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from custom_roles.schemas import Role
from functions.functions import get_current_user
from skills.skills.schemas import UserData
from storage.model import get_db, Roles

router = APIRouter()

@router.post('/role/{name}', response_model = Role)
async def create_role(role: str, current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_organization_admin:
        raise HTTPException(status_code=403, detail="You are not allowed to create roles")
    role = Roles(name=role, organization_id=current_user.organization_id)
    db.add(role)
    db.commit()
    db.refresh(role)
    response = Role(id=role.id, name=role.name)
    return response

@router.get('/roles', response_model = list[Role])
async def get_all_roles(current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_organization_admin and not current_user.is_project_manager:
        raise HTTPException(status_code=403, detail="You are not allowed to list all roles")
    all_roles = db.query(Roles).filter(Roles.organization_id == current_user.organization_id).all()
    response = []
    for role in all_roles:
        response.append(Role(id=role.id, name=role.name))
    return response

@router.put('/role', response_model = Role)
async def update_role(role: Role = Depends(), current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_organization_admin:
        raise HTTPException(status_code=403, detail="You are not allowed to update roles")
    db_role = db.query(Roles).filter(Roles.id == role.id).first()
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")

    if current_user.organization_id != db_role.organization_id:
        raise HTTPException(status_code=403, detail="You are not allowed to update roles from other organizations")

    db_role.name = role.name
    db.commit()
    return Role(id=role.id, name=role.name)


