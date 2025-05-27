# schemas/board_member.py
from pydantic import BaseModel
from datetime import datetime
from models.board_member import RoleType
from schemas.user import UserResponse

class BoardMemberCreate(BaseModel):
    board_id: int
    user_id: int
    role: RoleType = RoleType.MEMBER  # Varsayılan olarak "member"

class BoardMemberResponse(BaseModel):
    id: int
    board_id: int
    user_id: int
    role: RoleType
    added_at: datetime

    class Config:
        orm_mode = True

class BoardMemberUpdate(BaseModel):
    role: RoleType = None

class BoardMemberWithUserResponse(BoardMemberResponse):
    user: UserResponse