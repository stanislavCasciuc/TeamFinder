from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_, not_
from sqlalchemy.orm import Session


from functions.functions import get_current_user
from projects.project_employee.schemas import ProposalData, DeallocateData, EmployeeProject
from projects.schemas import GetProject
from skills.skills.schemas import UserData
from storage.models import get_db, Project, ProjectEmployees, ProjectTechnologies, Roles
from team_finder.utils import user_is_active

router = APIRouter()

@router.post('/project/employee/propose', response_model=ProposalData)
async def propose_employee(current_user: UserData = Depends(get_current_user), proposal_data: ProposalData = Depends(), db: Session = Depends(get_db)):
    if not current_user.is_project_manager:
        raise HTTPException(status_code=400, detail="User is not a project manager")
    project_employee = db.query(ProjectEmployees).filter(ProjectEmployees.id == proposal_data.id).first()
    if not project_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    project = db.query(Project).filter(Project.id == project_employee.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.project_manager_id != current_user.id:
        raise HTTPException(status_code=400, detail="User is not a project manager")

    user_projects = db.query(ProjectEmployees).filter(ProjectEmployees.user_id == proposal_data.user_id).all()
    user_hours_per_day = 0
    for user_project in user_projects:
        if user_is_active(user_project, db):
            user_hours_per_day += user_project.hours_per_day
    if user_hours_per_day + proposal_data.hours_per_day > 8:
        raise HTTPException(status_code=400, detail="User is fully")


    project_employee.is_proposal = True
    project_employee.hours_per_day = proposal_data.hours_per_day
    project_employee.user_id = proposal_data.user_id
    project_employee.comment = proposal_data.comment
    project_employee.notification_status = True
    db.commit()

    return proposal_data

@router.post('/project/employee/deallocate', response_model=DeallocateData)
async def deallocate_employee(current_user: UserData = Depends(get_current_user), deallocate_data: ProposalData = Depends(), db: Session = Depends(get_db)):
    if not current_user.is_project_manager:
        raise HTTPException(status_code=400, detail="User is not a project manager")
    project_employee = db.query(ProjectEmployees).filter(ProjectEmployees.id == deallocate_data.id).first()
    if not project_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    project = db.query(Project).filter(Project.id == project_employee.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.project_manager_id != current_user.id:
        raise HTTPException(status_code=400, detail="User is not a project manager")

    project_employee = db.query(ProjectEmployees).filter(ProjectEmployees.id == deallocate_data.id).first()
    if not project_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    project_employee.is_deallocated = True
    project_employee.deallocate_comment = deallocate_data.comment
    project_employee.is_proposal = True
    project_employee.notification_status = True
    db.commit()

    return deallocate_data

@router.get('/projects/employee', response_model=List[EmployeeProject])
async def get_project_employees(current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    project_employees = db.query(
        ProjectEmployees.project_id,
        ProjectEmployees.id,
        Project.name.label("project_name"),
        ProjectEmployees.is_proposal,
        ProjectEmployees.is_deallocated
    ).join(Project, ProjectEmployees.project_id == Project.id).filter(
        ProjectEmployees.user_id == current_user.id
    ).filter(not_(and_(ProjectEmployees.is_proposal == True, ProjectEmployees.is_deallocated == False))).distinct(ProjectEmployees.project_id).all()

    response = []
    for project_employee in project_employees:
        project_technologies = db.query(ProjectTechnologies.name).filter(ProjectTechnologies.project_id == project_employee.project_id).all()
        project_roles = db.query(Roles).join(ProjectEmployees, Roles.id == ProjectEmployees.role_id).filter(ProjectEmployees.project_id == project_employee.project_id).all()
        project = EmployeeProject(project_id=project_employee.project_id ,project_name=project_employee.project_name,technologies= [project_technology.name for project_technology in project_technologies], roles=[project_role.name for project_role in project_roles])
        if user_is_active(project_employee, db):
            project.is_active = True
        response.append(project)

    return response

@router.delete('/projects/employee/proposal/{employee_id}')
async def delete_project_employee(employee_id, current_user: UserData = Depends(get_current_user),db: Session = Depends(get_db)):
    if not current_user.is_project_manager:
        raise HTTPException(status_code=400, detail="User is not a project manager")

    employee = db.query(ProjectEmployees).filter(ProjectEmployees.id == employee_id).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    if not employee.is_proposal or employee.is_deallocated:
        raise HTTPException(status_code=400, detail="Employee is not proposed or deallocated")

    employee.is_proposal = False
    employee.hours_per_day = None
    employee.user_id = None
    employee.comment = None
    employee.notification_status = False
    db.commit()
    return {"detail": "Employee proposal deleted"}


