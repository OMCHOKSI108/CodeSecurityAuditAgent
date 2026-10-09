"use client";

import React, { useEffect, useState } from "react";
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

  const filtered = prs.filter((pr) => {
    if (filterGate !== "ALL" && pr.gate_status !== filterGate) return false;
    if (repoFilter !== "ALL" && pr.repository !== repoFilter) return false;
    if (searchQuery && !pr.title.toLowerCase().includes(searchQuery.toLowerCase()) && !String(pr.pr_number).includes(searchQuery)) {
      return false;
    }
    return true;
  });

  const repos = Array.from(new Set(prs.map((p) => p.repository)));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Pull Requests</h1>
        <p className="page-subtitle">Security reviews triggered from your GitHub repositories.</p>
      </div>

      <div className="filter-bar">
        <div style={{ display: "flex", gap: "0.25rem", background: "var(--bg-surface)", padding: "4px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
          {["ALL", "BLOCKED", "PASSED"].map((g) => (
            <button
              key={g}
              onClick={() => setFilterGate(g)}
              className="btn"
              style={{
                padding: "0.35rem 0.75rem",
                fontSize: "0.8rem",
                background: filterGate === g ? "rgba(56, 189, 248, 0.15)" : "transparent",
                color: filterGate === g ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              {g}
            </button>
          ))}
        </div>

        <select
          value={repoFilter}
          onChange={(e) => setRepoFilter(e.target.value)}
          className="form-input"
        >
          <option value="ALL">All Repositories</option>
          {repos.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by title or #PR..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
          style={{ width: "240px" }}
        />
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>PR</th>
              <th>Repository</th>
              <th>Author</th>
              <th>Security Score</th>
              <th>Findings</th>
              <th>Security Gate</th>
              <th>Last Scan</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "var(--text-dim)" }}>
                  No Pull Requests found matching the selected filters.
                </td>
              </tr>
            ) : (
              filtered.map((pr) => (
                <tr key={pr.id}>
                  <td>
                    <Link href={`/pull-requests/${pr.id}`} style={{ fontWeight: 600, color: "var(--accent)" }}>
                      #{pr.pr_number} {pr.title}
                    </Link>
                  </td>
                  <td className="mono" style={{ fontSize: "0.8rem" }}>{pr.repository}</td>
                  <td>{pr.author}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: pr.security_score < 75 ? "var(--crit-color)" : "var(--pass-color)" }}>
                      {pr.security_score}/100
                    </span>
                  </td>
                  <td style={{ fontSize: "0.8rem" }}>
                    {pr.findings_summary.critical > 0 && (
                      <span style={{ color: "var(--crit-color)", fontWeight: 700, marginRight: "6px" }}>
                        {pr.findings_summary.critical} Critical
                      </span>
                    )}
                    {pr.findings_summary.high > 0 && (
                      <span style={{ color: "var(--high-color)", marginRight: "6px" }}>
                        {pr.findings_summary.high} High
                      </span>
                    )}
                    {pr.findings_summary.medium > 0 && (
                      <span style={{ color: "var(--med-color)" }}>
                        {pr.findings_summary.medium} Med
                      </span>
                    )}
                    {pr.findings_summary.critical === 0 && pr.findings_summary.high === 0 && pr.findings_summary.medium === 0 && (
                      <span style={{ color: "var(--pass-color)" }}>0 Issues</span>
                    )}
                  </td>
                  <td><GateBadge status={pr.gate_status} /></td>
                  <td style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>{pr.scanned_at}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
