from typing import ClassVar

from pydantic import BaseModel

class NotificationType(BaseModel):
    DEALLOCATION: ClassVar[str] = "deallocation"
    PROPOSAL: ClassVar[str] = "proposal"

class Notification(BaseModel):
    type: str
    id: int
    user_id: int
    username: str
    project_id: int
    comment: str
    project_name: str

