from typing import Optional, List

from pydantic import BaseModel


class Skill(BaseModel):
    id: int
    name: str

class Technology(BaseModel):
    id: int
    name: str

class EmployeesProject(BaseModel):
    remaining_days: int
    hours_per_day: Optional[int] = None

class Employee(BaseModel):
    id: int
    name: str
    skills: list[str]
    projects: Optional[List[EmployeesProject]] = None
