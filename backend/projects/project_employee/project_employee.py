from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session


from functions.functions import get_current_user
from projects.project_employee.schemas import ProposalData
from skills.skills.schemas import UserData
from storage.models import get_db, Project, ProjectEmployees
from team_finder.utils import user_is_active

router = APIRouter()

@router.post('/project/employee/propose', response_model=ProposalData)
async def propose_employee(current_user: UserData = Depends(get_current_user), proposal_data: ProposalData = Depends(), db: Session = Depends(get_db)):
    if not current_user.is_project_manager:
        raise HTTPException(status_code=400, detail="User is not a project manager")

    project = db.query(Project).filter(Project.id == proposal_data.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.project_manager_id != current_user.id:
        raise HTTPException(status_code=400, detail="User is not a project manager")

    user_projects = db.query(ProjectEmployees).filter(ProjectEmployees.user_id == proposal_data.user_id).all()
    user_hours_per_day = 0
    for user_project in user_projects:
        if user_project.project_id == proposal_data.project_id:
            raise HTTPException(status_code=400, detail="User is already proposed to the project")
        if user_is_active(user_project, db):
            user_hours_per_day += user_project.hours_per_day
    if user_hours_per_day + proposal_data.hours_per_day > 8:
        raise HTTPException(status_code=400, detail="User is fully")

    project_employee = db.query(ProjectEmployees).filter(ProjectEmployees.id == proposal_data.id).first()
    if not project_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    project_employee.is_proposal = True
    project_employee.hours_per_day = proposal_data.hours_per_day
    project_employee.user_id = proposal_data.user_id
    project_employee.comment = proposal_data.comment
    db.commit()

    return proposal_data
