from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_, not_
from sqlalchemy.orm import Session

from functions.functions import get_current_user, get_user_by_id
from skills.skills.skills import UserData
from skills.user_skills.schemas import UserAssignData, UserSkillUpdate, UserSkill, UserSkillExtended, \
    UserSkillEndorsement, ResponseSkillEndorsement, UpdateSkillEndorsement
from skills.user_skills.utils import subtract_months_from_date, months_until_current_date
from storage.models import Skills, get_db, UserSkills, ProjectEmployees, SkillEndorsement, User
from storage.variables import PROJECT, CERTIFICATION, COURSE, TRAINING

router = APIRouter()


@router.post('/user/skill/assign', response_model=UserAssignData)
async def assign_skill(current_user: UserData = Depends(get_current_user), assign_data: UserAssignData = Depends(), db: Session = Depends(get_db)):
    skill = db.query(Skills).filter(Skills.id == assign_data.skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    exist_user_skill = db.query(UserSkills).filter(UserSkills.user_id == current_user.id, UserSkills.skill_id == assign_data.skill_id).first()
    if exist_user_skill:
        raise HTTPException(status_code=400, detail="Skill already assigned to user")

    current_date = datetime.now().date()
    experience = subtract_months_from_date(current_date, assign_data.experience)

    user_skill = UserSkills(user_id=current_user.id, skill_id=assign_data.skill_id, level=assign_data.level, experience=experience)
    db.add(user_skill)
    db.commit()
    assign_data.skill_name = skill.name
    return assign_data


@router.delete('/user/skill/{skill_id}')
async def delete_user_skill(skill_id: int, current_user: UserData = Depends(get_current_user),  db: Session = Depends(get_db)):
    user_skill = db.query(UserSkills).filter(UserSkills.user_id == current_user.id, UserSkills.skill_id == skill_id).first()
    if not user_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(user_skill)
    db.commit()
    return {"Status": "Skill deleted successfully"}

@router.put('/user/skill', response_model=UserSkillUpdate)
async def update_user_skill(skill_data: UserSkillUpdate = Depends(), current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    user_skill = db.query(UserSkills).filter(UserSkills.user_id == current_user.id, UserSkills.skill_id == skill_data.skill_id).first()
    if not user_skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    user_skill.level = skill_data.level
    db.commit()

    skill_data= UserSkillUpdate(skill_id=user_skill.skill_id, level=user_skill.level, experience=user_skill.experience,)
    skill_data.name = db.query(Skills).filter(Skills.id == user_skill.skill_id).first().name
    return skill_data

@router.get('/user/skills', response_model=List[UserSkillExtended])
async def get_user_skills(current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    user_skills = db.query(UserSkills).filter(UserSkills.user_id == current_user.id).all()
    response = []
    for skill in user_skills:
        skill_data = db.query(Skills).filter(Skills.id == skill.skill_id).first()
        experience = months_until_current_date(skill.experience)
        user_skill = UserSkillExtended(skill_id=skill.skill_id, name=skill_data.name, level=skill.level, experience=experience, author_name=get_user_by_id(skill_data.author_id, db).name, description=skill_data.description, category=skill_data.category)
        response.append(user_skill)
    return response

@router.post('/user/skills/endorsement')
async def endorse_skill(endorsement_data: UserSkillEndorsement, current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):

    skill = db.query(Skills).filter(Skills.id == endorsement_data.skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    user_skill = db.query(UserSkills).filter(UserSkills.user_id == current_user.id, UserSkills.skill_id == endorsement_data.skill_id).first()
    if not user_skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    if endorsement_data.type == PROJECT:
        is_project_member = db.query(ProjectEmployees).filter(
            and_(ProjectEmployees.project_id == endorsement_data.project_id,
                 ProjectEmployees.user_id == current_user.id,
                 not_(and_(ProjectEmployees.is_deallocated == False, ProjectEmployees.is_proposal == True)))).first()
        if not is_project_member:
            raise HTTPException(status_code=403, detail="You are not allowed to endorse this skill")
        endorsement = SkillEndorsement(user_id=current_user.id, skill_id=endorsement_data.skill_id,project_id=endorsement_data.project_id, type=endorsement_data.type)
    elif endorsement_data.type in [CERTIFICATION, COURSE, TRAINING]:
        endorsement = SkillEndorsement(user_id=current_user.id, skill_id=endorsement_data.skill_id, title=endorsement_data.title, description=endorsement_data.description, type=endorsement_data.type)
    else:
        raise HTTPException(status_code=400, detail="Invalid type")

    db.add(endorsement)
    db.commit()
    return {"Status": "Skill endorsed successfully"}

@router.get('/user/skills/endorsement/{user_id}/{skill_id}', response_model=List[ResponseSkillEndorsement])
async def get_user_endorsements(user_id: int, skill_id: int, current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):

    user = db.query(User).filter(User.id == user_id).first()
    if user.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="You are not part of the same organization as the user")

    endorsements = db.query(SkillEndorsement).filter(and_(SkillEndorsement.user_id == user_id, SkillEndorsement.skill_id == skill_id)).all()

    return [{**endorsement.__dict__}  for endorsement in endorsements]

@router.delete('/user/skills/endorsement/{endorse_id}')
async def delete_endorsement(endorse_id: int, current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):

    endorsement = db.query(SkillEndorsement).filter(SkillEndorsement.id == endorse_id).first()
    if not endorsement:
        raise HTTPException(status_code=404, detail="Endorsement not found")
    if endorsement.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="It is not your endorsement")

    db.delete(endorsement)
    db.commit()
    return {"Status": "Endorsement deleted successfully"}

@router.put('/user/skills/endorsement/{endorse_id}', response_model=ResponseSkillEndorsement)
async def update_endorsement_data(endorse_id: int, endorsement_data: UpdateSkillEndorsement, current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):

    endorsement = db.query(SkillEndorsement).filter(SkillEndorsement.id == endorse_id).first()
    if not endorsement:
        raise HTTPException(status_code=404, detail="Endorsement not found")
    if endorsement.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="It is not your endorsement")

    if endorsement_data.type == PROJECT:
        is_project_member = db.query(ProjectEmployees).filter(
            and_(ProjectEmployees.project_id == endorsement_data.project_id,
                 ProjectEmployees.user_id == current_user.id,
                 not_(and_(ProjectEmployees.is_deallocated == False, ProjectEmployees.is_proposal == True)))).first()
        if not is_project_member:
            raise HTTPException(status_code=403, detail="You are not allowed to endorse this skill")
        endorsement.project_id = endorsement_data.project_id
        endorsement.title = None
        endorsement.description = None
    elif endorsement_data.type in [CERTIFICATION, COURSE, TRAINING]:
        endorsement.project_id = None
        endorsement.title = endorsement_data.title
        endorsement.description = endorsement_data.description
    else:
        raise HTTPException(status_code=400, detail="Invalid type")
    endorsement.type = endorsement_data.type

    db.commit()
    db.refresh(endorsement)
    return {**endorsement.__dict__}