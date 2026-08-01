from functools import lru_cache
from typing import Annotated, Literal

from pydantic import AnyHttpUrl, Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "CodeMedic AI"
    environment: Literal["development", "staging", "production"] = "development"
    log_level: str = "INFO"
    api_v1_prefix: str = "/api/v1"
    database_url: str = "postgresql+psycopg://codemedic:codemedic@localhost:5432/codemedic"
    backend_cors_origins: Annotated[list[AnyHttpUrl], NoDecode] = Field(default_factory=list)
    jwt_secret_key: SecretStr = SecretStr("ci-fallback-secret-key-for-testing-123456789")
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30
    jwt_refresh_token_expire_days: int = 14
    auth_cookie_name: str = "codemedic_refresh_token"
    auth_cookie_secure: bool = False
    auth_cookie_samesite: Literal["lax", "strict", "none"] = "lax"
    demo_account_email: str = "evaluator@codemedic.ai"
    demo_account_password: SecretStr = SecretStr("change-this-demo-password-in-production")
    openai_api_key: SecretStr | None = None
    groq_api_key: SecretStr | None = None

    @field_validator("backend_cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]
