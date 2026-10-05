from typing import Optional
from decimal import Decimal
from pydantic import BaseModel, Field


class ComponentResponse(BaseModel):
    id: int
    category: Optional[str] = None
    brand: Optional[str] = None
    name: Optional[str] = None
    chipset: Optional[str] = None
    specs: Optional[str] = None
    price: Optional[Decimal] = None
    imageUrl: Optional[str] = Field(None, validation_alias="image_url")

    class Config:
        from_attributes = True
        populate_by_name = True


class ComponentCreateRequest(BaseModel):
    category: Optional[str] = None
    brand: Optional[str] = None
    name: str
    chipset: Optional[str] = None
    specs: Optional[str] = None
    price: Optional[Decimal] = None
    imageUrl: Optional[str] = None
