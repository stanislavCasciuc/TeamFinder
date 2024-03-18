from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_
from sqlalchemy.orm import Session

from functions.functions import get_current_user, get_user_by_id
from skills.department_skills.schemas import DepartmentSkill
from skills.skills.skills import SkillData, UserData
from storage.models import get_db, Skills, DepartmentSkills, User, UserSkills

router = APIRouter()

@router.post('/department/skill/assign/{skill_id}', response_model = SkillData)
async def assign_skill_to_department(skill_id: int,current_user: UserData = Depends(get_current_user),  db: Session = Depends(get_db)):
    if not current_user.is_organization_admin and not current_user.is_department_manager:
        raise HTTPException(status_code=403, detail="You are not allowed to assign skill to department")


    skill = db.query(Skills).filter(Skills.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    department_skill = db.query(DepartmentSkills).filter(and_(DepartmentSkills.department_id == current_user.department_id, DepartmentSkills.skill_id == skill_id)).first()
    if department_skill:
        raise HTTPException(status_code=400, detail="Skill already assigned to department")

    department_skill = DepartmentSkills(department_id=current_user.department_id, skill_id=skill_id)
    db.add(department_skill)
    db.commit()
    response = SkillData(id=skill.id, name=skill.name, category=skill.category, description=skill.description, author_name=get_user_by_id(skill.author_id, db).name)
    return response

@router.get('/department/skills', response_model = list[SkillData])
async def get_department_skills(current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    department_skills = db.query(DepartmentSkills).filter(DepartmentSkills.department_id == current_user.department_id).all()

    response = []
    for skill in department_skills:
        skill_data = db.query(Skills).filter(Skills.id == skill.skill_id).first()
        skill_obj = SkillData(id=skill_data.id, name=skill_data.name, category=skill_data.category, description=skill_data.description, author_name=get_user_by_id(skill_data.author_id, db).name)
        response.append(skill_obj)
    return response

@router.delete('/department/skill/{skill_id}')
async def delete_department_skill(skill_id: int, current_user: UserData = Depends(get_current_user),  db: Session = Depends(get_db)):
    if not current_user.is_organization_admin and not current_user.is_department_manager:
        raise HTTPException(status_code=403, detail="You are not allowed to delete skill from department")

    department_skill = db.query(DepartmentSkills).filter(and_(DepartmentSkills.department_id == current_user.department_id, DepartmentSkills.skill_id == skill_id)).first()
    if not department_skill:
        raise HTTPException(status_code=404, detail="Skill not found in department")

    db.delete(department_skill)
    db.commit()
    return {"detail": "Skill successfully deleted from department"}

@router.get('/department/skill/{skill_id}', response_model=DepartmentSkill)
async def get_department_skill(skill_id: int, current_user: UserData = Depends(get_current_user),  db: Session = Depends(get_db)):
    if not current_user.is_organization_admin and not current_user.is_department_manager:
        raise HTTPException(status_code=403, detail="You are not allowed to get skill from department")
    skill = db.query(Skills).filter(Skills.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found in department")

    count_department_users = db.query(User).filter(User.department_id == current_user.department_id).count()

    department_skill_levels = db.query(UserSkills.level).join(User, User.id == UserSkills.user_id).filter(and_(User.department_id == current_user.department_id, UserSkills.skill_id == skill_id)).all()
    skill_levels = [level for (level,) in department_skill_levels]
    count_of_users_with_skill = len(skill_levels)
    count_levels = {
        "level_1": skill_levels.count(1),
        "level_2": skill_levels.count(2),
        "level_3": skill_levels.count(3),
        "level_4": skill_levels.count(4),
        "level_5": skill_levels.count(5)
    }

    response = {
        "id": skill.id,
        "name": skill.name,
        "category": skill.category,
        "description": skill.description,
        "author_name": get_user_by_id(skill.author_id, db).name,
        "count_of_users_with_skill": count_of_users_with_skill,
        "count_levels": count_levels,
        "count_department_users": count_department_users,
    }
    return response