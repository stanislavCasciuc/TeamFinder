from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from departament.schemas import UserData
from functions.functions import get_current_user
from skills.schemas import SkillData, AssignData
from storage.model import get_db, Skills, User, UserSkills

router = APIRouter()

@router.post('/skill', response_model=SkillData)
async def create_skill(current_user: UserData = Depends(get_current_user), skill: SkillData = Depends(), db: Session = Depends(get_db)):
    if not current_user.is_department_manager:
        raise HTTPException(status_code=403, detail="You are not allowed to create skill, you are not a department manager")

    db_skill = Skills(organization_id=current_user.organization_id, author_id=current_user.id, name=skill.name, category=skill.category, description=skill.description)
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)

    skill.id = db_skill.id

    # skill_department = Department_skills(skill_id=db_skill.id,  department_id=current_user.dapartment_id)
    # db.add(skill_department)
    # db.commit()

    skill.author_name = current_user.name
    return skill

@router.get('/skills', response_model=List[SkillData])
async def get_skills(current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not (current_user.is_department_manager or current_user.is_organization_admin):
        raise HTTPException(status_code=403, detail="You are not allowed to list all skills, you are not a department manager")
    all_skills = db.query(Skills).filter(Skills.organization_id == current_user.organization_id).all()
    response = []
    for skill in all_skills:
        author_name = db.query(User).filter(User.id == skill.author_id).first().name
        skill_data = SkillData(id=skill.id, name=skill.name, category=skill.category, description=skill.description, author_name=author_name)
        response.append(skill_data)
    return response

@router.post('/skill/assign', response_model=AssignData)
async def assign_skill(current_user: UserData = Depends(get_current_user), assign_data: AssignData = Depends(), db: Session = Depends(get_db)):
    skill = db.query(Skills).filter(Skills.id == assign_data.skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    exist_user_skill = db.query(UserSkills).filter(UserSkills.user_id == current_user.id, UserSkills.skill_id == assign_data.skill_id).first()
    if exist_user_skill:
        raise HTTPException(status_code=400, detail="Skill already assigned to user")

    user_skill = UserSkills(user_id=current_user.id, skill_id=assign_data.skill_id, level=assign_data.level, experience=assign_data.experience)
    db.add(user_skill)
    db.commit()
    assign_data.skill_name = skill.name
    return assign_data

