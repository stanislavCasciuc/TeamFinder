from typing import Optional

from pydantic import BaseModel

class SkillData(BaseModel):
    id: Optional[int] = None
    name: str
    description: str
    category: str
    author_name: Optional[str] = None
    department_id: Optional[int] = None


class UserData(BaseModel):
    id: int
    name: str
    email: str
    organization_id: int
    department_id: Optional[int] = None
    roles: list[str]


