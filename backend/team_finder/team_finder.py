from typing import List

from fastapi import APIRouter, Depends, HTTPException
from requests import Session
from sqlalchemy import and_

from functions.functions import get_current_user, get_project_status_by_id
from storage.models import get_db, Skills, ProjectTechnologies, User, UserSkills, ProjectEmployees, Project
from team_finder.schemas import Skill, Employee, EmployeesProject
from team_finder.utils import is_matching_technology, get_days_remaining, user_is_active
from users.shemas import UserData

router = APIRouter()


@router.get('/employee/{project_id}')
async def get_team(project_id: int, current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    available_skills= []
    technologies = db.query(ProjectTechnologies).filter(ProjectTechnologies.project_id == project_id).all()
    for technology in technologies:
        skills = db.query(Skills).filter(Skills.organization_id == current_user.organization_id).all()
        for skill in skills:
            if is_matching_technology(skill.name,skill.description, technology.name):
                available_skills.append(Skill(id=skill.id, name=skill.name))

    employees = []
    for skill in available_skills:
        users_ids = [user_id[0] for user_id in
                     db.query(UserSkills.user_id).filter(UserSkills.skill_id == skill.id).all()]
        for user_id in users_ids:
            user = db.query(User).filter(User.id == user_id).first()
            employee = employees.get(user_id)
            employee = Employee(id=user.id, name=user.name, skills=skills.append(skill.name))
            user_projects = db.query(ProjectEmployees).filter(ProjectEmployees.user_id == user_id).all()
            for user_project in user_projects:
                if user_is_active(user_project):
                    project = db.query(Project).filter(Project.id == user_project.project_id).first()
                    employee_project=EmployeesProject(hours_per_day=user_project.hours_per_day)
                    if project.end_date:
                        employee_project.remaining_days=get_days_remaining(project.end_date)
                    employee.projects.append(employee_project)
            employees.append(employee)

    return employees
