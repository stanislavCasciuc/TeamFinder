from typing import Optional

from pydantic import BaseModel

class SkillsData(BaseModel):
    skill_id: Optional[int] = None
    skill_name: str
    skill_description: str
    skill_category: str
    skil_author_name: Optional[str] = None
