"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Repository } from "@/types";
import { fetchRepositories } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { Button } from "@/components/ui/Button";
import { RepositoriesTable } from "@/components/repositories/RepositoriesTable";
import { GitHubIcon } from "@/components/ui/Icons";

export default function RepositoriesPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [search, setSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  useEffect(() => {
    fetchRepositories().then((data) => setRepositories(data));
  }, []);

  const languages = useMemo(() => {
    const set = new Set(repositories.map((r) => r.language));
    return ["all", ...Array.from(set)];
  }, [repositories]);

  const filtered = useMemo(() => {
    return repositories.filter((r) => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
      const matchLang =
        selectedLanguage === "all" || r.language === selectedLanguage;
      return matchSearch && matchLang;
    });
  }, [repositories, search, selectedLanguage]);

  return (
    <div className="space-y">
      <PageHeader
        title="Repositories"
        subtitle="Monitored source repositories with automated PR security gates."
        actions={
          <Button
            variant="primary"
            size="md"
            icon={<GitHubIcon size={16} />}
            onClick={() =>
              alert(
                "GitHub App connected. Configure additional repositories in GitHub settings."
              )
            }
          >
            Connect Repository
          </Button>
        }
      />

      {/* 4 Summary stat cards */}
      <div className="stat-grid">
        <MetricCard
          label="Monitored Repositories"
          value="4"
          subtitle="All active branches tracked"
        />

        <MetricCard
          label="Protected Repositories"
          value="4 / 4"
          severity="passed"
          subtitle="100% policy enforcement"
        />

        <MetricCard
          label="Avg Security Score"
          value="86"
          suffix="/ 100"
          severity="passed"
          subtitle="Target: >= 80"
        />

        <MetricCard
          label="Total Active Findings"
          value="32"
          severity="high"
          subtitle="2 critical, 8 high"
        />
      </div>

      {/* Filter Toolbar */}
      <div className="filter-bar flex-between">
        <div className="flex items-center gap-2.5 flex-wrap">
          <input
            type="text"
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ width: "240px" }}
          />

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="form-input"
          >
            <option value="all">All Languages</option>
            {languages
              .filter((l) => l !== "all")
              .map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
          </select>
        </div>

        <span className="text-xs text-dim">
          Showing {filtered.length} repositories
        </span>
      </div>

      {/* Repositories table */}
      <RepositoriesTable repositories={filtered} />
    </div>
  );
}
