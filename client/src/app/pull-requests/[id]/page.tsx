"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PullRequest } from "@/types";
import { fetchPullRequestById } from "@/lib/api";
import { SeverityBadge, GateBadge } from "@/components/ui/Badge";

export default function PRDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [pr, setPr] = useState<PullRequest | null>(null);

  useEffect(() => {
    if (id) {
      fetchPullRequestById(id).then(setPr);
    }
  }, [id]);

  if (!pr) {
    return <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-dim)" }}>Loading PR Security Audit...</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
            <span style={{ fontSize: "1.25rem", color: "var(--accent)", fontWeight: 700 }}>#{pr.pr_number}</span>
            <h1 className="page-title" style={{ margin: 0, fontSize: "1.5rem" }}>{pr.title}</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
            <span className="mono" style={{ background: "var(--bg-surface-elevated)", padding: "2px 6px", borderRadius: "4px" }}>
              {pr.repository}
            </span>
            <span>by <strong style={{ color: "var(--text-main)" }}>{pr.author}</strong></span>
            <span>Commit: <span className="mono">{pr.commit_sha || "HEAD"}</span></span>
            <span>Scanned: {pr.scanned_at}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <a
            href={`https://github.com/example/${pr.repository}/pull/${pr.pr_number}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
          >
            Open in GitHub ↗
          </a>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="stat-card">
          <div className="stat-label">Security Gate</div>
          <div style={{ marginTop: "0.25rem" }}><GateBadge status={pr.gate_status} /></div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.5rem" }}>
            {pr.gate_status === "BLOCKED" ? "Merge blocked in GitHub branch checks" : "Passed all security criteria"}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Security Score</div>
          <div className="stat-value" style={{ color: pr.security_score < 75 ? "var(--crit-color)" : "var(--pass-color)" }}>
            {pr.security_score}<span style={{ fontSize: "1rem", color: "var(--text-dim)" }}>/100</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>
            Based on severity weights and policy limits
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Findings Summary</div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ color: "var(--crit-color)", fontWeight: 700 }}>{pr.findings_summary.critical} Critical</span> ·
            <span style={{ color: "var(--high-color)", fontWeight: 700 }}>{pr.findings_summary.high} High</span> ·
            <span style={{ color: "var(--med-color)", fontWeight: 700 }}>{pr.findings_summary.medium} Medium</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "0.5rem" }}>
            Total {pr.findings.length} detected security items
          </div>
        </div>
      </div>

      <div className="card" style={{ borderColor: pr.gate_status === "BLOCKED" ? "var(--crit-border)" : "var(--pass-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "1.2rem" }}>{pr.gate_status === "BLOCKED" ? "❌" : "✓"}</span>
          <h3 style={{ fontSize: "1rem", margin: 0 }}>
            SECURITY GATE: {pr.gate_status === "BLOCKED" ? "Merge Blocked" : "Merge Approved"}
          </h3>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          <strong>Reason:</strong> {pr.gate_reason || "Policy evaluated by CodeSecAudit CI webhook."}
        </p>
      </div>

      <div className="card">
        <h3 style={{ fontSize: "1rem", marginBottom: "1rem" }}>SCAN TIMELINE</h3>
        <div style={{ display: "flex", justifyContent: "space-between", position: "relative", padding: "1rem 0" }}>
          {[
            { step: "PR Opened", desc: "Webhook received", done: true },
            { step: "Scan Started", desc: "Diff parsed", done: true },
            { step: "Analysis Completed", desc: "Rules + RAG lookup", done: true },
            { step: "Findings Generated", desc: `${pr.findings.length} issues detected`, done: true },
            { step: "GitHub Comment Posted", desc: pr.gate_status === "BLOCKED" ? "Blocked commit check" : "Approval posted", done: true },
          ].map((s, idx) => (
            <div key={idx} style={{ textAlign: "center", flex: 1, position: "relative" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--pass-bg)", border: "2px solid var(--pass-color)", margin: "0 auto 0.5rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "var(--pass-color)", fontWeight: 700 }}>
                ✓
              </div>
              <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>{s.step}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Security Findings ({pr.findings.length})</h2>
        {pr.findings.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
            ✓ No security vulnerabilities detected in this Pull Request.
          </div>
        ) : (
          pr.findings.map((finding) => (
            <div key={finding.id} className="card" style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                    <SeverityBadge severity={finding.severity} />
                    <h3 style={{ fontSize: "1.1rem", margin: 0 }}>{finding.title}</h3>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", background: "var(--bg-surface-elevated)", padding: "2px 6px", borderRadius: "4px" }}>
                      {finding.cwe_id}
                    </span>
                  </div>
                  <div className="mono" style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {finding.file_path}:{finding.line_number || 1}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link href={`/findings/${finding.id}`} className="btn btn-primary" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}>
                    View Finding →
                  </Link>
                </div>
              </div>

              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                {finding.why_it_matters || "Potential security defect identified in modified lines."}
              </p>

              <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: "var(--text-dim)", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.5rem" }}>
                <span>OWASP: <strong style={{ color: "var(--text-muted)" }}>{finding.owasp_category || "A03:2021 — Injection"}</strong></span>
                <span>Confidence: <strong style={{ color: "var(--text-muted)" }}>{finding.confidence || 94}%</strong></span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
