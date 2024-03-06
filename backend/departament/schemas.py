from typing import Optional

from pydantic import BaseModel

class DepartmentData(BaseModel):
    department_name: str
    department_manager: int

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




