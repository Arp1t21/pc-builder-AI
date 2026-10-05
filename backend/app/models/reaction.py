from datetime import datetime
from sqlalchemy import Column, BigInteger, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base


class BuildReaction(Base):
    __tablename__ = "build_reactions"
    __table_args__ = (
        UniqueConstraint("build_id", "user_id", name="build_reactions_build_id_user_id_key"),
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True, index=True)
    build_id = Column(BigInteger, ForeignKey("pc_builds.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    reaction = Column(String(10), nullable=False)  # 'LIKE' or 'DISLIKE'
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    # Relationships
    build = relationship("PcBuild", back_populates="reactions")
    user = relationship("User", back_populates="reactions")
