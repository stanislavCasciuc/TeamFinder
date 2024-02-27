from pydantic import BaseModel

class SkillsData(BaseModel):
    id: int
    name: str
    description: str