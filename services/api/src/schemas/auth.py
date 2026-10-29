from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str | None
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
