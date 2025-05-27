# schemas/notification.py
from pydantic import BaseModel
from datetime import datetime

class NotificationCreate(BaseModel):
    user_id: int
    notification_type: str
    message: str
    related_item_id: int = None
    related_item_type: str = None
    data: dict = None

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    notification_type: str
    message: str
    is_read: bool
    created_at: datetime
    updated_at: datetime
    related_item_id: int = None
    related_item_type: str = None
    data: dict = None

    class Config:
        orm_mode = True

class NotificationUpdate(BaseModel):
    is_read: bool = None
    message: str = None