from typing import Optional

from pydantic import BaseModel

class DepartmentData(BaseModel):
    departament_name: str
    departament_manager: int

class DepartmentResponse(BaseModel):
    department_id: int
    name: str
    departament_manager_name: str

class UserData(BaseModel):
    name: str
    id: int
    is_department_manager: bool
    departament_id: Optional[int] = None

class UserDataResponse(BaseModel):
    user_id: int
    username: str

class MyDepartment(BaseModel):
    department_id: int
    department_name: str
    department_users: list[UserData]

class AssignDepartment(BaseModel):
    user_id: int




