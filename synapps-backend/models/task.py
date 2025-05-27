# models/task.py
from sqlalchemy import Column, DateTime, Integer, String, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from models.base import Base
from enum import Enum as PyEnum

class TaskStatus(PyEnum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"
    review = "review"
    cancelled = "cancelled"

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    column_id = Column(Integer, ForeignKey("columns.id", ondelete="CASCADE"), nullable=False)
    assigned_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)  # Nullable=True eklendi
    status = Column(Enum(TaskStatus, name="task_status"), default=TaskStatus.todo, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    position = Column(Integer, default=0, nullable=False)
    priority = Column(String, default="medium", nullable=False)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    dependency_id = Column(Integer, ForeignKey("tasks.id", ondelete="SET NULL"), nullable=True)

    # İlişkiler
    column = relationship("Column", back_populates="tasks")
    assigned_user = relationship("User", back_populates="tasks")  # Doğru ilişki, assigned_user_id ile eşleşiyor
    dependency = relationship("Task", remote_side=[id], backref="dependent_tasks")