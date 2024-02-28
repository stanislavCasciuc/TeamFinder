from fastapi import APIRouter, Depends, HTTPException


router = APIRouter()

@router.post('/skills/create/')
async def create_skill():
    return {"message": "Create skill"}

@router.get('/projects/')
async def get_projects():
    return {"message": "Get projects"}