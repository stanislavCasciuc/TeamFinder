from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from departament.schemas import UserData
from functions.functions import get_current_user, get_user_by_id
from skills.skills.schemas import SkillData
from storage.model import get_db, Skills, User, DepartmentSkills, UserSkills

router = APIRouter()

@router.post('/skill', response_model=SkillData)
async def create_skill(current_user: UserData = Depends(get_current_user), skill: SkillData = Depends(), db: Session = Depends(get_db)):
    if not current_user.is_department_manager:
        raise HTTPException(status_code=403, detail="You are not allowed to create skill, you are not a department manager")

    db_skill = Skills(organization_id=current_user.organization_id, author_id=current_user.id, name=skill.name, category=skill.category, description=skill.description, department_id=current_user.department_id)
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
    all_skills = db.query(Skills).filter(Skills.organization_id == current_user.organization_id).all()
    response = []
    for skill in all_skills:
        author_name = db.query(User).filter(User.id == skill.author_id).first().name
        skill_data = SkillData(id=skill.id, name=skill.name, category=skill.category, description=skill.description, author_name=author_name, department_id=skill.department_id)
        response.append(skill_data)
    return response




@router.delete('/skill/{skill_id}')
async def delete_skill(skill_id: int, current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_department_manager:
        raise HTTPException(status_code=403, detail="You are not allowed to delete skill, you are not a department manager")
    skill = db.query(Skills).filter(Skills.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    if skill.department_id != current_user.department_id:
        raise HTTPException(status_code=403, detail="You are not allowed to delete this skill")

    departments_skills = db.query(DepartmentSkills).filter(DepartmentSkills.skill_id == skill_id).all()
    for department_skill in departments_skills:
        db.delete(department_skill)

    users_skills = db.query(UserSkills).filter(UserSkills.skill_id == skill_id).all()
    for user_skill in users_skills:
        db.delete(user_skill)

    db.delete(skill)
    db.commit()
    return {"detail": "Skill successfully deleted"}

@router.put('/skill', response_model=SkillData)
async def update_skill(skill_data: SkillData = Depends(), current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_department_manager:
        raise HTTPException(status_code=403, detail="You are not allowed to update skill, you are not a department manager")
    skill = db.query(Skills).filter(Skills.id == skill_data.id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    if skill.department_id != current_user.department_id:
        raise HTTPException(status_code=403, detail="You are not allowed to update this skill")

    if skill_data.name:
        skill.name = skill_data.name
    if skill_data.category:
        skill.category = skill_data.category
    if skill_data.description:
        skill.description = skill_data.description
    db.commit()
    db.refresh(skill)
    response = SkillData(id=skill.id, name=skill.name, category=skill.category, description=skill.description, author_name=get_user_by_id(skill.author_id, db).name)
    return response


