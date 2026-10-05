from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserUpdateRequest
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me")
def get_my_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email or "",
        "bio": current_user.bio or "",
        "avatarUrl": current_user.avatar_url,
        "registeredAt": current_user.registered_at.isoformat() if current_user.registered_at else None,
        "totalBuilds": current_user.total_builds or 0,
        "totalViews": current_user.total_views or 0,
        "role": current_user.role
    }


@router.put("/me")
def update_my_profile(
    body: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if body.email is not None:
        current_user.email = body.email
    if body.bio is not None:
        if len(body.bio) > 500:
            return JSONResponse(status_code=400, content={"error": "Bio is too long (max 500 characters)"})
        current_user.bio = body.bio
    if body.avatarUrl is not None:
        current_user.avatar_url = body.avatarUrl

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile updated successfully",
        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email or "",
            "bio": current_user.bio or "",
            "avatarUrl": current_user.avatar_url,
            "registeredAt": current_user.registered_at.isoformat() if current_user.registered_at else None,
            "totalBuilds": current_user.total_builds or 0,
            "totalViews": current_user.total_views or 0,
            "role": current_user.role
        }
    }


@router.get("/{username}")
def get_public_profile(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return JSONResponse(status_code=404, content={"error": "User not found"})

    return {
        "username": user.username,
        "bio": user.bio or "",
        "avatarUrl": user.avatar_url,
        "registeredAt": user.registered_at.isoformat() if user.registered_at else None,
        "totalBuilds": user.total_builds or 0,
        "totalViews": user.total_views or 0
    }
