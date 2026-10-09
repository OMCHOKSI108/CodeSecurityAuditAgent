"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Finding } from "@/types";
import { fetchFindingById } from "@/lib/api";
import { SeverityBadge, StatusBadge } from "@/components/ui/Badge";
import { ArrowLeftIcon, GitHubIcon } from "@/components/ui/Icons";
import { FindingDetailContent } from "@/components/findings/FindingDetailContent";

export default function FindingDetailPage() {
  const params = useParams();
  const findingId = typeof params?.id === "string" ? params.id : "finding-1";
  const [finding, setFinding] = useState<Finding | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchFindingById(findingId).then((data) => {
      if (data) setFinding(data);
    });
  }, [findingId]);

  const handleStatusChange = (newStatus: "open" | "resolved" | "ignored") => {
    if (!finding) return;
    setFinding({ ...finding, status: newStatus });
    setToastMessage(`Finding state updated to ${newStatus}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!finding) {
    return (
      <AppLayout>
        <div className="p-12 text-center text-slate-400">Loading finding details...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {toastMessage && (
          <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-200 px-4 py-2.5 rounded-lg text-sm flex items-center justify-between">
            <span>✓ {toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Deep Breadcrumb Navigation: Rule 14 */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/findings" className="hover:text-sky-400 transition flex items-center gap-1">
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            Security Findings
          </Link>
          <span>/</span>
          <Link href={`/repositories/${finding.repository}`} className="hover:text-sky-400 transition font-mono">
            {finding.repository}
          </Link>
          <span>/</span>
          <span className="text-slate-300 font-medium">{finding.title}</span>
          <span className="text-slate-500 font-mono text-[11px]">({finding.cwe_id})</span>
        </nav>

        {/* Header with Title, metadata, and GitHub CTA */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <SeverityBadge severity={finding.severity} />
              <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {finding.cwe_id}
              </span>
              <StatusBadge status={finding.status || "open"} />
              <span className="text-xs text-slate-400">{finding.detected_at || "Recently"}</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{finding.title}</h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              {finding.repository} &bull; {finding.file_path}:{finding.line_number}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={`https://github.com/example/${finding.repository}/blob/main/${finding.file_path}#L${finding.line_number}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition"
            >
              <GitHubIcon className="w-4 h-4" />
              Open in GitHub ↗
            </a>
            <Link
              href={`/repositories/${finding.repository}`}
              className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-850 hover:bg-slate-800 text-sky-400 border border-slate-700 transition"
            >
              Repository Overview
            </Link>
          </div>
        </div>

        {/* 8-part Content */}
        <FindingDetailContent finding={finding} onStatusChange={handleStatusChange} />
      </div>
    </AppLayout>
  );
}
