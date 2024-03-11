from datetime import datetime

from fastapi import Depends
from sqlalchemy.orm import Session

from functions.functions import get_project_status_by_id
from storage.models import get_db


def is_matching_technology(skill_name, skill_description, technology_name):
    skill_name_lower = str(skill_name).lower()
    skill_description_lower = str(skill_description).lower()
    technology_name_lower = str(technology_name).lower()

    return technology_name_lower in skill_name_lower or technology_name_lower in skill_description_lower

def get_days_remaining(project_end_date):
    current_date = datetime.now().date()
    return (project_end_date - current_date).days

def user_is_active(user_project, db: Session=Depends(get_db)):
    if not user_project.is_proposal and not user_project.is_deallocated:
        project_status = get_project_status_by_id(user_project.id, db)
        if project_status == "In Progress" or project_status == "Closing" or project_status == "Starting":
            return True
    return False