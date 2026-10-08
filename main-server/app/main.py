"""Main Server application entrypoint."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router
from app.api.health import router as health_router
from app.api.logs import router as logs_router
from app.api.reviews import router as reviews_router
from app.api.webhooks import router as webhooks_router
from app.core.config import get_settings
from app.core.logging import setup_logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    setup_logger(settings.redis_url)
    yield


settings = get_settings()

app = FastAPI(
    title="CodeSecAudit Main Server",
    version=settings.app_version,
    description="Core security, auth, GitHub integration, and review orchestration service",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.next_public_app_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(webhooks_router)
app.include_router(reviews_router)
app.include_router(logs_router)
