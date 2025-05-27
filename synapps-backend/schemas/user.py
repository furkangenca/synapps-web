# schemas/user.py
from pydantic import BaseModel, EmailStr
from datetime import datetime

#kayıt için
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

#kullanıcı bilgisi gösterimi
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

#kullanıcı bilgisi güncelleme
class UserUpdate(BaseModel):
    name: str = None
    email: EmailStr = None
    password: str = None

# Giriş (login) için
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Token response modeli
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"