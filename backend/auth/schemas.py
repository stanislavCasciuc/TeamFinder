from pydantic import BaseModel
from typing import List, Optional

class RegisterUser(BaseModel):
    organization_id: Optional[int] = None
    id: Optional[int] = None
    name: str
    email: str
    password: str
    role: Optional [str] = None
    organization_name: Optional[str] = None
    organization_address: Optional[str] = None
    organization_admin: Optional[bool] = False
    departament_id: Optional[int] = None


class ResponseUser(BaseModel):
    id: int
    organization_id: int

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    name: Optional[str]=None
    organization_id: Optional[int]=None
    id: int











