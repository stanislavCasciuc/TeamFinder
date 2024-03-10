from fastapi import APIRouter, Depends, HTTPException
from pydantic import parse_obj_as
from sqlalchemy.orm import Session

from departament.schemas import UserData
from functions.functions import get_current_user

from projects.technologies.schemas import TechnologyData, TechnologyDelete
from storage.model import get_db, ProjectTechnologies, Project

router = APIRouter()

@router.post("/technology", response_model=TechnologyData)
async def create_technology(technology: TechnologyData = Depends(), current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_project_manager:
        raise HTTPException(status_code=403, detail="You are not allowed to create technologies")

    project = db.query(Project).filter(Project.id == technology.project_id).first()
    if project.project_manager_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not allowed to create technologies")
    db_technology = ProjectTechnologies(name=technology.name, project_id=technology.project_id)
    db.add(db_technology)
    db.commit()
    db.refresh(db_technology)

    response = db_technology.__dict__
    return response

@router.delete("/technologies")
async def delete_technology(technology: TechnologyDelete =  Depends(), current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_project_manager:
        raise HTTPException(status_code=403, detail="You are not allowed to delete technologies")

    project = db.query(Project).filter(Project.id == technology.project_id).first()

    if project.project_manager_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not allowed to delete technologies")

    technology = db.query(ProjectTechnologies).filter(ProjectTechnologies.id == technology.id).first()
    if not technology:
        raise HTTPException(status_code=404, detail="Technology not found")
    db.delete(technology)
    db.commit()
    return {"message": "Technology deleted successfully"}