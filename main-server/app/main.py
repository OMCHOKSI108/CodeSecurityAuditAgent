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

@app.get("/", tags=["Root"])
def root_index():
    return {
        "service": "codesec-main-server",
        "description": "CodeSecAudit Core Security & Review Orchestrator",
        "version": settings.app_version,
        "docs_url": "/docs",
        "redoc_url": "/redoc",
        "endpoints": {
            "health_and_system": [
                {"method": "GET", "path": "/health/live", "description": "Liveness probe"},
                {"method": "GET", "path": "/health/ready", "description": "Readiness probe (Postgres, Redis, RAG)"},
                {"method": "GET", "path": "/version", "description": "Service version and git SHA"}
            ],
            "authentication": [
                {"method": "GET", "path": "/v1/auth/github/start", "description": "Initiate GitHub OAuth with PKCE"},
                {"method": "GET", "path": "/v1/auth/github/callback", "description": "GitHub OAuth callback & session creation"},
                {"method": "POST", "path": "/v1/auth/logout", "description": "Terminate active session"},
                {"method": "GET", "path": "/v1/me", "description": "Get current authenticated user & org"}
            ],
            "webhooks": [
                {"method": "POST", "path": "/v1/webhooks/github", "description": "Intake signed GitHub pull request events"}
            ],
            "reviews": [
                {"method": "POST", "path": "/v1/reviews", "description": "Enqueue a manual review job"},
                {"method": "GET", "path": "/v1/reviews", "description": "List reviews (tenant-scoped)"},
                {"method": "GET", "path": "/v1/reviews/{id}", "description": "Get review detail & findings"}
            ],
            "admin_logs": [
                {"method": "GET", "path": "/main-server-logs", "description": "Tail sanitized main-server logs (Admin only)"},
                {"method": "GET", "path": "/client-server-logs", "description": "Tail sanitized client logs (Admin only)"},
                {"method": "GET", "path": "/rag-server-logs", "description": "Tail sanitized RAG logs (Admin only)"}
            ]
        }
    }

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(webhooks_router)
app.include_router(reviews_router)
app.include_router(logs_router)
