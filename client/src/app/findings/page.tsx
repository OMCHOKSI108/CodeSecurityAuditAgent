"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Finding } from "@/types";
import { fetchFindings } from "@/lib/api";
import { FindingsTable } from "@/components/findings/FindingsTable";

export default function FindingsPage() {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFindings().then(setFindings);
  }, []);

  const filtered = useMemo(() => {
    return findings.filter((f) => {
      const matchSev = selectedSeverity === "all" || f.severity === selectedSeverity;
      const matchStat = selectedStatus === "all" || (f.status || "open") === selectedStatus;
      const matchSearch =
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        f.cwe_id.toLowerCase().includes(search.toLowerCase()) ||
        f.file_path.toLowerCase().includes(search.toLowerCase());
      return matchSev && matchStat && matchSearch;
    });
  }, [findings, selectedSeverity, selectedStatus, search]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Security Findings</h1>
          <p className="text-xs text-slate-400 mt-1">
            23 open findings detected across your repositories.
          </p>
        </div>

        {/* Action Callout: UX Principle */}
        <div className="bg-rose-950/25 border border-rose-900/60 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="text-rose-400 font-bold">🔴 2 Critical</span>
              <span className="text-orange-400 font-bold">🟠 8 High</span>
              <span className="text-slate-400">&bull; 13 Medium/Low</span>
            </div>
            <p className="text-xs text-slate-300">
              The 2 critical findings are currently blocking <strong>3 Pull Requests</strong> from merging into production.
            </p>
          </div>
          <button
            onClick={() => setSelectedSeverity("critical")}
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition shadow-sm"
          >
            Filter Critical Findings
          </button>
        </div>

        {/* Filter bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search findings, CWE, files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 w-64 focus:outline-none focus:border-sky-500"
            />
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {["all", "critical", "high", "medium", "low"].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-2.5 py-1 text-xs font-medium rounded capitalize transition ${
                    selectedSeverity === sev
                      ? "bg-slate-800 text-sky-400 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
              <option value="ignored">Ignored</option>
            </select>
          </div>
          <span className="text-xs text-slate-400">Showing {filtered.length} findings</span>
        </div>

        {/* Findings list table */}
        <FindingsTable findings={filtered} />
      </div>
    </AppLayout>
  );
}
