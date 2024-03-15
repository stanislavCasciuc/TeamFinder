from pydantic import BaseModel


class SkillData(BaseModel):
    skill_id: int
    minimum_level: int
    project_id: int

class ResponseSkillData(SkillData):
    name: str
    category: str
    description: str
    author_name: str
