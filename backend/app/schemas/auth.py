from typing import Optional
from pydantic import BaseModel, Field


class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=6)
    email: Optional[str] = None


class RegisterResponse(BaseModel):
    message: str
    username: str


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    token: str
    username: str
    message: str


class CurrentUserResponse(BaseModel):
    username: str
    email: str = ""
    role: str
