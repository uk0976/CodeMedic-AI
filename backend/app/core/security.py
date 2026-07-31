from datetime import UTC, datetime, timedelta
from hashlib import sha256
from secrets import token_urlsafe
from typing import Any

import jwt
from pwdlib import PasswordHash

from app.core.config import get_settings


def create_access_token(subject: str, expires_delta: timedelta | None = None) -> str:
    settings = get_settings()
    expires_at = datetime.now(UTC) + (
        expires_delta or timedelta(minutes=settings.jwt_access_token_expire_minutes)
    )
    payload: dict[str, Any] = {"sub": subject, "exp": expires_at}
    token = jwt.encode(payload, settings.jwt_secret_key.get_secret_value(), settings.jwt_algorithm)
    return token.decode() if isinstance(token, bytes) else token


password_hasher = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return password_hasher.verify(password, password_hash)


def new_opaque_token() -> str:
    return token_urlsafe(48)


def hash_token(token: str) -> str:
    return sha256(token.encode("utf-8")).hexdigest()
