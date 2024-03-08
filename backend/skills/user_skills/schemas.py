from typing import Optional

from pydantic import BaseModel


class UserAssignData(BaseModel):
    user_id: Optional[int] = None
    skill_id: int
    level: int
    experience: int
    skill_name: Optional[str] = None

class UserSkillUpdate(BaseModel):
    level: Optional[int] = None
    experience: Optional[int] = None
    skill_id: int
    name: Optional[str] = None

class UserSkill(BaseModel):
    id: int
    skill_id: int
    name: str
    experience: int
    level: int

class UserSkillExtended(UserSkill):
    id: Optional[int] = None
    category: str
    author_name: str
    description: str
