from typing import Optional

from pydantic import BaseModel

class DepartamentData(BaseModel):
    organization_id: int
    id: Optional[int] = None
    name: str
    departament_manager: int
