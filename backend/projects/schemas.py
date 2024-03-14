from datetime import date
from typing import Optional

from pydantic import BaseModel, Field


class ProjectEmployees(BaseModel):
    project_id: int
    role_id: int
    user_id: int
    hours_per_day: int = Field(gt=0, lt=9)

class ProjectData(BaseModel):
    name: str
    description: str
    project_status: str
    start_date: date
    end_date: Optional[date] = None
    description: str
    project_technologies: Optional[list[str]] = None
    project_roles: Optional[list[int]] = None


class ProjectTechnology(BaseModel):
    id: int
    name: str

class ProjectEmployee(BaseModel):
    id: int
    role_id: int
    role_name: Optional[str] = None
    user_id: Optional[int] = None
    user_name: Optional[str] = None
    hours_per_day: Optional[int] = None
    is_proposal: Optional[bool] = None
    is_deallocated: Optional[bool] = None
    comment: Optional[str] = None
    deallocate_comment: Optional[str] = None

class ResponseProjectData(ProjectData):
    id: int
    project_manager_name: str
    project_technologies: list[ProjectTechnology]
    project_roles: list[ProjectEmployee]

class GetProject(BaseModel):
    id: int
    name: str
    period: str
    start_date: date
    end_date: Optional[date] = None
    status: str



