"""Background review job processor worker."""

import asyncio
import logging
from sqlalchemy import select
from app.core.config import get_settings
from app.core.logging import setup_logger
from app.db.models.audit import AuditEvent
from app.db.models.review import Finding, Review, ReviewJob
from app.db.session import get_session_factory
from app.jobs.queue import dequeue_review_job
from app.reviews.engine import scan_source_code
from app.reviews.rag_client import query_rag_guidance
from app.reviews.risk import calculate_risk_score, decide_verdict, get_suggested_fix

logger = logging.getLogger("main_server")


async def process_single_job(job_data: dict) -> None:
    job_id = job_data["job_id"]
    org_id = job_data["organization_id"]
    repo_id = job_data["repository_id"]
    pr_number = job_data.get("pr_number", 0)
    commit_sha = job_data.get("commit_sha", "HEAD")
    code_content = job_data.get("code_content", "")
    file_path = job_data.get("file_path", "unknown")

    factory = get_session_factory()
    async with factory() as db:
        # 1. Update job to processing
        stmt = select(ReviewJob).where(ReviewJob.id == job_id)
        job = (await db.execute(stmt)).scalar_one_or_none()
        if job:
            job.status = "processing"
            await db.commit()

        # 2. Run deterministic static scans
        findings_raw = scan_source_code(code_content, file_path=file_path)
        risk_score = calculate_risk_score(findings_raw)
        verdict = decide_verdict(risk_score)

        # 3. Enrich with RAG guidance
        findings_to_insert = []
        any_rag_success = False

        for f in findings_raw:
            cwe = f["cwe_id"]
            guidance, _, ok = await query_rag_guidance(query=f["title"], cwe_id=cwe)
            if ok:
                any_rag_success = True
            fix = get_suggested_fix(cwe, guidance)

            findings_to_insert.append({
                "cwe_id": cwe,
                "severity": f["severity"],
                "title": f["title"],
                "file_path": f["file_path"],
                "line_number": f["line_number"],
                "code_snippet": f["code_snippet"],
                "suggested_fix": fix,
            })

        # 4. Create review record
        summary = (
            f"Found {len(findings_raw)} issue(s). "
            f"Risk score: {risk_score}/100. Verdict: {verdict}."
        ) if findings_raw else "No security issues detected."

        review = Review(
            organization_id=org_id,
            repository_id=repo_id,
            job_id=job_id,
            pr_number=pr_number,
            commit_sha=commit_sha,
            risk_score=risk_score,
            verdict=verdict,
            summary=summary,
            guidance_available=any_rag_success or len(findings_raw) == 0,
        )
        db.add(review)
        await db.flush()

        for fin in findings_to_insert:
            db.add(Finding(review_id=review.id, organization_id=org_id, **fin))

        if job:
            job.status = "completed"

        # 5. Record audit event
        db.add(AuditEvent(
            organization_id=org_id,
            action="review_completed",
            resource_type="review",
            resource_id=review.id,
            details_json=f'{{"pr_number": {pr_number}, "verdict": "{verdict}"}}',
        ))

        await db.commit()
        logger.info(f"Processed review job {job_id} -> Verdict: {verdict}")


async def run_worker_loop() -> None:
    settings = get_settings()
    setup_logger(settings.redis_url)
    logger.info("Starting main-server review worker loop...")

    while True:
        try:
            job = await dequeue_review_job(timeout=2)
            if job:
                await process_single_job(job)
        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error(f"Worker encountered error: {e}")
            await asyncio.sleep(1)


if __name__ == "__main__":
    asyncio.run(run_worker_loop())
