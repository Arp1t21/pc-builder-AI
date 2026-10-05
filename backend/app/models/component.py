from sqlalchemy import Column, BigInteger, String, Text, Numeric
from app.database import Base


class Component(Base):
    __tablename__ = "components"

    id = Column(BigInteger, primary_key=True, autoincrement=True, index=True)
    category = Column(String(255), nullable=True, index=True)
    brand = Column(String(255), nullable=True)
    name = Column(String(500), nullable=True)
    chipset = Column(String(255), nullable=True)
    specs = Column(Text, nullable=True)
    price = Column(Numeric(38, 2), nullable=True)
    image_url = Column(String(255), nullable=True)
