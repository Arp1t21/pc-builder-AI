from datetime import datetime
from sqlalchemy import Column, BigInteger, String, Text, Integer, DateTime
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, autoincrement=True, index=True)
    username = Column(String(255), unique=True, nullable=False, index=True)
    email = Column(String(255), nullable=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False, default="ROLE_USER")
    bio = Column(String(500), nullable=True)
    avatar_url = Column(Text, nullable=True)
    registered_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    total_builds = Column(Integer, default=0)
    total_views = Column(Integer, default=0)

    # Relationships
    builds = relationship("PcBuild", back_populates="owner", cascade="all, delete-orphan")
    reactions = relationship("BuildReaction", back_populates="user", cascade="all, delete-orphan")
