"""RAG Server application entrypoint."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.config import get_settings
from app.core.logging import setup_logger
from app.embeddings.model import get_embedding_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    setup_logger(settings.redis_url)
    import threading

    mgr = get_embedding_manager(settings.rag_embedding_model)
    threading.Thread(target=mgr.load_model, daemon=True).start()
    yield


settings = get_settings()

app = FastAPI(
    title="CodeSecAudit RAG Server",
    version=settings.app_version,
    description="Internal private OWASP RAG retrieval and embedding microservice",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(router)
