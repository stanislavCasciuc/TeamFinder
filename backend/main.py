from fastapi import FastAPI
import model
from router import router
from config import engine, SessionLocal

model.Base.metadata.create_all(bind=engine)



app = FastAPI()

app.include_router(router)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)

