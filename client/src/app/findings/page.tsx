"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Finding } from "@/types";
import { fetchFindings } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { FindingsTable } from "@/components/findings/FindingsTable";
import { Button } from "@/components/ui/Button";

export default function FindingsPage() {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFindings().then(setFindings);
  }, []);

  const filtered = useMemo(() => {
    return findings.filter((f) => {
      const matchSev =
        selectedSeverity === "all" || f.severity === selectedSeverity;
      const matchStat =
        selectedStatus === "all" || (f.status || "open") === selectedStatus;
      const matchSearch =
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        f.cwe_id.toLowerCase().includes(search.toLowerCase()) ||
        f.file_path.toLowerCase().includes(search.toLowerCase());
      return matchSev && matchStat && matchSearch;
    });
  }, [findings, selectedSeverity, selectedStatus, search]);

  return (
    <div className="space-y">
      <PageHeader
        title="Security Findings"
        subtitle="Vulnerabilities detected by automated AST and RAG security analysis."
      />

      {/* Action Banner */}
      <div className="banner-alert">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-critical">🔴 2 Critical</span>
            <span className="badge badge-high">🟠 8 High</span>
            <span className="text-dim text-xs">&bull; 13 Medium / Low</span>
          </div>
          <p className="text-xs text-main">
            The 2 critical findings are currently blocking{" "}
            <strong style={{ color: "var(--crit-color)" }}>
              3 Pull Requests
            </strong>{" "}
            from merging into production branches.
          </p>
        </div>

        <Button
          variant="danger"
          size="sm"
          onClick={() => setSelectedSeverity("critical")}
        >
          Filter Critical Findings
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-bar flex-between">
        <div className="flex items-center gap-2.5 flex-wrap">
          <input
            type="text"
            placeholder="Search findings, CWE, files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ width: "240px" }}
          />

          <div className="flex items-center gap-1">
            {["all", "critical", "high", "medium", "low"].map((sev) => (
              <Button
                key={sev}
                variant={selectedSeverity === sev ? "primary" : "secondary"}
                size="sm"
                onClick={() => setSelectedSeverity(sev)}
                className="capitalize"
              >
                {sev}
              </Button>
            ))}
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="form-input"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
            <option value="ignored">Ignored</option>
          </select>
        </div>

        <span className="text-xs text-dim">
          Showing {filtered.length} findings
        </span>
      </div>

      {/* Findings Table */}
      <FindingsTable findings={filtered} />
    </div>
  );
}
