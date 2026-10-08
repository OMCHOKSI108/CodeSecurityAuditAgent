"""RAG Server configuration module."""

from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = Field(default="development", alias="APP_ENV")
    app_version: str = Field(default="0.1.0", alias="APP_VERSION")
    git_sha: str = Field(default="local", alias="GIT_SHA")

    qdrant_url: str = Field(default="http://qdrant:6333", alias="QDRANT_URL")
    redis_url: str = Field(default="redis://redis:6379/0", alias="REDIS_URL")

    rag_service_token: str = Field(default="dev_rag_service_token_secret", alias="RAG_SERVICE_TOKEN")
    rag_embedding_model: str = Field(
        default="sentence-transformers/all-MiniLM-L6-v2",
        alias="RAG_EMBEDDING_MODEL",
    )
    rag_corpus_version: str = Field(default="v1", alias="RAG_CORPUS_VERSION")
    rag_collection_name: str = Field(default="secure_guidance_v1", alias="RAG_COLLECTION_NAME")
    log_redaction_enabled: bool = Field(default=True, alias="LOG_REDACTION_ENABLED")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
