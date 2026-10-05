import json
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.build import PcBuild
from app.models.reaction import BuildReaction
from app.models.user import User
from app.schemas.build import (
    BuildCreateRequest,
    BuildUpdateRequest,
    BuildResponse,
    ReactionResponse
)
from app.dependencies import get_current_user, get_optional_user

router = APIRouter(prefix="/api/builds", tags=["builds"])


def serialize_build(build: PcBuild) -> dict:
    return {
        "id": build.id,
        "name": build.name,
        "description": build.description,
        "componentsJson": build.components_json,
        "totalPrice": build.total_price or 0.0,
        "createdAt": build.created_at.isoformat() if build.created_at else None,
        "published": bool(build.published),
        "likesCount": build.likes_count or 0,
        "dislikesCount": build.dislikes_count or 0,
        "aiAnalysis": build.ai_analysis,
        "owner": {
            "id": build.owner.id,
            "username": build.owner.username,
            "avatarUrl": build.owner.avatar_url
        } if build.owner else None
    }


@router.post("")
def create_build(
    body: BuildCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check max 10 builds
    user_builds_count = db.query(PcBuild).filter(PcBuild.owner_id == current_user.id).count()
    if user_builds_count >= 10:
        return JSONResponse(status_code=400, content={"error": "Maximum 10 builds allowed"})

    # Prepare components JSON string
    components_val = body.componentsJson
    if isinstance(components_val, (dict, list)):
        components_json_str = json.dumps(components_val, ensure_ascii=False)
    elif isinstance(components_val, str):
        components_json_str = components_val
    else:
        components_json_str = "{}"

    build_name = body.name or f"Моя сборка {user_builds_count + 1}"

    build = PcBuild(
        name=build_name,
        description=body.description or "",
        components_json=components_json_str,
        total_price=float(body.totalPrice) if body.totalPrice is not None else 0.0,
        created_at=datetime.utcnow(),
        owner_id=current_user.id,
        published=bool(body.published),
        likes_count=0,
        dislikes_count=0
    )
    db.add(build)
    
    # Increment total_builds on user
    current_user.total_builds = (current_user.total_builds or 0) + 1
    
    db.commit()
    db.refresh(build)

    return {
        "message": "Build saved successfully",
        "build": serialize_build(build)
    }


@router.get("/my")
def get_my_builds(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    builds = (
        db.query(PcBuild)
        .options(joinedload(PcBuild.owner))
        .filter(PcBuild.owner_id == current_user.id)
        .order_by(PcBuild.created_at.desc())
        .all()
    )
    return [serialize_build(b) for b in builds]


@router.get("/public")
def get_public_builds(db: Session = Depends(get_db)):
    builds = (
        db.query(PcBuild)
        .options(joinedload(PcBuild.owner))
        .filter(PcBuild.published == True)
        .order_by(PcBuild.created_at.desc())
        .all()
    )
    return [serialize_build(b) for b in builds]


@router.get("/{id}")
def get_build(id: int, db: Session = Depends(get_db)):
    build = (
        db.query(PcBuild)
        .options(joinedload(PcBuild.owner))
        .filter(PcBuild.id == id)
        .first()
    )
    if not build:
        return JSONResponse(status_code=404, content={"error": "Build not found"})
    return serialize_build(build)


@router.put("/{id}")
def update_build(
    id: int,
    body: BuildUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    build = (
        db.query(PcBuild)
        .options(joinedload(PcBuild.owner))
        .filter(PcBuild.id == id)
        .first()
    )
    if not build:
        return JSONResponse(status_code=404, content={"error": "Build not found"})

    if build.owner_id != current_user.id:
        return JSONResponse(status_code=403, content={"error": "Access denied"})

    if body.name is not None:
        build.name = body.name
    if body.description is not None:
        build.description = body.description
    if body.componentsJson is not None:
        if isinstance(body.componentsJson, (dict, list)):
            build.components_json = json.dumps(body.componentsJson, ensure_ascii=False)
        else:
            build.components_json = str(body.componentsJson)
    if body.published is not None:
        build.published = bool(body.published)
    if body.totalPrice is not None:
        build.total_price = float(body.totalPrice)

    db.commit()
    db.refresh(build)

    return {
        "message": "Build updated successfully",
        "build": serialize_build(build)
    }


@router.delete("/{id}")
def delete_build(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    build = db.query(PcBuild).filter(PcBuild.id == id).first()
    if not build:
        return JSONResponse(status_code=404, content={"error": "Build not found"})

    if build.owner_id != current_user.id:
        return JSONResponse(status_code=403, content={"error": "Access denied"})

    db.delete(build)
    if current_user.total_builds and current_user.total_builds > 0:
        current_user.total_builds -= 1
    db.commit()

    return {"deleted": True, "message": "Build deleted successfully"}


# Reaction endpoints
@router.get("/{id}/reaction")
def get_build_reaction(
    id: int,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    build = db.query(PcBuild).filter(PcBuild.id == id).first()
    if not build:
        return JSONResponse(status_code=404, content={"error": "Build not found"})

    user_reaction = None
    if current_user:
        reaction_obj = (
            db.query(BuildReaction)
            .filter(BuildReaction.build_id == id, BuildReaction.user_id == current_user.id)
            .first()
        )
        if reaction_obj:
            user_reaction = reaction_obj.reaction

    return {
        "likesCount": build.likes_count or 0,
        "dislikesCount": build.dislikes_count or 0,
        "userReaction": user_reaction
    }


@router.post("/{id}/like")
def like_build(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    build = db.query(PcBuild).filter(PcBuild.id == id).first()
    if not build:
        return JSONResponse(status_code=404, content={"error": "Build not found"})

    existing = (
        db.query(BuildReaction)
        .filter(BuildReaction.build_id == id, BuildReaction.user_id == current_user.id)
        .first()
    )

    if existing:
        if existing.reaction == "LIKE":
            # Remove like
            db.delete(existing)
            build.likes_count = max(0, (build.likes_count or 0) - 1)
            user_reaction = None
        else:
            # Change dislike to like
            existing.reaction = "LIKE"
            build.dislikes_count = max(0, (build.dislikes_count or 0) - 1)
            build.likes_count = (build.likes_count or 0) + 1
            user_reaction = "LIKE"
    else:
        # Add like
        new_reaction = BuildReaction(build_id=id, user_id=current_user.id, reaction="LIKE")
        db.add(new_reaction)
        build.likes_count = (build.likes_count or 0) + 1
        user_reaction = "LIKE"

    db.commit()
    db.refresh(build)

    return {
        "likesCount": build.likes_count or 0,
        "dislikesCount": build.dislikes_count or 0,
        "userReaction": user_reaction
    }


@router.post("/{id}/dislike")
def dislike_build(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    build = db.query(PcBuild).filter(PcBuild.id == id).first()
    if not build:
        return JSONResponse(status_code=404, content={"error": "Build not found"})

    existing = (
        db.query(BuildReaction)
        .filter(BuildReaction.build_id == id, BuildReaction.user_id == current_user.id)
        .first()
    )

    if existing:
        if existing.reaction == "DISLIKE":
            # Remove dislike
            db.delete(existing)
            build.dislikes_count = max(0, (build.dislikes_count or 0) - 1)
            user_reaction = None
        else:
            # Change like to dislike
            existing.reaction = "DISLIKE"
            build.likes_count = max(0, (build.likes_count or 0) - 1)
            build.dislikes_count = (build.dislikes_count or 0) + 1
            user_reaction = "DISLIKE"
    else:
        # Add dislike
        new_reaction = BuildReaction(build_id=id, user_id=current_user.id, reaction="DISLIKE")
        db.add(new_reaction)
        build.dislikes_count = (build.dislikes_count or 0) + 1
        user_reaction = "DISLIKE"

    db.commit()
    db.refresh(build)

    return {
        "likesCount": build.likes_count or 0,
        "dislikesCount": build.dislikes_count or 0,
        "userReaction": user_reaction
    }
