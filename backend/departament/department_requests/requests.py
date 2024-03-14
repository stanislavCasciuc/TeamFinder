from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_
from sqlalchemy.orm import Session

from departament.department_requests.schemas import Request
from departament.schemas import UserData
from functions.functions import get_current_user
from storage.models import get_db, ProjectEmployees, User, Project
from team_finder.utils import user_is_active

router = APIRouter()

@router.get('/department/requests/proposals', response_model = List[Request])
async def get_requests(current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_department_manager:
        raise HTTPException(status_code=400, detail="User is not a department manager")
    proposals = db.query(
        ProjectEmployees.user_id,
        User.name.label("username"),
        ProjectEmployees.project_id,
        ProjectEmployees.comment,
        Project.name.label("project_name"),
        ProjectEmployees.id
    ).join(
        User,
        ProjectEmployees.user_id == User.id,

    ).join(
        Project,
        ProjectEmployees.project_id == Project.id
    ).filter(
        and_(
            ProjectEmployees.is_proposal == True,
            ProjectEmployees.is_deallocated == False,
            User.department_id == current_user.department_id
        )
    ).all()

    requests = []
    for proposal in proposals:
        request = Request(id=proposal.id,project_name= proposal.project_name,user_id=proposal.user_id, username=proposal.username, project_id=proposal.project_id, comment=proposal.comment)
        requests.append(request)
    return requests

@router.get('/department/requests/deallocations', response_model = List[Request])
async def get_requests(current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_department_manager:
        raise HTTPException(status_code=400, detail="User is not a department manager")
    deallocations = db.query(
        ProjectEmployees.user_id,
        User.name.label("username"),
        ProjectEmployees.project_id,
        Project.name.label("project_name"),
        ProjectEmployees.deallocate_comment,
        ProjectEmployees.id
    ).join(
        User,
        ProjectEmployees.user_id == User.id
    ).join(
        Project,
        ProjectEmployees.project_id == Project.id
    ).filter(
        and_(
            ProjectEmployees.is_deallocated == True,
            ProjectEmployees.is_proposal == True,
            User.department_id == current_user.department_id
        )
    ).all()

    requests = []
    for deallocation in deallocations:
        request = Request(id=deallocation.id ,project_name=deallocation.project_name, user_id=deallocation.user_id, username=deallocation.username, project_id=deallocation.project_id, comment=deallocation.deallocate_comment)
        requests.append(request)
    return requests

@router.post('/department/requests/propose/accept/{id}')
async def accept_proposals(id: int, current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_department_manager:
        raise HTTPException(status_code=400, detail="User is not a department manager")
    proposal = db.query(ProjectEmployees).filter(ProjectEmployees.id == id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")

    user_projects = db.query(ProjectEmployees).filter(ProjectEmployees.id == id).all()
    user_hours_per_day = 0
    for user_project in user_projects:
        if user_is_active(user_project, db):
            user_hours_per_day += user_project.hours_per_day
    if user_hours_per_day + proposal.hours_per_day > 8:
        raise HTTPException(status_code=400, detail="User is fully")
    proposal.is_proposal = False
    db.commit()
    return {"detail": "Proposal accepted"}

@router.post('/department/requests/deallocate/reject/{id}')
async def accept_deallocations(id: int, current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_department_manager:
        raise HTTPException(status_code=400, detail="User is not a department manager")
    deallocation_user = db.query(ProjectEmployees).filter(ProjectEmployees.id == id).first()
    if not deallocation_user:
        raise HTTPException(status_code=404, detail="Deallocation not found")
    if not (deallocation_user.is_deallocated or deallocation_user.is_proposal):
        raise HTTPException(status_code=400, detail="Deallocation already accepted")
    deallocation_user.is_deallocated = False
    deallocation_user.is_proposal = False
    db.commit()
    return {"detail": "Deallocation rejected"}

@router.post('/department/requests/propose/reject/{id}')
async def reject_proposals(id: int, current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_department_manager:
        raise HTTPException(status_code=400, detail="User is not a department manager")
    proposal_user = db.query(ProjectEmployees).filter(ProjectEmployees.id == id).first()
    if not proposal_user.is_proposal and proposal_user.is_deallocated:
        raise HTTPException(status_code=400, detail="Proposal already rejected")
    if not proposal_user:
        raise HTTPException(status_code=404, detail="Proposal not found")
    proposal_user.hours_per_day = None
    proposal_user.user_id = None
    proposal_user.comment = None
    proposal_user.is_proposal = False
    db.commit()
    return {"detail": "Proposal rejected"}

@router.post('/department/requests/deallocate/accept/{id}')
async def reject_deallocations(id: int, current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_department_manager:
        raise HTTPException(status_code=400, detail="User is not a department manager")
    deallocation_user = db.query(ProjectEmployees).filter(ProjectEmployees.id == id).first()
    if not deallocation_user.is_deallocated and not deallocation_user.is_proposal:
        raise HTTPException(status_code=400, detail="Deallocation already rejected")
    if not deallocation_user:
        raise HTTPException(status_code=404, detail="Deallocation not found")
    deallocation_user.is_deallocated = True
    deallocation_user.is_proposal = False
    db.commit()
    return {"detail": "Deallocation accepted"}


