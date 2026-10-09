"use client";

import React from "react";
import { TrendsCharts } from "@/components/trends/TrendsCharts";
import { PageHeader } from "@/components/ui/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card } from "@/components/ui/Card";

export default function TrendsPage() {
  return (
    <div className="space-y">
      <PageHeader
        title="Security Trends & Posture"
        subtitle="Quarterly vulnerability metrics, MTTR performance, and automated gate enforcement history."
      />

      {/* 4 KPI Cards */}
      <div className="stat-grid">
        <MetricCard
          label="Security Score"
          value="87"
          trend="+17 pts"
          trendDirection="up"
          trendPositive={true}
          subtitle="from 70 in Q3"
        />

        <MetricCard
          label="Critical Reduction"
          value="2 Active"
          trend="↓ 42%"
          trendDirection="down"
          trendPositive={true}
          subtitle="vs 8 previous quarter"
        />

        <MetricCard
          label="Critical MTTR"
          value="3.2 hrs"
          trend="-58%"
          trendDirection="down"
          trendPositive={true}
          subtitle="mean time to remediate"
        />

        <MetricCard
          label="Gate Enforcement"
          value="98.4%"
          severity="passed"
          subtitle="474 / 482 PRs gated safely"
        />
      </div>

      {/* Visual Charts */}
      <TrendsCharts />

      {/* PR Gate Verdict Distribution & Top Remediated CWEs */}
      <div className="grid-2">
        <Card
          title="Pull Request Gate Verdicts (30 Days)"
          description="Distribution of PR verdicts enforced by automated policy gates"
        >
          <div className="grid-2 mb-3">
            <div
              className="p-3 rounded text-center border"
              style={{
                backgroundColor: "var(--bg-surface-elevated)",
                borderColor: "var(--border-subtle)",
              }}
            >
              <span
                className="text-xs font-semibold block"
                style={{ color: "var(--pass-color)" }}
              >
                Passed &amp; Merged
              </span>
              <span className="text-xl font-bold font-mono text-main mt-1 block">
                396 (82.1%)
              </span>
            </div>

            <div
              className="p-3 rounded text-center border"
              style={{
                backgroundColor: "var(--bg-surface-elevated)",
                borderColor: "var(--border-subtle)",
              }}
            >
              <span
                className="text-xs font-semibold block"
                style={{ color: "var(--crit-color)" }}
              >
                Blocked by Policy
              </span>
              <span className="text-xl font-bold font-mono text-main mt-1 block">
                86 (17.9%)
              </span>
            </div>
          </div>

          <p className="text-xs text-muted leading-relaxed">
            Every blocked pull request required developer remediation or
            security lead sign-off before merging, preventing 86 potential CVE
            vulnerabilities from reaching production branches.
          </p>
        </Card>

        <Card
          title="Top Remediated CWEs This Quarter"
          description="High-frequency vulnerability types resolved before release"
        >
          <div className="flex flex-col gap-2">
            {[
              { cwe: "CWE-89: SQL Injection", count: "38 resolved" },
              { cwe: "CWE-798: Hardcoded Credentials", count: "27 resolved" },
              { cwe: "CWE-78: OS Command Injection", count: "19 resolved" },
              { cwe: "CWE-918: Server-Side Request Forgery", count: "14 resolved" },
            ].map((item) => (
              <div
                key={item.cwe}
                className="flex-between p-2.5 rounded border text-xs"
                style={{
                  backgroundColor: "var(--bg-surface-elevated)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <span className="font-mono text-main">{item.cwe}</span>
                <span
                  className="font-medium"
                  style={{ color: "var(--pass-color)" }}
                >
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
