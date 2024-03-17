from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel

class DepartmentData(BaseModel):
    department_name: str
    department_manager: int

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    department_id: int
    department_manager: Optional[int] = None


class ResponseDepartmentUpdate(BaseModel):
    name: Optional[str] = None
    department_id: int
    department_manager_name: Optional[str] = None


class DepartmentResponse(BaseModel):
    department_id: int
    name: str
    department_manager_name: str

class UserData(BaseModel):
    name: str
    id: int
    is_department_manager: bool
    department_id: Optional[int] = None

class UserDataExtended(BaseModel):
    username: str
    user_id: int
    roles: list[str]

class UserDataResponse(BaseModel):
    user_id: int
    username: str

class MyDepartment(BaseModel):
    department_id: int
    department_name: str
    department_users: list[UserDataExtended]

class AssignDepartment(BaseModel):
    user_id: int

class DepartmentProject(BaseModel):
    project_id: int
    project_name: str
    members: list[str]
    end_date: datetime
    technologies: list[str]
    project_status: str





