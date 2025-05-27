# schemas/task.py
from pydantic import BaseModel
from datetime import datetime
from models.task import TaskStatus
from typing import Optional

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    column_id: int
    assigned_user_id: Optional[int] = None
    status: TaskStatus = TaskStatus.todo  # Varsayılan değer küçük harf
    priority: str = "medium"
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    dependency_id: Optional[int] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    column_id: int
    assigned_user_id: Optional[int] = None
    status: TaskStatus
    created_at: datetime
    priority: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    dependency_id: Optional[int] = None

    class Config:
        orm_mode = True

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    column_id: Optional[int] = None
    assigned_user_id: Optional[int] = None
    status: Optional[TaskStatus] = None
    position: Optional[int] = None
    priority: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    dependency_id: Optional[int] = None