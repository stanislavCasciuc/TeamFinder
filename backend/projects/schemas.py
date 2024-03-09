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


class ProjectTechnology(BaseModel):
    id: int
    name: str

class ResponseProjectData(ProjectData):
    id: int
    project_manager_name: str
    project_technologies: list[ProjectTechnology]



