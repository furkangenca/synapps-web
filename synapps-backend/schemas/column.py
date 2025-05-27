# schemas/column.py
from pydantic import BaseModel
from datetime import datetime
from typing import List
from schemas.task import TaskResponse

class ColumnCreate(BaseModel):
    title: str
    board_id: int
    position: int = 0  # Varsayılan değer 0

class ColumnResponse(BaseModel):
    id: int
    title: str
    board_id: int
    position: int
    created_at: datetime
    tasks: List[TaskResponse] = []

    class Config:
        from_attributes = True

class ColumnUpdate(BaseModel):
    title: str = None
    position: int = 0