# models/board_member.py
from sqlalchemy import Column, Integer, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.schema import UniqueConstraint
from models.base import Base
from enum import Enum as PyEnum

class RoleType(PyEnum):
    OWNER = "owner"
    MEMBER = "member"

class BoardMember(Base):
    __tablename__ = "board_members"
    
    id = Column(Integer, primary_key=True)
    board_id = Column(Integer, ForeignKey("project_boards.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = Column(Enum(RoleType), default=RoleType.MEMBER, nullable=False)
    added_at = Column(DateTime, server_default=func.now())

    project_board = relationship("ProjectBoard", back_populates="board_members")
    user = relationship("User", back_populates="board_members")
    
    # Benzersizlik kısıtını doğru şekilde tanımlıyoruz
    __table_args__ = (
        UniqueConstraint("board_id", "user_id", name="unique_board_user"),
    )