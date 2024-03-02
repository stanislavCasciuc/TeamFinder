from typing import Optional, List

from pydantic import BaseModel


class UserData(BaseModel):
    id: int
    name: str
    email: str
    organization_id: int
    departament_id: Optional[int] = None
    roles: List[str]

class ExtendedUserData(BaseModel):
    id: int
    name: str
    email: str
    roles: List[str]
    organization_name: str
    organization_address: str
    departament_name: Optional[str] = None


class AllUsers(BaseModel):
    id: int
    name: str
    roles: List[str]
    departament_name: Optional[str] = None

class UserRoles(BaseModel):
    user_id: int
    roles: List[str]
