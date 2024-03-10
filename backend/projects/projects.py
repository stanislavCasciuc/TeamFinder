from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from functions.functions import get_current_user
from projects.schemas import ProjectData, ResponseProjectData
from skills.skills.schemas import UserData
from storage.model import get_db, Project, ProjectTechnologies

router = APIRouter()

@router.post('/project', response_model=ResponseProjectData)
async def create_project(project_data: ProjectData, current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_project_manager:
        raise HTTPException(status_code=403, detail="You are not allowed to create projects")

    project = Project(organization_id=current_user.organization_id, project_manager_id=current_user.id, name=project_data.name, description=project_data.description, start_date=project_data.start_date, end_date=project_data.end_date)

    db.add(project)
    db.commit()
    db.refresh(project)

    project_data.project_technologies = list(set(project_data.project_technologies))

    for technology in project_data.project_technologies:
        db_technology = ProjectTechnologies(project_id=project.id, name=technology)
        db.add(db_technology)

    db.commit()
    db_project_technologies = db.query(ProjectTechnologies).filter(ProjectTechnologies.project_id == project.id).all()

    project_technologies= [{"id": project_technology.id, "name": project_technology.name} for project_technology in db_project_technologies]



    response = ResponseProjectData(id=project.id, name=project.name, description=project.description, start_date=project.start_date, end_date=project.end_date, project_status=project_data.project_status, project_manager_name=current_user.name, project_technologies=project_technologies)

    return response





