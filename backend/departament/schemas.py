from typing import Optional

from pydantic import BaseModel

class DepartamentData(BaseModel):
    departament_name: str
    departament_manager: int

class DepartamentResponse(BaseModel):
    id: int
    name: str
    departament_manager_name: str

class UserData(BaseModel):
    name: str
    id: int
    roles: list[str]
    departament_id: Optional[int] = None

class UserDataResponse(BaseModel):
    user_id: int
    username: str

class MyDepartament(BaseModel):
    department_id: int
    department_name: str
    department_users: list[UserData]

class AssignDepartment(BaseModel):
    user_id: int



