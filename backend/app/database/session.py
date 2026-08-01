import sys
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings

settings = get_settings()

try:
    # Try connecting to the configured PostgreSQL instance
    engine = create_engine(
        settings.database_url,
        pool_pre_ping=True,
        connect_args={"connect_timeout": 3},
    )
    with engine.connect() as conn:
        pass
except (OperationalError, Exception) as e:
    print(f"[Warning] PostgreSQL connection failed: {e}", file=sys.stderr)
    print(
        "[Warning] Falling back to local SQLite database: sqlite:///./codemedic.db",
        file=sys.stderr,
    )
    engine = create_engine("sqlite:///./codemedic.db", connect_args={"check_same_thread": False})

# Ensure tables are auto-created on session initialization
from app.database.base import Base  # noqa: E402

Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db_session() -> Generator[Session, None, None]:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
