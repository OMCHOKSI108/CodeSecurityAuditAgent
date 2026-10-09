"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PullRequest } from "@/types";
import { fetchPullRequestById } from "@/lib/api";
import { SeverityBadge, GateBadge } from "@/components/ui/Badge";
import { ArrowLeftIcon, GitHubIcon } from "@/components/ui/Icons";

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
    return <div className="p-12 text-center text-slate-400">Loading PR Security Audit...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation: Pull Requests -> PR #{pr.pr_number} */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/pull-requests" className="hover:text-sky-400 transition flex items-center gap-1">
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          Pull Requests
        </Link>
        <span>/</span>
        <span className="text-slate-300 font-mono">PR #{pr.pr_number}</span>
      </nav>

      {/* Header with Title, metadata, and GitHub CTA */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-xl font-bold font-mono text-sky-400">#{pr.pr_number}</span>
            <h1 className="text-2xl font-bold text-white tracking-tight">{pr.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="font-mono bg-slate-800 text-slate-200 px-2 py-0.5 rounded">{pr.repository}</span>
            <span>Author: <strong className="text-slate-200">{pr.author}</strong></span>
            <span>Commit: <span className="font-mono text-slate-300">{pr.commit_sha || "HEAD"}</span></span>
            <span>Audited: {pr.scanned_at}</span>
          </div>
        </div>

        <a
          href={`https://github.com/example/${pr.repository}/pull/${pr.pr_number}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition"
        >
          <GitHubIcon className="w-4 h-4" />
          Open in GitHub ↗
        </a>
      </div>

      {/* 3 Metrics: Gate Status, Security Score, Findings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 block mb-2">Security Gate Verdict</span>
          <GateBadge status={pr.gate_status} />
          <p className="text-xs text-slate-400 mt-2">
            {pr.gate_status === "BLOCKED" ? "Merge blocked in GitHub branch checks." : "All security criteria satisfied."}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 block mb-1">Security Score</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold ${pr.security_score < 75 ? "text-rose-400" : "text-emerald-400"}`}>
              {pr.security_score}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Based on severity weights and policy limits</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 block mb-2">Findings Summary</span>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-rose-400 font-bold">{pr.findings_summary.critical} Crit</span> &bull;
            <span className="text-orange-400 font-bold">{pr.findings_summary.high} High</span> &bull;
            <span className="text-amber-400 font-bold">{pr.findings_summary.medium} Med</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-2">Total {pr.findings.length} detected security items</span>
        </div>
      </div>

      {/* Gate Reason Callout: Rule 30: Never hide why PR was blocked */}
      <div className={`p-4 rounded-xl border ${pr.gate_status === "BLOCKED" ? "bg-rose-950/30 border-rose-900/60" : "bg-emerald-950/30 border-emerald-900/60"}`}>
        <h2 className="text-xs font-bold uppercase tracking-wide mb-1 text-slate-200">
          Security Gate Evaluation
        </h2>
        <p className="text-xs text-slate-300">
          <strong>Reason:</strong> {pr.gate_reason || "Policy evaluated by CodeSecAudit CI webhook."}
        </p>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-slate-100">Vulnerabilities in this PR ({pr.findings.length})</h2>
        {pr.findings.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl text-center text-xs text-emerald-400">
            ✓ Zero security vulnerabilities detected in modified lines.
          </div>
        ) : (
          pr.findings.map((f) => (
            <div key={f.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <SeverityBadge severity={f.severity} />
                  <h3 className="text-sm font-semibold text-slate-100">{f.title}</h3>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {f.cwe_id}
                  </span>
                </div>
                <Link
                  href={`/findings/${f.id}`}
                  className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition"
                >
                  View Finding &amp; Fix →
                </Link>
              </div>

              <div className="text-xs font-mono text-slate-400">
                {f.file_path}:{f.line_number || 1}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {f.why_it_matters}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>OWASP: <strong className="text-slate-200">{f.owasp_category || "A03:2021"}</strong></span>
                <span>AI Confidence: <strong className="text-sky-400">{f.confidence || 94}%</strong></span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
