"""API Request and Response Pydantic schemas."""

from typing import Any, Optional
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str
    postgres: str
    redis: str
    rag_service: str


class VersionResponse(BaseModel):
    service: str = "main-server"
    version: str
    git_sha: str


class UserMeResponse(BaseModel):
    id: str
    github_id: str
    username: str
    email: Optional[str]
    avatar_url: Optional[str]
    is_admin: bool
    active_organization_id: str
    organization_name: str
    organization_role: str


class FindingItem(BaseModel):
    id: str
    cwe_id: str
    severity: str
    title: str
    file_path: str
    line_number: Optional[int]
    code_snippet: Optional[str]
    suggested_fix: Optional[str]


class ReviewDetailResponse(BaseModel):
    id: str
    repository_id: str
    pr_number: int
    commit_sha: str
    risk_score: int
    verdict: str
    summary: str
    guidance_available: bool
    created_at: str
    findings: list[FindingItem] = Field(default_factory=list)


class ManualReviewRequest(BaseModel):
    repository_id: str
    code_content: str = Field(min_length=1)
    file_path: str = "manual_scan.py"


class LogEntry(BaseModel):
    id: str
    timestamp: str
    level: str
    message: str
    service: str
