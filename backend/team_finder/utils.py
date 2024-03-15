from datetime import datetime

from fastapi import Depends
from sqlalchemy import and_
from sqlalchemy.orm import Session


from functions.functions import get_project_status_by_id
from storage.models import get_db, ProjectTechnologies, Skills, UserSkills, User, ProjectEmployees, Project
from team_finder.schemas import Skill, Employee, EmployeesProject


def is_matching_technology(skill_name, skill_description, technology_name):
    skill_name_lower = str(skill_name).lower()
    skill_description_lower = str(skill_description).lower()
    technology_name_lower = str(technology_name).lower()

    return technology_name_lower in skill_name_lower or technology_name_lower in skill_description_lower

def get_days_remaining(project_end_date):
    current_date = datetime.now().date()
    return (project_end_date.date() - current_date).days

def user_is_active(user_project, db: Session=Depends(get_db)):
    if not (user_project.is_proposal is True and  user_project.is_deallocated is False):
        project_status = get_project_status_by_id(user_project.project_id, db)
        if project_status == "In Progress" or project_status == "Closing" or project_status == "Starting":
            return True
    return False

def get_team_fider(current_user, project_id ,db:Session):
    available_skills = []
    available_skills_ids = []
    technologies = db.query(ProjectTechnologies).filter(ProjectTechnologies.project_id == project_id).all()
    for technology in technologies:
        skills = db.query(Skills).filter(Skills.organization_id == current_user.organization_id).all()
        for skill in skills:
            if is_matching_technology(skill.name, skill.description, technology.name):
                available_skills.append(Skill(id=skill.id, name=skill.name))
                available_skills_ids.append(skill.id)

    employees = []

    users_ids = db.query(UserSkills.user_id).filter(UserSkills.skill_id.in_(available_skills_ids)).distinct().all()
    unique_user_ids_list = [user_id for (user_id,) in users_ids]
    for user_id in unique_user_ids_list:
        user = db.query(User).filter(User.id == user_id).first()
        if not user.department_id:
            continue
        user_skills_names = db.query(Skills.name).join(UserSkills, Skills.id == UserSkills.skill_id).filter(
            and_(UserSkills.user_id == user.id, UserSkills.skill_id.in_(available_skills_ids))).all()
        user_skills_names_list = [name for (name,) in user_skills_names]

        employee = Employee(id=user.id, name=user.name, skills=user_skills_names_list)
        user_projects = db.query(ProjectEmployees).filter(ProjectEmployees.user_id == user_id).all()
        for user_project in user_projects:
            if user_is_active(user_project, db):
                project = db.query(Project).filter(Project.id == user_project.project_id).first()
                employee_project = {
                    "hours_per_day": user_project.hours_per_day,
                    "project_name": project.name,
                    "remaining_days": get_days_remaining(project.end_date) if project.end_date else None
                }
                # if project.end_date:
                #     employee_project["remaining_days"] = get_days_remaining(project.end_date)
                if employee.projects is None:
                    employee.projects = []
                employee.projects.append(employee_project)
        employees.append(employee)
    return employees