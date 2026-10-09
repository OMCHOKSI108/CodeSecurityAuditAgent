"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Finding, Severity } from "@/types";
import { fetchFindings } from "@/lib/api";
import { FindingsTable } from "@/components/findings/FindingsTable";

export default function FindingsPage() {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFindings().then((data) => setFindings(data));
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
            Centralized vulnerability ledger across all monitored repositories.
          </p>
        </div>

        {/* Metric summary pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-center">
            <span className="text-xs text-slate-400 block">Total Active</span>
            <span className="text-xl font-bold text-slate-100">23</span>
          </div>
          <div className="bg-slate-900 border border-rose-900/40 p-3 rounded-lg text-center">
            <span className="text-xs text-rose-400 block">Critical</span>
            <span className="text-xl font-bold text-rose-400">2</span>
          </div>
          <div className="bg-slate-900 border border-orange-900/40 p-3 rounded-lg text-center">
            <span className="text-xs text-orange-400 block">High</span>
            <span className="text-xl font-bold text-orange-400">7</span>
          </div>
          <div className="bg-slate-900 border border-amber-900/40 p-3 rounded-lg text-center">
            <span className="text-xs text-amber-400 block">Medium</span>
            <span className="text-xl font-bold text-amber-400">14</span>
          </div>
          <div className="bg-slate-900 border border-emerald-900/40 p-3 rounded-lg text-center">
            <span className="text-xs text-emerald-400 block">Resolved (30d)</span>
            <span className="text-xl font-bold text-emerald-400">167</span>
          </div>
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
