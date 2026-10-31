import os
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./avian_vet.db")
kwargs = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {"pool_pre_ping": True}
engine = create_engine(DATABASE_URL, connect_args=kwargs)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
