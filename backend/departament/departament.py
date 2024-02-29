from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.departament.schemas import DepartamentData
from backend.storage.model import get_db

router = APIRouter()

@router.post('/departament/create/')
async def create_departament(departament_data: DepartamentData = Depends(), db: Session = Depends(get_db)):
    return {"message": "Create departament"}