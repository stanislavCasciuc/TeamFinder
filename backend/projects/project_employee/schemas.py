from typing import Optional

from pydantic import BaseModel, Field


class ProposalData(BaseModel):
    user_id: int
    hours_per_day: int = Field(gt=0, lt=9)
    comment: str
    id: int


class DeallocateData(BaseModel):
    user_id: int
    comment: str
    id: int

class EmployeeProject(BaseModel):
    project_id: int
    project_name: str
    technologies: list[str]
    roles: list[str]
    is_active: bool = False

