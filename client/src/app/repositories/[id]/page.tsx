"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Repository, PullRequest, Finding } from "@/types";
import { fetchRepositoryById, fetchPullRequests, fetchFindings } from "@/lib/api";
import { ArrowLeftIcon, RepoIcon, ShieldCheckIcon, GitHubIcon } from "@/components/ui/Icons";
import { GateBadge, SeverityBadge } from "@/components/ui/Badge";

export default function RepositoryDetailPage() {
  const params = useParams();
  const repoName = typeof params?.id === "string" ? params.id : "payment-api";
  const [repo, setRepo] = useState<Repository | null>(null);
  const [prs, setPrs] = useState<PullRequest[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);

  useEffect(() => {
    fetchRepositoryById(repoName).then((data) => {
      if (data) setRepo(data);
    });
    fetchPullRequests().then((data) => {
      setPrs(data.filter((p) => p.repository === repoName));
    });
    fetchFindings().then((data) => {
      setFindings(data.filter((f) => f.repository === repoName));
    });
  }, [repoName]);

  if (!repo) {
    return (
      <AppLayout>
        <div className="p-8 text-center text-slate-400">Loading repository details...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <Link
            href="/repositories"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-sky-400 transition mb-3"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Repositories
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400">
                <RepoIcon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  {repo.name}
                  <span className="px-2 py-0.5 rounded text-xs font-normal bg-slate-800 text-slate-300 border border-slate-700">
                    {repo.language}
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Default branch: <span className="font-mono text-slate-300">main</span> &bull; Webhook: <span className="text-emerald-400">Active</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800 flex items-center gap-1.5">
                <ShieldCheckIcon className="w-4 h-4" />
                Branch Protection Active
              </span>
              <a
                href={`https://github.com/example/${repo.name}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition"
              >
                <GitHubIcon className="w-3.5 h-3.5" />
                Open in GitHub ↗
              </a>
            </div>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block">Security Score</span>
            <span className="text-2xl font-bold text-emerald-400">{repo.security_score}</span>
            <span className="text-xs text-slate-500"> / 100</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block">PRs Audited</span>
            <span className="text-2xl font-bold text-slate-100">{repo.pr_count || 42}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block">Open Vulnerabilities</span>
            <span className="text-2xl font-bold text-rose-400">{repo.open_findings_count}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block">Mean Time to Fix</span>
            <span className="text-2xl font-bold text-sky-400">3.4 hrs</span>
          </div>
        </div>

        {/* PR History */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-base font-semibold text-slate-200 mb-4">Pull Request Audit History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="pb-3 font-semibold">PR</th>
                  <th className="pb-3 font-semibold">Author</th>
                  <th className="pb-3 font-semibold">Score</th>
                  <th className="pb-3 font-semibold">Gate Verdict</th>
                  <th className="pb-3 font-semibold">Audited</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {prs.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-850/50">
                    <td className="py-3">
                      <Link href={`/pull-requests/${p.pr_number}`} className="font-medium text-slate-100 hover:text-sky-400">
                        #{p.pr_number} - {p.title}
                      </Link>
                    </td>
                    <td className="py-3 text-slate-300 text-xs">{p.author}</td>
                    <td className="py-3 font-semibold text-xs text-sky-400">{p.security_score}/100</td>
                    <td className="py-3"><GateBadge status={p.gate_status} /></td>
                    <td className="py-3 text-slate-400 text-xs">{p.scanned_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active findings */}
        {findings.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-base font-semibold text-slate-200 mb-3">Active Repository Vulnerabilities</h2>
            <div className="space-y-3">
              {findings.map((f) => (
                <div key={f.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <SeverityBadge severity={f.severity} />
                    <span className="font-medium text-sm text-slate-200">{f.title}</span>
                    <span className="text-xs font-mono text-slate-400">{f.file_path}:{f.line_number}</span>
                  </div>
                  <Link href={`/findings/${f.id}`} className="text-xs text-sky-400 hover:underline">
                    View Analysis →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
