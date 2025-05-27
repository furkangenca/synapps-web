from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Column şemaları
class ColumnBase(BaseModel):
    title: str
    board_id: int
    position: Optional[int] = None

class ColumnCreate(ColumnBase):
    pass

class ColumnUpdate(BaseModel):
    title: Optional[str] = None
    position: Optional[int] = None

class ColumnResponse(ColumnBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Task şemaları
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = None
    column_id: int
    assigned_user_id: Optional[int] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    column_id: Optional[int] = None
    assigned_user_id: Optional[int] = None

class TaskResponse(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Board şemaları
class BoardBase(BaseModel):
    name: str
    description: Optional[str] = None
    user_id: int

class BoardCreate(BoardBase):
    pass

class BoardUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class BoardResponse(BoardBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# User şemaları
class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Token şemaları
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Board Member şemaları
class BoardMemberBase(BaseModel):
    board_id: int
    user_id: int
    role: Optional[str] = "member"

class BoardMemberCreate(BoardMemberBase):
    pass

class BoardMemberUpdate(BaseModel):
    role: Optional[str] = None

class BoardMemberResponse(BoardMemberBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Notification şemaları
class NotificationBase(BaseModel):
    user_id: int
    message: str
    is_read: bool = False

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None

class NotificationResponse(NotificationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 