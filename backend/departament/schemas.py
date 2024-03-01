from typing import Optional

from pydantic import BaseModel

class DepartamentData(BaseModel):
    departament_name: str
    departament_manager: int

class DepartamentResponse(BaseModel):
    id: int
    organization_id: int
    name: str

class UserData(BaseModel):
    organization_id: int
    email: str



