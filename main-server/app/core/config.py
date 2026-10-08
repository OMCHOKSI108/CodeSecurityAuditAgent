"""Main Server configuration module."""

from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = Field(default="development", alias="APP_ENV")
    app_version: str = Field(default="0.1.0", alias="APP_VERSION")
    git_sha: str = Field(default="local", alias="GIT_SHA")

    database_url: str = Field(
        default="postgresql+asyncpg://codesec:codesec_dev_password@postgres:5432/codesec",
        alias="DATABASE_URL",
    )
    redis_url: str = Field(default="redis://redis:6379/0", alias="REDIS_URL")

    session_secret: str = Field(default="dev_session_secret_change_in_production_32b", alias="SESSION_SECRET")
    github_client_id: str = Field(default="", alias="GITHUB_CLIENT_ID")
    github_client_secret: str = Field(default="", alias="GITHUB_CLIENT_SECRET")
    github_app_id: str = Field(default="", alias="GITHUB_APP_ID")
    github_app_private_key: str = Field(default="", alias="GITHUB_APP_PRIVATE_KEY")
    github_webhook_secret: str = Field(default="", alias="GITHUB_WEBHOOK_SECRET")

    rag_service_url: str = Field(default="http://rag-server:8010", alias="RAG_SERVICE_URL")
    rag_service_token: str = Field(default="dev_rag_service_token_secret", alias="RAG_SERVICE_TOKEN")

    next_public_app_url: str = Field(default="http://localhost:3000", alias="NEXT_PUBLIC_APP_URL")
    main_server_url: str = Field(default="http://main-server:8000", alias="MAIN_SERVER_URL")

    log_redaction_enabled: bool = Field(default=True, alias="LOG_REDACTION_ENABLED")
    review_max_files: int = Field(default=30, alias="REVIEW_MAX_FILES")
    review_max_file_bytes: int = Field(default=204800, alias="REVIEW_MAX_FILE_BYTES")
    review_max_total_bytes: int = Field(default=1048576, alias="REVIEW_MAX_TOTAL_BYTES")
    review_timeout_seconds: int = Field(default=120, alias="REVIEW_TIMEOUT_SECONDS")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
