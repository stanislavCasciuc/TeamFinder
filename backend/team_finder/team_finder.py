from typing import List

from fastapi import APIRouter, Depends, HTTPException
from requests import Session
from sqlalchemy import and_

from functions.functions import get_current_user, get_project_status_by_id
from storage.models import get_db, Skills, ProjectTechnologies, User, UserSkills, ProjectEmployees, Project
from team_finder.schemas import Employee
from team_finder.utils import get_team_fider
from users.shemas import UserData

router = APIRouter()


@router.get('/team_finder/{project_id}', response_model=List[Employee])
async def get_team(project_id: int, current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    employees = get_team_fider(current_user, project_id, db)

    return employees
