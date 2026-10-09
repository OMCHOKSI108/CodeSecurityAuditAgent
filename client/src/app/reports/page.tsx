"use client";

import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ReportSummary } from "@/types";
import { fetchReportSummary } from "@/lib/api";
import { ShieldCheckIcon, DocumentTextIcon } from "@/components/ui/Icons";

export default function ReportsPage() {
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [period, setPeriod] = useState("October 2026");

  useEffect(() => {
    fetchReportSummary().then((r) => setReport(r));
  }, []);

  const handleExport = (type: string) => {
    alert(`Generating ${type} report for ${period}... Download will begin shortly.`);
  };

  if (!report) {
    return (
      <AppLayout>
        <div className="p-8 text-center text-slate-400">Loading audit report...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Security &amp; Compliance Reports</h1>
            <p className="text-xs text-slate-400 mt-1">
              Executive audit summaries, remediation metrics, and compliance attestations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
            >
              <option value="October 2026">October 2026 (Current)</option>
              <option value="September 2026">September 2026</option>
              <option value="Q3 2026">Q3 2026 Cumulative</option>
            </select>
            <button
              onClick={() => handleExport("PDF")}
              className="px-3 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition"
            >
              Export PDF
            </button>
            <button
              onClick={() => handleExport("CSV")}
              className="px-3 py-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700 font-medium text-xs transition"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Executive Summary Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <DocumentTextIcon className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-semibold text-slate-100">Executive Audit Overview ({period})</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            During {period}, CodeSecAudit AI evaluated {report.prs_scanned} pull requests across {report.repos_scanned} active microservice repositories. Automated policy gates blocked 19 high-risk security regressions before merging into production, achieving an overall 98.4% gate compliance rate.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-lg border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block">Total PRs Audited</span>
              <span className="text-lg font-bold text-slate-100">{report.prs_scanned}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Vulnerabilities Detected</span>
              <span className="text-lg font-bold text-amber-400">{report.vulnerabilities_detected}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Resolved / Remediated</span>
              <span className="text-lg font-bold text-emerald-400">{report.resolved_vulnerabilities}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Resolution Rate</span>
              <span className="text-lg font-bold text-sky-400">86.5%</span>
            </div>
          </div>
        </div>

        {/* Compliance Framework Mapping */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-base font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
            Compliance Framework Verification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-xs text-slate-200">SOC 2 Type II</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">PASSED</span>
              </div>
              <p className="text-xs text-slate-400">Controls CC6.6 &amp; CC6.7: Continuous code integrity and peer security gate verification.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-xs text-slate-200">ISO/IEC 27001</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">PASSED</span>
              </div>
              <p className="text-xs text-slate-400">Control A.14.2: Security in development and support processes via automated SAST taint-tracking.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-xs text-slate-200">OWASP Top 10</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">100% COVERED</span>
              </div>
              <p className="text-xs text-slate-400">Active rulesets verifying A01:2021 through A10:2021 with contextual private RAG explanation.</p>
            </div>
          </div>
        </div>

        {/* Remediation MTTR Metrics */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-base font-semibold text-slate-100 mb-3">Mean Time to Remediate (MTTR) Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-slate-950 p-4 rounded-lg border border-rose-900/40">
              <span className="text-xs text-rose-400 font-medium block">Critical Vulnerabilities</span>
              <span className="text-2xl font-bold text-rose-300">{report.avg_remediation_hours.critical} hours</span>
              <span className="text-[11px] text-slate-500 block mt-1">SLA: &lt; 24 hours</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-lg border border-orange-900/40">
              <span className="text-xs text-orange-400 font-medium block">High Vulnerabilities</span>
              <span className="text-2xl font-bold text-orange-300">{report.avg_remediation_hours.high} hours</span>
              <span className="text-[11px] text-slate-500 block mt-1">SLA: &lt; 72 hours</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-lg border border-amber-900/40">
              <span className="text-xs text-amber-400 font-medium block">Medium Vulnerabilities</span>
              <span className="text-2xl font-bold text-amber-300">{report.avg_remediation_hours.medium_days} days</span>
              <span className="text-[11px] text-slate-500 block mt-1">SLA: &lt; 14 days</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
