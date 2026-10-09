import { Finding, LogEntry, PullRequest, Repository, ReviewRecord, SecurityPolicy, UserProfile } from "@/types";
import { MOCK_PRS, MOCK_REPOSITORIES, MOCK_POLICY, MOCK_TEAM, MOCK_REPORT } from "./mockData";
import { MOCK_FINDINGS } from "./mockFindings";

export async function fetchMe(): Promise<UserProfile> {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (res.ok) return await res.json();
  } catch {}
  return {
    id: "usr-default",
    github_id: "108",
    username: "omchoksi",
    email: "om@codesec.ai",
    avatar_url: "https://avatars.githubusercontent.com/u/108?v=4",
    is_admin: true,
    active_organization_id: "org-acme",
    organization_name: "Acme Engineering",
    organization_role: "admin",
  };
}

export async function fetchReviews(): Promise<ReviewRecord[]> {
  try {
    const res = await fetch("/api/reviews", { credentials: "include" });
    if (res.ok) return await res.json();
  } catch {}
  return [];
}

export async function fetchReviewDetail(id: string): Promise<ReviewRecord | null> {
  try {
    const res = await fetch(`/api/reviews/${id}`, { credentials: "include" });
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

export async function fetchPullRequests(): Promise<PullRequest[]> {
  const reviews = await fetchReviews();
  if (reviews.length > 0) {
    const livePrs: PullRequest[] = reviews.map((r) => {
      const crit = r.findings.filter((f) => f.severity === "critical").length;
      const high = r.findings.filter((f) => f.severity === "high").length;
      const med = r.findings.filter((f) => f.severity === "medium").length;
      const low = r.findings.filter((f) => f.severity === "low").length;
      return {
        id: r.id,
        pr_number: r.pr_number,
        title: `Security Audit PR #${r.pr_number}`,
        repository: r.repository_id || "production-repo",
        author: "GitHub Author",
        security_score: 100 - r.risk_score,
        findings_summary: { critical: crit, high, medium: med, low },
        gate_status: r.verdict === "APPROVE" ? "PASSED" : "BLOCKED",
        scanned_at: new Date(r.created_at).toLocaleDateString(),
        commit_sha: r.commit_sha.slice(0, 7),
        gate_reason: r.summary,
        findings: r.findings,
      };
    });
    return [...livePrs, ...MOCK_PRS];
  }
  return MOCK_PRS;
}

export async function fetchPullRequestById(id: string): Promise<PullRequest | null> {
  const all = await fetchPullRequests();
  const found = all.find((p) => p.id === id || String(p.pr_number) === id);
  return found || MOCK_PRS[0];
}

export async function fetchRepositories(): Promise<Repository[]> {
  try {
    const res = await fetch("/api/repositories", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {}
  return MOCK_REPOSITORIES;
}

export async function fetchRepositoryById(id: string): Promise<Repository | null> {
  const all = await fetchRepositories();
  const found = all.find((r) => r.id === id || r.name === id);
  return found || MOCK_REPOSITORIES[0];
}

export async function fetchFindings(): Promise<Finding[]> {
  try {
    const res = await fetch("/api/findings", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {}
  return MOCK_FINDINGS;
}

export async function fetchFindingById(id: string): Promise<Finding | null> {
  const all = await fetchFindings();
  const found = all.find((f) => f.id === id);
  return found || MOCK_FINDINGS[0];
}

export async function fetchSecurityPolicy(): Promise<SecurityPolicy> {
  try {
    const res = await fetch("/api/policies", { credentials: "include" });
    if (res.ok) return await res.json();
  } catch {}
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("codesec_policy");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
  }
  return MOCK_POLICY;
}

export async function saveSecurityPolicy(policy: SecurityPolicy): Promise<boolean> {
  try {
    await fetch("/api/policies", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(policy),
      credentials: "include",
    });
  } catch {}
  if (typeof window !== "undefined") {
    localStorage.setItem("codesec_policy", JSON.stringify(policy));
  }
  return true;
}

export async function fetchTeamMembers() {
  try {
    const res = await fetch("/api/team", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {}
  return MOCK_TEAM;
}

export async function fetchReportSummary() {
  return MOCK_REPORT;
}

export async function fetchLogs(
  service: "main-server" | "client-server" | "rag-server",
  limit = 50
): Promise<LogEntry[]> {
  try {
    const res = await fetch(`/api-logs/${service}-logs?limit=${limit}`, { credentials: "include" });
    if (res.ok) return await res.json();
  } catch {}
  return [];
}
