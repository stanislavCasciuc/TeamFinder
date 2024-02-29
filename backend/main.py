from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from backend.departament import departament
from backend.skills import skills
from backend.storage import model
from backend.auth import auth
from backend.auth import register
from backend.storage.config import engine

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
app.include_router(register.router)
app.include_router(skills.router)
app.include_router(departament.router)


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

