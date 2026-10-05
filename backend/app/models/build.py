from datetime import datetime
from sqlalchemy import Column, BigInteger, String, Text, Float, Boolean, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class PcBuild(Base):
    __tablename__ = "pc_builds"

    id = Column(BigInteger, primary_key=True, autoincrement=True, index=True)
    name = Column(String(255), nullable=True)
    description = Column(String(255), nullable=True)
    components_json = Column(Text, nullable=False, default="{}")
    total_price = Column(Float, nullable=True, default=0.0)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    owner_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    published = Column(Boolean, default=False, nullable=True)
    likes_count = Column(Integer, default=0, nullable=False)
    dislikes_count = Column(Integer, default=0, nullable=False)
    ai_analysis = Column(Text, nullable=True)

    # Relationships
    owner = relationship("User", back_populates="builds")
    reactions = relationship("BuildReaction", back_populates="build", cascade="all, delete-orphan")
