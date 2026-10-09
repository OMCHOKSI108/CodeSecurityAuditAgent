"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Finding } from "@/types";
import { fetchFindingById } from "@/lib/api";
import { SeverityBadge, StatusBadge } from "@/components/ui/Badge";
import { ArrowLeftIcon } from "@/components/ui/Icons";
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
    setToastMessage(`Finding updated to ${newStatus}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!finding) {
    return (
      <AppLayout>
        <div className="p-8 text-center text-slate-400">Loading finding details...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {toastMessage && (
          <div className="bg-sky-950/80 border border-sky-800 text-sky-200 px-4 py-2.5 rounded-lg text-sm flex items-center justify-between">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Back breadcrumb */}
        <div>
          <Link
            href="/findings"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-sky-400 transition mb-3"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to All Findings
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-4">
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

            <div className="flex items-center gap-2">
              <Link
                href={`/repositories/${finding.repository}`}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              >
                View Repository
              </Link>
            </div>
          </div>
        </div>

        {/* 8-part Content */}
        <FindingDetailContent finding={finding} onStatusChange={handleStatusChange} />
      </div>
    </AppLayout>
  );
}
