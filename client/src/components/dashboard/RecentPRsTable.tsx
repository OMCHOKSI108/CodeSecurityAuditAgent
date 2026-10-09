"use client";

import React from "react";
import Link from "next/link";
import { PullRequest } from "@/types";
import { GateBadge } from "@/components/ui/Badge";

export function RecentPRsTable({ prs }: { prs: PullRequest[] }) {
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ fontSize: "1rem" }}>RECENT PULL REQUESTS</h3>
        <Link href="/pull-requests" style={{ fontSize: "0.8rem", color: "var(--accent)" }}>View all pull requests →</Link>
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
              <th>Status</th>
              <th>Scan Time</th>
            </tr>
          </thead>
          <tbody>
            {prs.map((pr) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
