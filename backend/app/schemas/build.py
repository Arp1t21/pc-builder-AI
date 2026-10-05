from typing import Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field


class BuildOwnerResponse(BaseModel):
    id: int
    username: str
    avatarUrl: Optional[str] = Field(None, validation_alias="avatar_url")

    class Config:
        from_attributes = True
        populate_by_name = True


class BuildCreateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    componentsJson: Optional[Any] = None
    totalPrice: Optional[float] = 0.0
    published: Optional[bool] = False


class BuildUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    componentsJson: Optional[Any] = None
    totalPrice: Optional[float] = None
    published: Optional[bool] = None


class BuildResponse(BaseModel):
    id: int
    name: Optional[str] = None
    description: Optional[str] = None
    componentsJson: str = Field(..., validation_alias="components_json")
    totalPrice: Optional[float] = Field(0.0, validation_alias="total_price")
    createdAt: datetime = Field(..., validation_alias="created_at")
    published: bool = False
    likesCount: int = Field(0, validation_alias="likes_count")
    dislikesCount: int = Field(0, validation_alias="dislikes_count")
    aiAnalysis: Optional[str] = Field(None, validation_alias="ai_analysis")
    owner: Optional[BuildOwnerResponse] = None

    class Config:
        from_attributes = True
        populate_by_name = True


class ReactionResponse(BaseModel):
    likesCount: int
    dislikesCount: int
    userReaction: Optional[str] = None
