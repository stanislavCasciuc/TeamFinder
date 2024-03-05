from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from users import users
from departament import departament
from skills import skills
from storage import model
from auth import auth
from auth import register
from storage.config import engine

model.Base.metadata.create_all(bind=engine)



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth.router, tags=["auth"])

app.include_router(register.router, tags=["register"], prefix="/api")
app.include_router(skills.router, tags=["skills"])
app.include_router(departament.router, tags=["departament"], prefix="/api")
app.include_router(users.router, tags=["users"], prefix="/api")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

