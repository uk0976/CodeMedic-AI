from datetime import datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.session import RefreshSession
from app.models.user import User


class AuthRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get_user_by_email(self, email: str) -> User | None:
        return self.session.scalar(select(User).where(User.email == email.lower()))

    def get_user_by_id(self, user_id: UUID) -> User | None:
        return self.session.get(User, user_id)

    def add_user(self, user: User) -> User:
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

    def add_session(self, refresh_session: RefreshSession) -> RefreshSession:
        self.session.add(refresh_session)
        self.session.commit()
        self.session.refresh(refresh_session)
        return refresh_session

    def get_active_session(self, token_hash: str, now: datetime) -> RefreshSession | None:
        return self.session.scalar(
            select(RefreshSession).where(
                RefreshSession.token_hash == token_hash,
                RefreshSession.revoked_at.is_(None),
                RefreshSession.expires_at > now,
            )
        )

    def revoke_session(self, refresh_session: RefreshSession, now: datetime) -> None:
        refresh_session.revoked_at = now
        self.session.commit()
