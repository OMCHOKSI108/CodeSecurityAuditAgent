import React from "react";
import { Severity, GateStatus } from "@/types";

export function SeverityBadge({ severity }: { severity: Severity | string }) {
  const norm = severity.toLowerCase();
  let badgeClass = "badge-low";
  let icon = "🔵";
  if (norm === "critical") {
    badgeClass = "badge-critical";
    icon = "🔴";
  } else if (norm === "high") {
    badgeClass = "badge-high";
    icon = "🟠";
  } else if (norm === "medium") {
    badgeClass = "badge-medium";
    icon = "🟡";
  }

  return (
    <span className={`badge ${badgeClass} inline-flex items-center gap-1.5`}>
      <span>{icon}</span>
      <span>{severity.toUpperCase()}</span>
    </span>
  );
}

export function GateBadge({ status, text }: { status: GateStatus | string; text?: string }) {
  const norm = status.toUpperCase();
  if (norm === "BLOCKED" || norm === "REQUEST_CHANGES") {
    return (
      <span className="badge badge-blocked inline-flex items-center gap-1.5">
        <span>🔴</span>
        <span>{text || "BLOCKED"}</span>
      </span>
    );
  }
  if (norm === "PASSED" || norm === "APPROVE") {
    return (
      <span className="badge badge-passed inline-flex items-center gap-1.5">
        <span>🟢</span>
        <span>{text || "PASSED"}</span>
      </span>
    );
  }
  return (
    <span className="badge badge-in_review inline-flex items-center gap-1.5">
      <span>⏳</span>
      <span>{text || "IN REVIEW"}</span>
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const norm = status.toLowerCase();
  if (norm === "blocked" || norm === "open") {
    return (
      <span className="badge badge-blocked inline-flex items-center gap-1.5">
        <span>🔴</span>
        <span className="capitalize">{status}</span>
      </span>
    );
  }
  if (norm === "protected" || norm === "passed" || norm === "resolved") {
    return (
      <span className="badge badge-passed inline-flex items-center gap-1.5">
        <span>🟢</span>
        <span className="capitalize">{status}</span>
      </span>
    );
  }
  if (norm === "warning") {
    return (
      <span className="badge badge-high inline-flex items-center gap-1.5">
        <span>🟠</span>
        <span className="capitalize">{status}</span>
      </span>
    );
  }
  return (
    <span className="badge badge-low inline-flex items-center gap-1.5">
      <span>⚪</span>
      <span className="capitalize">{status}</span>
    </span>
  );
}
