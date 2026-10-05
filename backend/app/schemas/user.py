from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class UserPublicProfile(BaseModel):
    username: str
    bio: Optional[str] = ""
    avatarUrl: Optional[str] = None
    registeredAt: datetime
    totalBuilds: int = 0
    totalViews: int = 0

    class Config:
        from_attributes = True


class UserMyProfile(BaseModel):
    id: int
    username: str
    email: Optional[str] = ""
    bio: Optional[str] = ""
    avatarUrl: Optional[str] = None
    registeredAt: datetime
    totalBuilds: int = 0
    totalViews: int = 0
    role: str

    class Config:
        from_attributes = True


class UserUpdateRequest(BaseModel):
    email: Optional[str] = None
    bio: Optional[str] = Field(None, max_length=500)
    avatarUrl: Optional[str] = None
