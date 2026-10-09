"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PullRequest, Repository } from "@/types";
import { fetchPullRequests, fetchRepositories } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RepositoriesTable } from "@/components/repositories/RepositoriesTable";
import { RecentPRsTable } from "@/components/dashboard/RecentPRsTable";

export default function DashboardPage() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [prs, setPrs] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchRepositories(), fetchPullRequests()])
      .then(([r, p]) => {
        setRepos(r);
        setPrs(p);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y">
      {/* Page Header */}
      <PageHeader
        title="Security Posture Dashboard"
        subtitle="Real-time Pull Request risk assessment across active repositories."
        actions={
          <Link href="/pull-requests">
            <Button variant="primary" size="md">
              View All Pull Requests →
            </Button>
          </Link>
        }
      />

      {/* Immediate Attention Callout: What needs attention right now */}
      <div className="banner-alert">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="badge badge-critical">⚠️ Action Required</span>
            <span className="text-muted text-xs">&bull; 23 open findings</span>
          </div>
          <p className="text-sm text-main font-medium mt-1">
            <strong style={{ color: "var(--crit-color)" }}>
              2 Critical findings
            </strong>{" "}
            are currently blocking{" "}
            <strong style={{ color: "var(--crit-color)" }}>
              3 Pull Requests
            </strong>{" "}
            in <code className="crumb-badge">payment-api</code>.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/findings?severity=critical">
            <Button variant="danger" size="sm">
              Review Critical Findings →
            </Button>
          </Link>
          <Link href="/pull-requests">
            <Button variant="secondary" size="sm">
              View Blocked PRs (3)
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Core Metrics */}
      <div className="stat-grid">
        <MetricCard
          label="Security Score"
          value="87"
          suffix="/ 100"
          trend="+4%"
          trendDirection="up"
          trendPositive={true}
          subtitle="from last week"
        />

        <MetricCard
          label="Open Findings"
          value="23"
          trend="12% reduction"
          trendDirection="down"
          trendPositive={true}
          subtitle="across 4 repos"
        />

        <MetricCard
          label="Critical Issues"
          value="2"
          severity="critical"
          subtitle="🔴 Blocking merges"
        />

        <MetricCard
          label="PRs Blocked"
          value="3"
          severity="critical"
          subtitle="Strict policy gate active"
        />
      </div>

      {/* Repositories Overview */}
      <Card
        title="Monitored Repositories"
        description="Active code repositories analyzed for security gates"
        actions={
          <Link
            href="/repositories"
            className="text-xs hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Manage Repositories →
          </Link>
        }
      >
        <RepositoriesTable repositories={repos} />
      </Card>

      {/* Recent PR Stream */}
      <RecentPRsTable prs={prs} />
    </div>
  );
}
