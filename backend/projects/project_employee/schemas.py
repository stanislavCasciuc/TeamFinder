from pydantic import BaseModel, Field


class ProposalData(BaseModel):
    project_id: int
    user_id: int
    hours_per_day: int = Field(gt=0, lt=9)
    comment: str
    id: int


