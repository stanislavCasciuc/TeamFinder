from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_
from sqlalchemy.orm import Session

from functions.functions import get_current_user
from skills.project_skills.schemas import SkillData, ResponseSkillData
from storage.models import get_db, ProjectEmployees, ProjectSkill, Skills, User
from users.shemas import UserData

router = APIRouter()


@router.post('/project/skill', response_model=ResponseSkillData )
async def create_project_skill(skill_data: SkillData = Depends(), current_user: UserData = Depends(get_current_user),db: Session = Depends(get_db)):
    is_member = db.query(ProjectEmployees).filter(and_(ProjectEmployees.project_id == skill_data.project_id, ProjectEmployees.user_id == current_user.id)).first()

    skill = db.query(Skills.name, Skills.description, Skills.category, User.name.label("author_name")).join(User, User.id == Skills.author_id).filter(Skills.id == skill_data.skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    if not is_member and not current_user.is_proejct_manager:
        raise HTTPException(status_code=403, detail="You are not member of this project")

    is_project_skill= db.query(ProjectSkill).filter(and_(ProjectSkill.project_id == skill_data.project_id, ProjectSkill.skill_id == skill_data.skill_id)).first()
    if is_project_skill:
        raise HTTPException(status_code=400, detail="Skill already assigned to project")

    project_skill = ProjectSkill(project_id= skill_data.project_id, skill_id=skill_data.skill_id, min_level=skill_data.minimum_level)

    db.add(project_skill)
    db.commit()
    db.refresh(project_skill)

    response=ResponseSkillData(**skill_data.dict(), name=skill.name, category=skill.category, description=skill.description, author_name=skill.author_name)

    return response