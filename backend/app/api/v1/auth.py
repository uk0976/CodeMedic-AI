from typing import Annotated
from uuid import UUID

import jwt
from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import InvalidTokenError
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.database.session import get_db_session
from app.repositories.auth import AuthRepository
from app.schemas.auth import (
    AuthResponse,
    LoginRequest,
    MessageResponse,
    PasswordResetRequest,
    RegisterRequest,
    ResetPasswordRequest,
    UserResponse,
    VerifyEmailRequest,
)
from app.services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["authentication"])
bearer_scheme = HTTPBearer(auto_error=False)
settings = get_settings()


def set_refresh_cookie(response: Response, token: str, max_age: int) -> None:
    response.set_cookie(
        key=settings.auth_cookie_name,
        value=token,
        max_age=max_age,
        httponly=True,
        secure=settings.auth_cookie_secure,
        samesite=settings.auth_cookie_samesite,
        path="/",
    )


def clear_refresh_cookie(response: Response) -> None:
    response.delete_cookie(key=settings.auth_cookie_name, path="/")


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, response: Response, db: Annotated[Session, Depends(get_db_session)]) -> AuthResponse:
    service = AuthService(db)
    user = service.register(payload)
    auth_response, refresh_token, max_age = service.create_auth_response(user)
    set_refresh_cookie(response, refresh_token, max_age)
    return auth_response


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, response: Response, db: Annotated[Session, Depends(get_db_session)]) -> AuthResponse:
    service = AuthService(db)
    user = service.authenticate(payload.email, payload.password)
    auth_response, refresh_token, max_age = service.create_auth_response(user, payload.remember_me)
    set_refresh_cookie(response, refresh_token, max_age)
    return auth_response


@router.post("/demo-login", response_model=AuthResponse)
def demo_login(response: Response, db: Annotated[Session, Depends(get_db_session)]) -> AuthResponse:
    service = AuthService(db)
    user = service.ensure_demo_user()
    auth_response, refresh_token, max_age = service.create_auth_response(user)
    set_refresh_cookie(response, refresh_token, max_age)
    return auth_response


@router.post("/refresh", response_model=AuthResponse)
def refresh(
    response: Response,
    db: Annotated[Session, Depends(get_db_session)],
    refresh_token: Annotated[str | None, Cookie(alias=settings.auth_cookie_name)] = None,
) -> AuthResponse:
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired. Please sign in again.")
    auth_response, replacement_token, max_age = AuthService(db).refresh(refresh_token)
    set_refresh_cookie(response, replacement_token, max_age)
    return auth_response


@router.post("/logout", response_model=MessageResponse)
def logout(
    response: Response,
    db: Annotated[Session, Depends(get_db_session)],
    refresh_token: Annotated[str | None, Cookie(alias=settings.auth_cookie_name)] = None,
) -> MessageResponse:
    if refresh_token:
        AuthService(db).revoke(refresh_token)
    clear_refresh_cookie(response)
    return MessageResponse(message="Signed out successfully.")


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    db: Annotated[Session, Depends(get_db_session)],
) -> UserResponse:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required.")
    try:
        payload = jwt.decode(credentials.credentials, settings.jwt_secret_key.get_secret_value(), algorithms=[settings.jwt_algorithm])
        subject = payload.get("sub")
        user = AuthRepository(db).get_user_by_id(UUID(str(subject))) if subject else None
    except (InvalidTokenError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired session.") from None
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired session.")
    return UserResponse.model_validate(user)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: Annotated[UserResponse, Depends(get_current_user)]) -> UserResponse:
    return current_user


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(_: PasswordResetRequest) -> MessageResponse:
    return MessageResponse(message="If that account exists, a password-reset link has been sent.")


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(_: ResetPasswordRequest) -> MessageResponse:
    return MessageResponse(message="Password reset flow is ready for verified email delivery integration.")


@router.post("/verify-email", response_model=MessageResponse)
def verify_email(_: VerifyEmailRequest) -> MessageResponse:
    return MessageResponse(message="Email verification flow is ready for verified email delivery integration.")
