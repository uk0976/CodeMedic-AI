from datetime import UTC, datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import (
    create_access_token,
    hash_password,
    hash_token,
    new_opaque_token,
    verify_password,
)
from app.models.session import RefreshSession
from app.models.user import User, UserRole
from app.repositories.auth import AuthRepository
from app.schemas.auth import AuthResponse, RegisterRequest


class AuthService:
    def __init__(self, session: Session) -> None:
        self.repository = AuthRepository(session)
        self.settings = get_settings()

    def register(self, payload: RegisterRequest) -> User:
        if self.repository.get_user_by_email(payload.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Email is already registered."
            )
        try:
            user = User(
                full_name=payload.full_name.strip(),
                email=payload.email,
                password_hash=hash_password(payload.password),
            )
            return self.repository.add_user(user)
        except IntegrityError as error:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Email is already registered."
            ) from error

    def authenticate(self, email: str, password: str) -> User:
        user = self.repository.get_user_by_email(email.strip().lower())
        if not user or not user.is_active or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password."
            )
        return user

    def create_auth_response(
        self, user: User, remember_me: bool = False
    ) -> tuple[AuthResponse, str, int]:
        refresh_token = new_opaque_token()
        refresh_days = 30 if remember_me else self.settings.jwt_refresh_token_expire_days
        self.repository.add_session(
            RefreshSession(
                user_id=user.id,
                token_hash=hash_token(refresh_token),
                expires_at=datetime.now(UTC) + timedelta(days=refresh_days),
            )
        )
        from app.schemas.auth import UserResponse

        return (
            AuthResponse(
                access_token=create_access_token(str(user.id)),
                user=UserResponse.model_validate(user),
            ),
            refresh_token,
            refresh_days * 86_400,
        )

    def refresh(self, refresh_token: str) -> tuple[AuthResponse, str, int]:
        now = datetime.now(UTC)
        refresh_session = self.repository.get_active_session(hash_token(refresh_token), now)
        if not refresh_session or not refresh_session.user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired. Please sign in again.",
            )
        self.repository.revoke_session(refresh_session, now)
        return self.create_auth_response(refresh_session.user)

    def revoke(self, refresh_token: str) -> None:
        refresh_session = self.repository.get_active_session(
            hash_token(refresh_token), datetime.now(UTC)
        )
        if refresh_session:
            self.repository.revoke_session(refresh_session, datetime.now(UTC))

    def ensure_demo_user(self) -> User:
        email = self.settings.demo_account_email.lower()
        user = self.repository.get_user_by_email(email)
        if user:
            return user
        return self.repository.add_user(
            User(
                full_name="Hackathon Evaluator",
                email=email,
                password_hash=hash_password(self.settings.demo_account_password.get_secret_value()),
                role=UserRole.EVALUATOR,
                is_verified=True,
            )
        )
