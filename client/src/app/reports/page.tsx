"use client";

import React, { useEffect, useState } from "react";
import { ReportSummary } from "@/types";
import { fetchReportSummary } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheckIcon, DocumentTextIcon } from "@/components/ui/Icons";

export default function ReportsPage() {
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [period, setPeriod] = useState("October 2026");

  useEffect(() => {
    fetchReportSummary().then(setReport);
  }, []);

  const handleExport = (type: string) => {
    alert(`Generating ${type} report for ${period}... Download will begin shortly.`);
  };

  if (!report) {
    return (
      <div className="py-16 text-center text-muted text-xs">
        <span className="btn-spinner mr-2" />
        Loading audit report...
      </div>
    );
  }

  return (
    <div className="space-y">
      <PageHeader
        title="Security & Compliance Reports"
        subtitle="Executive audit summaries, remediation metrics, and compliance attestations."
        actions={
          <div className="flex items-center gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="form-input"
            >
              <option value="October 2026">October 2026 (Current)</option>
              <option value="September 2026">September 2026</option>
              <option value="Q3 2026">Q3 2026 Cumulative</option>
            </select>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleExport("PDF")}
            >
              Export PDF
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleExport("CSV")}
            >
              Export CSV
            </Button>
          </div>
        }
      />

      {/* Executive Summary Card */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <DocumentTextIcon size={18} className="text-accent" />
            <span>Executive Audit Overview ({period})</span>
          </div>
        }
      >
        <p className="text-xs text-muted leading-relaxed mb-4">
          During {period}, CodeSecAudit AI evaluated {report.prs_scanned} pull requests across {report.repos_scanned} active microservice repositories. Automated policy gates blocked 19 high-risk security regressions before merging into production, achieving an overall 98.4% gate compliance rate.
        </p>

        <div className="stat-grid">
          <div className="metric-card">
            <span className="metric-card-label">Total PRs Audited</span>
            <span className="metric-card-value">{report.prs_scanned}</span>
          </div>
          <div className="metric-card">
            <span className="metric-card-label">Vulnerabilities Detected</span>
            <span className="metric-card-value text-warning">{report.vulnerabilities_detected}</span>
          </div>
          <div className="metric-card">
            <span className="metric-card-label">Resolved / Remediated</span>
            <span className="metric-card-value text-success">{report.resolved_vulnerabilities}</span>
          </div>
          <div className="metric-card">
            <span className="metric-card-label">Resolution Rate</span>
            <span className="metric-card-value text-accent">86.5%</span>
          </div>
        </div>
      </Card>

      {/* Compliance Framework Mapping */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <ShieldCheckIcon size={18} className="text-success" />
            <span>Compliance Framework Verification</span>
          </div>
        }
      >
        <div className="grid-2">
          {[
            {
              title: "SOC 2 Type II",
              badge: "PASSED",
              variant: "passed" as const,
              desc: "Controls CC6.6 & CC6.7: Continuous code integrity and peer security gate verification.",
            },
            {
              title: "ISO/IEC 27001",
              badge: "PASSED",
              variant: "passed" as const,
              desc: "Control A.14.2: Security in development and support processes via automated SAST taint-tracking.",
            },
            {
              title: "OWASP Top 10",
              badge: "100% COVERED",
              variant: "passed" as const,
              desc: "Active rulesets verifying A01:2021 through A10:2021 with contextual private RAG explanation.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-4 rounded border"
              style={{
                backgroundColor: "var(--bg-surface-elevated)",
                borderColor: "var(--border-subtle)",
              }}
            >
              <div className="flex-between mb-2">
                <span className="font-semibold text-xs text-main">{item.title}</span>
                <Badge variant={item.variant}>{item.badge}</Badge>
              </div>
              <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Remediation MTTR Metrics */}
      <Card title="Mean Time to Remediate (MTTR) Breakdown">
        <div className="grid-2 text-center">
          <div
            className="p-4 rounded border"
            style={{
              backgroundColor: "var(--crit-bg)",
              borderColor: "var(--crit-border)",
            }}
          >
            <span className="text-xs font-semibold block" style={{ color: "var(--crit-color)" }}>
              Critical Vulnerabilities
            </span>
            <span className="text-2xl font-bold font-mono text-main mt-1 block">
              {report.avg_remediation_hours.critical} hours
            </span>
            <span className="text-[11px] text-dim block mt-1">SLA: &lt; 24 hours</span>
          </div>

          <div
            className="p-4 rounded border"
            style={{
              backgroundColor: "var(--high-bg)",
              borderColor: "var(--high-border)",
            }}
          >
            <span className="text-xs font-semibold block" style={{ color: "var(--high-color)" }}>
              High Vulnerabilities
            </span>
            <span className="text-2xl font-bold font-mono text-main mt-1 block">
              {report.avg_remediation_hours.high} hours
            </span>
            <span className="text-[11px] text-dim block mt-1">SLA: &lt; 72 hours</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
