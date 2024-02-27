from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

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

app.include_router(auth.router)
app.include_router(register.router)
app.include_router(skills.router)


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)

