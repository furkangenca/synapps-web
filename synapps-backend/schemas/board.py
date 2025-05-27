# schemas/board.py
from pydantic import BaseModel
from datetime import datetime

class ProjectBoardCreate(BaseModel):
    name: str
    user_id: int
    description: str = None

class ProjectBoardResponse(BaseModel):
    id: int
    name: str
    user_id: int
    created_at: datetime
    description: str = None

    class Config:
        orm_mode = True

class ProjectBoardUpdate(BaseModel):
    name: str = None
    user_id: int = None
    description: str = None