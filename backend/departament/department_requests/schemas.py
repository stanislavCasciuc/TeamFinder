from pydantic import BaseModel


class Request(BaseModel):
    id: int
    user_id: int
    username: str
    project_id: int
    comment: str
    project_name: str