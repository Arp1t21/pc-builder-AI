import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

engine = create_engine(
    settings.db_url,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initializes tables and seeds initial data if components table is empty"""
    import app.models  # noqa: F401 - ensure models are imported
    Base.metadata.create_all(bind=engine)

    # Check if components table has data
    with SessionLocal() as db:
        try:
            result = db.execute(text("SELECT count(*) FROM components")).scalar()
            if result == 0:
                sql_path = os.path.join(os.path.dirname(__file__), "..", "data", "data.sql")
                if os.path.exists(sql_path):
                    with open(sql_path, "r", encoding="utf-8") as f:
                        sql_content = f.read()
                    # Execute data.sql statements
                    db.execute(text(sql_content))
                    db.commit()
                    print("Initial components seeded from data.sql")
        except Exception as e:
            print(f"Database initialization notice: {e}")
            db.rollback()
