from typing import Optional

from pydantic import BaseModel

class SkillData(BaseModel):
    id: Optional[int] = None
    name: str
    description: str
    category: str
    author_name: Optional[str] = None

class AssignData(BaseModel):
    user_id: Optional[int] = None
    skill_id: int
    level: int
    experience: int
    skill_name: Optional[str] = None