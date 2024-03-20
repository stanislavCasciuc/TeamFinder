from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_
from sqlalchemy.orm import Session

from functions.functions import get_current_user
from skills.skills.schemas import UserData
from storage.models import ProjectEmployees, get_db, User

router = APIRouter()

@router.get('/notification/count')
async def get_notifications_count(current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.is_department_manager:
        count = db.query(ProjectEmployees).join(
            User,
            ProjectEmployees.user_id == User.id,
        ).filter(and_(ProjectEmployees.is_proposal == True, ProjectEmployees.notification_status == True, User.department_id == current_user.department_id)).count()
    else:
        count = 0
    return {"count": count}

@router.post('/notification/seen/{proposal_id}')
async def seen_proposal(proposal_id: int, current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    proposal = db.query(ProjectEmployees).filter(ProjectEmployees.id == proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    if proposal.is_proposal == False:
        raise HTTPException(status_code=400, detail="Proposal is not a proposal")

    proposal.notification_status = False
    db.commit()
    return {"Status": "Proposal is seen"}