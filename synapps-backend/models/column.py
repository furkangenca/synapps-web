from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from models.base import Base  # Base'i buradan ithal ediyoruz

class Column(Base):
    __tablename__ = "columns"
    
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    board_id = Column(Integer, ForeignKey("project_boards.id", ondelete="CASCADE"), nullable=False)
    position = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    project_board = relationship("ProjectBoard", back_populates="columns")
    tasks = relationship("Task", back_populates="column", cascade="all, delete-orphan", order_by="Task.position")