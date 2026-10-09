"use client";

import React from "react";
import Link from "next/link";
import { Repository } from "@/types";
import { RepoIcon } from "@/components/ui/Icons";

interface Props {
  repositories: Repository[];
}

export function RepositoriesTable({ repositories }: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/70 text-slate-400 text-xs uppercase border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Repository</th>
              <th className="py-3.5 px-4 font-semibold">Language</th>
              <th className="py-3.5 px-4 font-semibold">Security Score</th>
              <th className="py-3.5 px-4 font-semibold">Open Vulnerabilities</th>
              <th className="py-3.5 px-4 font-semibold">Last Scan</th>
              <th className="py-3.5 px-4 font-semibold">Policy Gate</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {repositories.map((repo) => (
              <tr key={repo.id} className="hover:bg-slate-850/50 transition">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <RepoIcon className="w-4 h-4 text-slate-400" />
                    <Link
                      href={`/repositories/${repo.name}`}
                      className="font-medium text-slate-100 hover:text-sky-400 transition"
                    >
                      {repo.name}
                    </Link>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 border border-slate-700">
                    {repo.language}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${
                        repo.security_score >= 85
                          ? "text-emerald-400"
                          : repo.security_score >= 70
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      {repo.security_score}
                    </span>
                    <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                      {repo.critical_count} crit
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800">
                      {repo.high_count} high
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                      {repo.medium_count} med
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-400">{repo.last_scan}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      repo.status === "Blocked"
                        ? "bg-rose-950/80 text-rose-400 border border-rose-800"
                        : repo.status === "Warning"
                        ? "bg-amber-950/80 text-amber-400 border border-amber-800"
                        : "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                    }`}
                  >
                    {repo.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    href={`/repositories/${repo.name}`}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition"
                  >
                    Manage →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
