from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from departament.schemas import UserData
from functions.functions import get_current_user
from skills.schemas import SkillsData
from storage.model import get_db, Skills, Department_skills


router = APIRouter()

@router.post('/skills/create/', response_model=SkillsData)
async def create_skill(current_user: UserData = Depends(get_current_user), skill: SkillsData = Depends(), db: Session = Depends(get_db)):
    if not current_user.is_department_manager:
        raise HTTPException(status_code=403, detail="You are not allowed to create skill, you are not a department manager")

    if skill.dapartment_id != current_user.departament_id:
        raise HTTPException(status_code=403, detail="You are not allowed to create skill for other department")

    db_skill = Skills(organization_id=current_user.organization_id, author=current_user.id, name=skill.skill_name, category=skill.skill_category, description=skill.skill_description)
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)

    skill.skill_id = db_skill.id

    # skill_department = Department_skills(skill_id=db_skill.id,  department_id=current_user.dapartment_id)
    # db.add(skill_department)
    # db.commit()

    skill.author_name = current_user.name
    return skill


