"use client";

import React from "react";
import Link from "next/link";
import { PullRequest } from "@/types";
import { GateBadge } from "@/components/ui/Badge";

export function RecentPRsTable({ prs }: { prs: PullRequest[] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">Recent Pull Request Audits</h2>
          <p className="text-xs text-slate-400">Automated gate verdicts for incoming pull requests.</p>
        </div>
        <Link href="/pull-requests" className="text-xs text-sky-400 hover:underline">
          View all pull requests →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th className="pb-3 font-semibold">PR</th>
              <th className="pb-3 font-semibold">Repository</th>
              <th className="pb-3 font-semibold">Author</th>
              <th className="pb-3 font-semibold">Security Score</th>
              <th className="pb-3 font-semibold">Findings</th>
              <th className="pb-3 font-semibold">Gate Status</th>
              <th className="pb-3 font-semibold">Audited</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {prs.map((pr) => (
              <tr key={pr.id} className="hover:bg-slate-850/50 transition">
                <td className="py-3 font-medium text-slate-100">
                  <Link href={`/pull-requests/${pr.pr_number}`} className="hover:text-sky-400">
                    <span className="font-mono text-sky-400 mr-1.5">#{pr.pr_number}</span>
                    {pr.title}
                  </Link>
                </td>
                <td className="py-3 font-mono text-xs text-slate-300">{pr.repository}</td>
                <td className="py-3 text-xs text-slate-400">{pr.author}</td>
                <td className="py-3 font-semibold text-xs text-sky-400">{pr.security_score}/100</td>
                <td className="py-3 text-xs font-mono">
                  {pr.findings_summary.critical > 0 && (
                    <span className="text-rose-400 font-bold mr-2">🔴 {pr.findings_summary.critical} Crit</span>
                  )}
                  {pr.findings_summary.high > 0 && (
                    <span className="text-orange-400 mr-2">🟠 {pr.findings_summary.high} High</span>
                  )}
                  {pr.findings_summary.critical === 0 && pr.findings_summary.high === 0 && (
                    <span className="text-emerald-400 font-medium">🟢 Clean</span>
                  )}
                </td>
                <td className="py-3">
                  <GateBadge status={pr.gate_status} />
                </td>
                <td className="py-3 text-xs text-slate-400">{pr.scanned_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
