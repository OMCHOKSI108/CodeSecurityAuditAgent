import React from "react";
import { Severity, GateStatus } from "@/types";

export function SeverityBadge({ severity }: { severity: Severity | string }) {
  const norm = severity.toLowerCase();
  let badgeClass = "badge-low";
  if (norm === "critical") badgeClass = "badge-critical";
  else if (norm === "high") badgeClass = "badge-high";
  else if (norm === "medium") badgeClass = "badge-medium";

  return <span className={`badge ${badgeClass}`}>{severity.toUpperCase()}</span>;
}

export function GateBadge({ status, text }: { status: GateStatus | string; text?: string }) {
  const norm = status.toUpperCase();
  if (norm === "BLOCKED") {
    return <span className="badge badge-blocked">❌ {text || "BLOCKED"}</span>;
  }
  if (norm === "PASSED" || norm === "APPROVE") {
    return <span className="badge badge-passed">✓ {text || "PASSED"}</span>;
  }
  return <span className="badge badge-in_review">⏳ {text || "IN REVIEW"}</span>;
}

export function StatusBadge({ status }: { status: string }) {
  const norm = status.toLowerCase();
  if (norm === "blocked") {
    return <span className="badge badge-blocked">{status}</span>;
  }
  if (norm === "protected" || norm === "passed") {
    return <span className="badge badge-passed">{status}</span>;
  }
  if (norm === "warning") {
    return <span className="badge badge-high">{status}</span>;
  }
  return <span className="badge badge-low">{status}</span>;
}
