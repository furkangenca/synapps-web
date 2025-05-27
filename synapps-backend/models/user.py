from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from models.base import Base 

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    #şifre auth içerisinde hashleyerek saklanacak
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now())

    project_boards = relationship("ProjectBoard", back_populates="user")
    tasks = relationship("Task", back_populates="assigned_user")
    sessions = relationship("Session", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    board_members = relationship("BoardMember", back_populates="user")