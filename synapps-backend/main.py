from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from routers import task_router, board_router, column_router, board_member_router, notification_router, auth_router, user_router
from models import Base

app = FastAPI()

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL'i
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter(prefix="", tags=["root"])

app.include_router(auth_router)
app.include_router(task_router)
app.include_router(board_router)
app.include_router(column_router)
app.include_router(board_member_router)
app.include_router(notification_router)
app.include_router(user_router)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
@app.get("/", response_model=str)
async def read_root():
    return "API is running"        

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)