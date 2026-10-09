"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PullRequest, Repository } from "@/types";
import { fetchPullRequests, fetchRepositories } from "@/lib/api";
import { StatusBadge } from "@/components/ui/Badge";
import { RecentPRsTable } from "@/components/dashboard/RecentPRsTable";

export default function DashboardPage() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [prs, setPrs] = useState<PullRequest[]>([]);

  useEffect(() => {
    fetchRepositories().then(setRepos);
    fetchPullRequests().then(setPrs);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Security Posture Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time Pull Request risk assessment across Acme Engineering.</p>
        </div>
        <Link
          href="/pull-requests"
          className="px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition"
        >
          View All Pull Requests →
        </Link>
      </div>

      {/* Immediate Attention Callout: What to know + What to do next */}
      <div className="bg-rose-950/30 border border-rose-900/60 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">⚠️ Action Required</span>
            <span className="text-slate-400 text-xs">&bull; 23 open findings</span>
          </div>
          <p className="text-sm text-slate-200 font-medium">
            <strong className="text-rose-400">2 Critical findings</strong> are currently blocking <strong className="text-rose-400">3 Pull Requests</strong> in <code className="font-mono text-xs text-rose-300">payment-api</code>.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/findings?severity=critical"
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition shadow-sm"
          >
            Review Critical Findings →
          </Link>
          <Link
            href="/pull-requests"
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition"
          >
            View Blocked PRs (3)
          </Link>
        </div>
      </div>

      {/* 4 Core Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 block">Security Score</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-slate-100">87</span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <span className="text-[11px] text-emerald-400 block mt-1">↑ +4% from last period</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 block">Open Findings</span>
          <div className="text-2xl font-bold text-slate-100 mt-1">23</div>
          <span className="text-[11px] text-emerald-400 block mt-1">↓ 12% reduction</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 block">Critical Issues</span>
          <div className="text-2xl font-bold text-rose-400 mt-1">2</div>
          <span className="text-[11px] text-rose-400 block mt-1">🔴 Blocking merges</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 block">PRs Blocked</span>
          <div className="text-2xl font-bold text-rose-400 mt-1">3</div>
          <span className="text-[11px] text-slate-400 block mt-1">Strict policy gate</span>
        </div>
      </div>

      {/* Repository Security Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-200">Monitored Repositories</h2>
          <Link href="/repositories" className="text-xs text-sky-400 hover:underline">View all repos →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="pb-3 font-semibold">Repository</th>
                <th className="pb-3 font-semibold">Score</th>
                <th className="pb-3 font-semibold">Critical</th>
                <th className="pb-3 font-semibold">High</th>
                <th className="pb-3 font-semibold">Medium</th>
                <th className="pb-3 font-semibold">Last Scan</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {repos.map((r) => (
                <tr key={r.id} className="hover:bg-slate-850/50">
                  <td className="py-3 font-medium text-slate-100">
                    <Link href={`/repositories/${r.name}`} className="hover:text-sky-400">{r.name}</Link>
                  </td>
                  <td className="py-3 font-semibold text-xs text-sky-400">{r.security_score}/100</td>
                  <td className="py-3 font-semibold text-xs text-rose-400">{r.critical_count}</td>
                  <td className="py-3 font-semibold text-xs text-orange-400">{r.high_count}</td>
                  <td className="py-3 text-xs text-slate-300">{r.medium_count}</td>
                  <td className="py-3 text-xs text-slate-400">{r.last_scan}</td>
                  <td className="py-3"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent PR Stream */}
      <RecentPRsTable prs={prs} />
    </div>
  );
}
