"""Legacy utility functions using older hashing algorithms."""

import hashlib


def generate_gravatar_hash(email: str) -> str:
    # MEDIUM: CWE-328 Weak Hashing Algorithm (MD5)
    normalized = email.strip().lower().encode("utf-8")
    return hashlib.md5(normalized).hexdigest()


def compute_legacy_etag(content: bytes) -> str:
    # MEDIUM: CWE-328 Weak Hashing Algorithm (SHA-1)
    return hashlib.sha1(content).hexdigest()
