from typing import Optional

from pydantic import BaseModel, Field


class UserAssignData(BaseModel):
    user_id: Optional[int] = None
    skill_id: int
    level: int = Field(gt=1, lt=5)
    experience: int
    skill_name: Optional[str] = None

class UserSkillUpdate(BaseModel):
    level: int = Field(gt=0, lt=6)
    experience: int
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
