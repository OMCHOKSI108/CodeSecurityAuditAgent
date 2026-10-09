"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { PullRequest } from "@/types";
import { fetchPullRequests } from "@/lib/api";
import { GateBadge } from "@/components/ui/Badge";

export default function PullRequestsPage() {
  const [prs, setPrs] = useState<PullRequest[]>([]);
  const [filterGate, setFilterGate] = useState<string>("ALL");
  const [repoFilter, setRepoFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetchPullRequests().then(setPrs);
  }, []);

  const repos = useMemo(() => Array.from(new Set(prs.map((p) => p.repository))), [prs]);

  const filtered = useMemo(() => {
    return prs.filter((pr) => {
      if (filterGate !== "ALL" && pr.gate_status !== filterGate) return false;
      if (repoFilter !== "ALL" && pr.repository !== repoFilter) return false;
      if (searchQuery && !pr.title.toLowerCase().includes(searchQuery.toLowerCase()) && !String(pr.pr_number).includes(searchQuery)) {
        return false;
      }
      return true;
    });
  }, [prs, filterGate, repoFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Pull Requests</h1>
        <p className="text-xs text-slate-400 mt-1">
          Automated security reviews and gate enforcement triggered by GitHub webhooks.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {["ALL", "BLOCKED", "PASSED"].map((g) => (
              <button
                key={g}
                onClick={() => setFilterGate(g)}
                className={`px-3 py-1 text-xs font-semibold rounded transition ${
                  filterGate === g ? "bg-slate-800 text-sky-400 shadow-sm" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <select
            value={repoFilter}
            onChange={(e) => setRepoFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Repositories</option>
            {repos.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search PR title or #number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 w-60 focus:outline-none focus:border-sky-500"
          />
        </div>
        <span className="text-xs text-slate-400">Showing {filtered.length} pull requests</span>
      </div>

      {/* PR Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/70 text-slate-400 text-xs uppercase border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">PR</th>
                <th className="py-3.5 px-4 font-semibold">Repository</th>
                <th className="py-3.5 px-4 font-semibold">Author</th>
                <th className="py-3.5 px-4 font-semibold">Security Score</th>
                <th className="py-3.5 px-4 font-semibold">Findings</th>
                <th className="py-3.5 px-4 font-semibold">Gate Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-xs">
                    No pull requests match the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((pr) => (
                  <tr key={pr.id} className="hover:bg-slate-850/50 transition">
                    <td className="py-3.5 px-4">
                      <Link href={`/pull-requests/${pr.pr_number}`} className="font-medium text-slate-100 hover:text-sky-400 block">
                        <span className="font-mono text-sky-400 mr-1.5">#{pr.pr_number}</span>
                        {pr.title}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-300">{pr.repository}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">{pr.author}</td>
                    <td className="py-3.5 px-4">
                      <span className={`font-bold text-xs ${pr.security_score < 75 ? "text-rose-400" : "text-emerald-400"}`}>
                        {pr.security_score}
                      </span>
                      <span className="text-xs text-slate-500"> / 100</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono">
                      {pr.findings_summary.critical > 0 && (
                        <span className="text-rose-400 font-bold mr-2">🔴 {pr.findings_summary.critical}</span>
                      )}
                      {pr.findings_summary.high > 0 && (
                        <span className="text-orange-400 mr-2">🟠 {pr.findings_summary.high}</span>
                      )}
                      {pr.findings_summary.medium > 0 && (
                        <span className="text-amber-400 mr-2">🟡 {pr.findings_summary.medium}</span>
                      )}
                      {pr.findings_summary.critical === 0 && pr.findings_summary.high === 0 && (
                        <span className="text-emerald-400">🟢 Clean</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <GateBadge status={pr.gate_status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/pull-requests/${pr.pr_number}`}
                        className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition"
                      >
                        Review Audit →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
