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


@router.get('/team_finder/{project_id}')
async def get_team(project_id: int, current_user: UserData = Depends(get_current_user), db: Session = Depends(get_db)):
    available_skills = []
    available_skills_ids = []
    technologies = db.query(ProjectTechnologies).filter(ProjectTechnologies.project_id == project_id).all()
    for technology in technologies:
        skills = db.query(Skills).filter(Skills.organization_id == current_user.organization_id).all()
        for skill in skills:
            if is_matching_technology(skill.name,skill.description, technology.name):
                available_skills.append(Skill(id=skill.id, name=skill.name))
                available_skills_ids.append(skill.id)

    employees = []

    users_ids = db.query(UserSkills.user_id).filter(UserSkills.skill_id.in_(available_skills_ids)).distinct().all()
    unique_user_ids_list = [user_id for (user_id,) in users_ids]
    for user_id in unique_user_ids_list:
        user = db.query(User).filter(User.id == user_id).first()
        if not user.department_id:
            raise HTTPException(status_code=404, detail="User department not found")
        user_skills_names = db.query(Skills.name).join(UserSkills, Skills.id == UserSkills.skill_id).filter(UserSkills.skill_id.in_(available_skills_ids)).all()
        user_skills_names_list = [name for (name,) in user_skills_names]

        employee = Employee(id=user.id, name=user.name, skills=user_skills_names_list)
        user_projects = db.query(ProjectEmployees).filter(ProjectEmployees.user_id == user_id).all()
        for user_project in user_projects:
            if user_is_active(user_project, db):
                if user_project.project_id == project_id:
                    continue
                project = db.query(Project).filter(Project.id == user_project.project_id).first()
                employee_project = EmployeesProject(hours_per_day=user_project.hours_per_day, project_name=project.name)
                if project.end_date:
                    employee_project.remaining_days = get_days_remaining(project.end_date)
                if employee.projects is None:
                    employee.projects = []
                employee.projects.append(employee_project)
        employees.append(employee)

    return employees
