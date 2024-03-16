from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from functions.functions import get_current_user, get_project_status_by_id, get_role_by_id
from projects.schemas import ProjectData, ResponseProjectData, GetProject, ProjectEmployee
from skills.skills.schemas import UserData
from storage.models import get_db, Project, ProjectTechnologies, ProjectEmployees, User
from storage.variables import IN_PROGRESS, CLOSED, CLOSING

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

    for role in project_data.project_roles:
        db_role = ProjectEmployees(project_id=project.id, role_id=role)
        db.add(db_role)

    db.commit()
    db_project_technologies = db.query(ProjectTechnologies).filter(ProjectTechnologies.project_id == project.id).all()
    project_technologies = [{"id": project_technology.id, "name": project_technology.name} for project_technology in
                            db_project_technologies]

    db_project_roles = db.query(ProjectEmployees).filter(ProjectEmployees.project_id == project.id).all()
    project_roles = [{"id": project_role.id, "role_id": project_role.role_id, "role_name":get_role_by_id(project_role.role_id, db).name} for project_role in db_project_roles]

    response = ResponseProjectData(id=project.id, name=project.name, description=project.description, start_date=project.start_date, end_date=project.end_date, project_status=project_data.project_status, project_manager_name=current_user.name, project_technologies=project_technologies, project_roles=project_roles)

    return response

@router.get('/projects', response_model=List[GetProject])
async def get_projects(current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_project_manager:
        raise HTTPException(status_code=403, detail="You are not allowed to get projects")

    manager_projects = db.query(Project).filter(Project.project_manager_id == current_user.id).all()

    response = []
    for project in manager_projects:
        project_status = get_project_status_by_id(project.id, db)
        project_period = "Ongoing"
        if project.end_date:
            project_period = "Fixed"
        response.append(GetProject(id=project.id, name=project.name, period=project_period, start_date=project.start_date, end_date=project.end_date, status=project_status))
    return response





@router.get('/project/{project_id}', response_model=ResponseProjectData)
async def get_project(project_id: int, current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):

    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    is_member = db.query(ProjectEmployees).filter(ProjectEmployees.project_id == project.id, ProjectEmployees.user_id == current_user.id).first()
    if not is_member:
        raise HTTPException(status_code=403, detail="You are not allowed to get this project")

    project_technologies = db.query(ProjectTechnologies).filter(ProjectTechnologies.project_id == project.id).all()
    db_project_employees = db.query(ProjectEmployees).filter(ProjectEmployees.project_id == project.id).all()

    project_technologies = [{"id": project_technology.id, "name": project_technology.name} for project_technology in project_technologies]

    project_employees = []
    for db_employee in db_project_employees:
        employee = ProjectEmployee(**db_employee.__dict__)
        employee.role_name = get_role_by_id(employee.role_id, db).name
        if employee.user_id:
            user = db.query(User).filter(User.id == employee.user_id).first()
            employee.user_name = user.name
        project_employees.append(employee)


    response = ResponseProjectData(id=project.id, name=project.name, description=project.description, start_date=project.start_date, end_date=project.end_date, project_status=get_project_status_by_id(project.id, db), project_manager_name=current_user.name, project_technologies=project_technologies, project_roles=project_employees, period="Ongoing" if not project.end_date else "Fixed")

    return response


@router.delete('/project/{project_id}')
async def delete_project(project_id: int, current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_project_manager:
        raise HTTPException(status_code=403, detail="You are not allowed to delete projects")

    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if project.project_manager_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not allowed to delete this project")

    project_status= get_project_status_by_id(project.id, db)

    if project_status == IN_PROGRESS or project_status == CLOSED or project_status == CLOSING:
        raise HTTPException(status_code=403, detail="You are not allowed to delete project in this status")

    db_project_technologies = db.query(ProjectTechnologies).filter(ProjectTechnologies.project_id == project.id).all()
    db_project_employees = db.query(ProjectEmployees).filter(ProjectEmployees.project_id == project.id).all()

    for project_technology in db_project_technologies:
        db.delete(project_technology)
    for project_employee in db_project_employees:
        db.delete(project_employee)

    db.commit()

    db.delete(project)
    db.commit()
    return {"detail": "Project successfully deleted"}






