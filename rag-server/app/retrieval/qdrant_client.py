"""Qdrant client and vector operations manager."""

import logging
from typing import Any, Optional

logger = logging.getLogger("rag_server")


class QdrantStore:
    def __init__(self, qdrant_url: str, collection_name: str = "secure_guidance_v1"):
        self.qdrant_url = qdrant_url
        self.collection_name = collection_name
        self._client: Optional[Any] = None

    def get_client(self) -> Optional[Any]:
        if self._client is None:
            try:
                from qdrant_client import QdrantClient
                self._client = QdrantClient(url=self.qdrant_url, timeout=10.0)
            except Exception as e:
                logger.warning(f"Could not connect to Qdrant: {e}")
                return None
        return self._client

    def is_healthy(self) -> bool:
        client = self.get_client()
        if client is None:
            return False
        try:
            client.get_collections()
            return True
        except Exception:
            return False

    def ensure_collection(self, vector_dim: int = 384) -> None:
        client = self.get_client()
        if not client:
            return
        from qdrant_client.http import models
        collections = [c.name for c in client.get_collections().collections]
        if self.collection_name not in collections:
            logger.info(f"Creating Qdrant collection {self.collection_name} (dim={vector_dim})")
            client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(
                    size=vector_dim,
                    distance=models.Distance.COSINE,
                ),
            )

    def search(
        self,
        query_vector: list[float],
        top_k: int = 3,
        cwe_filter: Optional[str] = None,
    ) -> list[dict[str, Any]]:
        client = self.get_client()
        if not client:
            return []
        from qdrant_client.http import models

        query_filter = None
        if cwe_filter:
            query_filter = models.Filter(
                must=[
                    models.FieldCondition(
                        key="cwe_ids",
                        match=models.MatchValue(value=cwe_filter),
                    )
                ]
            )

        results = client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            query_filter=query_filter,
            limit=top_k,
        )

        formatted = []
        for r in results:
            payload = r.payload or {}
            formatted.append({
                "score": float(r.score),
                "document_id": str(r.id),
                "guidance_text": payload.get("content", ""),
                "source_url": payload.get("source_url", ""),
                "section_title": payload.get("section", ""),
                "cwe_ids": payload.get("cwe_ids", []),
                "corpus_version": payload.get("corpus_version", "v1"),
            })
        return formatted

    def count(self) -> int:
        client = self.get_client()
        if not client:
            return 0
        try:
            info = client.get_collection(self.collection_name)
            return info.points_count or 0
        except Exception:
            return 0
