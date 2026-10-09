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
    <div>
      <div className="page-header">
        <h1 className="page-title">Good morning, Acme Engineering</h1>
        <p className="page-subtitle">Here's the current security posture across your repositories.</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Security Score</div>
          <div className="stat-value">87<span style={{ fontSize: "1rem", color: "var(--text-dim)" }}>/100</span></div>
          <div className="stat-trend trend-up">↑ 4% from last period</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Open Findings</div>
          <div className="stat-value">23</div>
          <div className="stat-trend trend-up">↓ 12% from last period</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Critical Issues</div>
          <div className="stat-value" style={{ color: "var(--crit-color)" }}>2</div>
          <div className="stat-trend" style={{ color: "var(--text-dim)" }}>Blocking active merges</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">PRs Blocked</div>
          <div className="stat-value" style={{ color: "var(--blocked-color)" }}>3</div>
          <div className="stat-trend" style={{ color: "var(--text-dim)" }}>Enforced by security gate</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "1rem" }}>SECURITY POSTURE</h3>
          <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--accent)" }}>87</span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Previous: 83/100 (↑ 4% trend)</span>
          </div>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
            Posture reflects automated OWASP vulnerability scans across 24 connected repositories. 2 Critical findings currently block merging.
          </p>
          <div style={{ height: "8px", background: "var(--border-subtle)", borderRadius: "4px", overflow: "hidden", display: "flex" }}>
            <div style={{ width: "87%", background: "var(--accent)" }} />
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "1rem" }}>FINDINGS BY SEVERITY</h3>
          <div style={{ display: "flex", gap: "0.5rem", height: "12px", borderRadius: "6px", overflow: "hidden", marginBottom: "1rem" }}>
            <div style={{ width: "10%", background: "var(--crit-color)" }} title="Critical: 2" />
            <div style={{ width: "35%", background: "var(--high-color)" }} title="High: 8" />
            <div style={{ width: "40%", background: "var(--med-color)" }} title="Medium: 9" />
            <div style={{ width: "15%", background: "var(--low-color)" }} title="Low: 4" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", textAlign: "center" }}>
            <div style={{ padding: "0.5rem", background: "var(--bg-surface-elevated)", borderRadius: "6px" }}>
              <div style={{ color: "var(--crit-color)", fontWeight: 700 }}>2</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>Critical</div>
            </div>
            <div style={{ padding: "0.5rem", background: "var(--bg-surface-elevated)", borderRadius: "6px" }}>
              <div style={{ color: "var(--high-color)", fontWeight: 700 }}>8</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>High</div>
            </div>
            <div style={{ padding: "0.5rem", background: "var(--bg-surface-elevated)", borderRadius: "6px" }}>
              <div style={{ color: "var(--med-color)", fontWeight: 700 }}>9</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>Medium</div>
            </div>
            <div style={{ padding: "0.5rem", background: "var(--bg-surface-elevated)", borderRadius: "6px" }}>
              <div style={{ color: "var(--low-color)", fontWeight: 700 }}>4</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>Low</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1rem" }}>REPOSITORY SECURITY</h3>
          <Link href="/repositories" style={{ fontSize: "0.8rem", color: "var(--accent)" }}>View all 24 repos →</Link>
        </div>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Repository</th>
                <th>Security Score</th>
                <th>Critical</th>
                <th>High</th>
                <th>Medium</th>
                <th>Last Scan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {repos.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600, color: "var(--text-main)" }}>
                    <Link href={`/repositories/${r.id}`}>{r.name}</Link>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: r.security_score < 75 ? "var(--crit-color)" : "var(--pass-color)" }}>
                      {r.security_score}/100
                    </span>
                  </td>
                  <td style={{ color: r.critical_count > 0 ? "var(--crit-color)" : "inherit", fontWeight: r.critical_count > 0 ? 700 : 400 }}>
                    {r.critical_count}
                  </td>
                  <td>{r.high_count}</td>
                  <td>{r.medium_count}</td>
                  <td style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>{r.last_scan}</td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RecentPRsTable prs={prs} />
    </div>
  );
}
