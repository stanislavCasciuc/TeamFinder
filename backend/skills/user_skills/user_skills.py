from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from functions.functions import get_current_user, get_user_by_id
from skills.skills.skills import UserData
from skills.user_skills.schemas import UserAssignData, UserSkillUpdate, UserSkill, UserSkillExtended
from storage.model import Skills, get_db, UserSkills

router = APIRouter()


@router.post('/user/skill/assign', response_model=UserAssignData)
async def assign_skill(current_user: UserData = Depends(get_current_user), assign_data: UserAssignData = Depends(), db: Session = Depends(get_db)):
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
    user_skill.experience = skill_data.experience
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
        user_skill = UserSkillExtended(skill_id=skill.skill_id, name=skill_data.name, level=skill.level, experience=skill.experience, author_name=get_user_by_id(skill_data.author_id, db).name, description=skill_data.description, category=skill_data.category)
        response.append(user_skill)
    return response