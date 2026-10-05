from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest
from app.services.auth_service import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    username = data.username.strip()
    if not username:
        return JSONResponse(status_code=400, content={"error": "Username is required"})
    if len(data.password) < 6:
        return JSONResponse(status_code=400, content={"error": "Password must be at least 6 characters"})

    existing_user = db.query(User).filter(User.username == username).first()
    if existing_user:
        return JSONResponse(status_code=400, content={"error": "Username already exists"})

    user = User(
        username=username,
        password_hash=hash_password(data.password),
        email=data.email.strip() if data.email else None,
        role="ROLE_USER",
        registered_at=datetime.utcnow(),
        total_builds=0,
        total_views=0
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "User registered successfully",
        "username": user.username
    }


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    username = data.username.strip()
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(data.password, user.password_hash):
        return JSONResponse(status_code=401, content={"error": "Invalid username or password"})

    token = create_access_token(user.username)
    return {
        "token": token,
        "username": user.username,
        "message": "Login successful"
    }


@router.get("/me")
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "username": current_user.username,
        "email": current_user.email or "",
        "role": current_user.role
    }
