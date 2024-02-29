from pydantic import BaseModel
from typing import List, Optional

class RegisterUser(BaseModel):
    organization_id: Optional[int] = None
    id: Optional[int] = None
    name: str
    email: str
    password: str
    role: str
    organization_name: Optional[str] = None
    organization_address: Optional[str] = None
    departament_id: Optional[int] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    name: Optional[str]=None
    organization_id: Optional[int]=None
    id: int

class ResponseUser(BaseModel):
    id: int
    organization_id: int

class ResponseAllUsers(BaseModel):
    all_users: List[ResponseUser]










