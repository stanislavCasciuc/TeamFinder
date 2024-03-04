from typing import Optional

from pydantic import BaseModel

class SkillsData(BaseModel):
    skill_id: Optional[int] = None
    skill_name: str
    skill_description: Optional[str] = None
    skill_category: str
    user_id: int
    dapartment_id: int
    skil_author_name: Optional[str] = None
