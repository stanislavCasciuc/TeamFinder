from pydantic import BaseModel


class Levels(BaseModel):
    level_1: int
    level_2: int
    level_3: int
    level_4: int
    level_5: int

class DepartmentSkill(BaseModel):
    id: int
    name: str
    category: str
    description: str
    author_name: str
    count_of_users_with_skill: int
    count_levels: Levels
    count_department_users: int