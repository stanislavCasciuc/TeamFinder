from pydantic import BaseModel
from typing import List, Optional
class OrganizationUser(BaseModel):
    id: Optional[int]=None
    organization_id: Optional[int]=None
    name: str
    email: str
    password: str
    organization_name: str
    address: str
    role: str = "organization"
# class EmployeeUser(BaseModel):
#     id: Optional[int]=None
#     organization_id: int
#     name: str
#     email: str
#     password: str
#     role: str ="employee"






