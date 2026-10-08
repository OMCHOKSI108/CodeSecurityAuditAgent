export interface UserProfile {
  id: string;
  github_id: string;
  username: string;
  email: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  active_organization_id: string;
  organization_name: string;
  organization_role: string;
}

export interface Finding {
  id: string;
  cwe_id: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  file_path: string;
  line_number?: number;
  code_snippet?: string;
  suggested_fix?: string;
}

export interface ReviewRecord {
  id: string;
  repository_id: string;
  pr_number: number;
  commit_sha: string;
  risk_score: number;
  verdict: "APPROVE" | "WARNING" | "REQUEST_CHANGES";
  summary: string;
  guidance_available: boolean;
  created_at: string;
  findings: Finding[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: string;
  message: string;
  service: string;
}
