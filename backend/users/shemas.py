from typing import Optional, List

from pydantic import BaseModel


class UserData(BaseModel):
    id: int
    name: str
    email: str
    organization_id: int
    department_id: Optional[int] = None
    roles: List[str]


class Skill(BaseModel):
    id: int
    name: str | None
    experience: int
    level: int

class Profil(BaseModel):
    id: int
    name: str
    email: str
    organization_name: str
    organization_address: str
    department_name: Optional[str] = None
    roles: List[str]
    skills: List[Skill] | None

class ExtendedUserData(BaseModel):
    id: int
    name: str
    email: str
    roles: List[str]
    organization_name: str
    organization_address: str
    department_name: Optional[str] = None


class AllUsers(BaseModel):
    id: int
    name: str
    roles: List[str]
    department_name: Optional[str] = None

class UserRoles(BaseModel):
    user_id: int
    roles: List[str]

class UserNames(BaseModel):
    user_id: int
    username: str
    is_organization_admin: Optional[bool] = None
    is_department_manager: Optional[bool] = None
    department_id: Optional[int] = None

