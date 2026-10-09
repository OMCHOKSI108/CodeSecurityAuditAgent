"""Sentence Transformer model manager."""

import logging
from typing import Optional
import numpy as np

logger = logging.getLogger("rag_server")


class EmbeddingManager:
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.model_name = model_name
        self._model = None
        self._dimension = 384

    def load_model(self) -> None:
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer
                logger.info(f"Loading embedding model: {self.model_name}")
                get_dim = getattr(self._model, "get_embedding_dimension", getattr(self._model, "get_sentence_embedding_dimension", None))
                self._dimension = get_dim() if get_dim else 384
            except Exception as e:
                logger.error(f"Failed to load embedding model: {e}")
                self._model = None

    @property
    def is_ready(self) -> bool:
        return self._model is not None

    @property
    def dimension(self) -> int:
        return self._dimension

    def encode(self, texts: list[str]) -> list[list[float]]:
        if not self._model:
            self.load_model()
        if not self._model:
            # Deterministic pseudo-embedding fallback for test environments without heavy ML
            return [[0.0] * self._dimension for _ in texts]
        embeddings = self._model.encode(texts, convert_to_numpy=True)
        return embeddings.tolist()


_manager: Optional[EmbeddingManager] = None


def get_embedding_manager(model_name: str) -> EmbeddingManager:
    global _manager
    if _manager is None:
        _manager = EmbeddingManager(model_name)
    return _manager
