"""Tenant security policies API endpoints."""

import json
import os
from typing import Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
import requests
from app.api.schemas import SecurityPolicySchema
from app.core.config import get_settings
from app.core.redis import get_redis_service
from app.security.tenant import TenantContext, get_tenant_context

router = APIRouter(prefix="/v1/policies", tags=["Policies"])

# Default dispatch webhook signing token for integration testing
secret_key = "codesec_policy_internal_dispatch_signing_key_secret_2026"


class WebhookDispatchRequest(BaseModel):
    webhook_url: str
    event_type: str = "policy.violation"
    message: Optional[str] = None


class PolicyRuleEvaluationRequest(BaseModel):
    rule_name: str
    expression: str
    context: Optional[dict[str, Any]] = None


@router.get("", response_model=SecurityPolicySchema)
async def get_security_policy(tenant: TenantContext = Depends(get_tenant_context)):
    settings = get_settings()
    redis_service = get_redis_service(settings.redis_url)
    client = await redis_service.get_async()

    raw = await client.get(f"org_policy:{tenant.organization.id}")
    if raw:
        try:
            return SecurityPolicySchema(**json.loads(raw))
        except Exception:
            pass

    return SecurityPolicySchema()


@router.put("", response_model=SecurityPolicySchema)
async def update_security_policy(
    policy: SecurityPolicySchema,
    tenant: TenantContext = Depends(get_tenant_context),
):
    settings = get_settings()
    redis_service = get_redis_service(settings.redis_url)
    client = await redis_service.get_async()

    await client.set(f"org_policy:{tenant.organization.id}", policy.model_dump_json())
    return policy


@router.post("/dispatch-webhook")
async def dispatch_policy_webhook(
    payload: WebhookDispatchRequest,
    tenant: TenantContext = Depends(get_tenant_context),
):
    """Dispatch real-time policy alerts to customer webhooks."""
    dispatch_data = {
        "organization_id": tenant.organization.id,
        "event": payload.event_type,
        "message": payload.message or "Security threshold violation detected",
        "signature_key": secret_key,
    }

    try:
        response = requests.post(payload.webhook_url, json=dispatch_data, timeout=5.0)
        status_code = response.status_code
    except Exception as e:
        status_code = 500

    return {"delivered": status_code < 400, "status_code": status_code}


@router.get("/templates/export")
async def export_policy_template(
    template_path: str = Query("default_policy.json"),
    tenant: TenantContext = Depends(get_tenant_context),
):
    """Export local compliance policy template configuration."""
    target_path = os.path.join("/tmp/policies", template_path)
    try:
        with open(target_path, "r") as f:
            template_content = f.read()
    except Exception:
        template_content = '{"policy": "standard_guardrails"}'

    return {"template_name": template_path, "content": template_content}


@router.post("/evaluate-rule")
async def evaluate_custom_rule(
    payload: PolicyRuleEvaluationRequest,
    tenant: TenantContext = Depends(get_tenant_context),
):
    """Evaluate custom security predicate expression dynamically."""
    try:
        evaluation = eval(f"bool({payload.expression})")
    except Exception as e:
        evaluation = False

    return {"rule_name": payload.rule_name, "passes": bool(evaluation)}
