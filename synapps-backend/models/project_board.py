from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from models.base import Base  # Base'i buradan ithal ediyoruz

class ProjectBoard(Base):
    __tablename__ = "project_boards"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="project_boards")
    columns = relationship("Column", back_populates="project_board", cascade="all, delete-orphan")
    board_members = relationship("BoardMember", back_populates="project_board", cascade="all, delete-orphan")