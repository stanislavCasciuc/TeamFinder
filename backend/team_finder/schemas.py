from typing import Optional, List

from pydantic import BaseModel


class Skill(BaseModel):
    id: int
    name: str

class Technology(BaseModel):
    id: int
    name: str

class EmployeesProject(BaseModel):
    project_name: str
    remaining_days: Optional[int] = None
    hours_per_day: int

class Employee(BaseModel):
    id: int
    name: str
    skills: Optional[List[str]] = None
    projects: Optional[List[EmployeesProject]] = None
