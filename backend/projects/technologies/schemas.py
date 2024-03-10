from typing import Optional

from pydantic import BaseModel


class TechnologyData(BaseModel):
    id: Optional[int] = None
    name: str
    project_id: int

class TechnologyDelete(BaseModel):
    id: int
    project_id: int