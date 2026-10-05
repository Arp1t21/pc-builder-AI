from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.component import Component
from app.schemas.component import ComponentResponse, ComponentCreateRequest

router = APIRouter(prefix="/api/components", tags=["components"])


@router.get("", response_model=List[ComponentResponse])
def get_all_components(db: Session = Depends(get_db)):
    components = db.query(Component).order_by(Component.id).all()
    return components


@router.get("/category/{cat}", response_model=List[ComponentResponse])
def get_components_by_category(cat: str, db: Session = Depends(get_db)):
    components = (
        db.query(Component)
        .filter(func.lower(Component.category) == cat.strip().lower())
        .order_by(Component.id)
        .all()
    )
    return components


@router.post("", response_model=ComponentResponse)
def create_component(data: ComponentCreateRequest, db: Session = Depends(get_db)):
    comp = Component(
        category=data.category,
        brand=data.brand,
        name=data.name,
        chipset=data.chipset,
        specs=data.specs,
        price=data.price,
        image_url=data.imageUrl
    )
    db.add(comp)
    db.commit()
    db.refresh(comp)
    return comp
