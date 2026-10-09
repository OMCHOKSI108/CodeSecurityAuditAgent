"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Repository } from "@/types";
import { fetchRepositories } from "@/lib/api";
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
      const matchLang = selectedLanguage === "all" || r.language === selectedLanguage;
      return matchSearch && matchLang;
    });
  }, [repositories, search, selectedLanguage]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Repositories</h1>
            <p className="text-xs text-slate-400 mt-1">
              Monitored source repositories with automated PR security gates.
            </p>
          </div>
          <button
            onClick={() => alert("GitHub App already connected. Select additional repos in your GitHub settings.")}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition"
          >
            <GitHubIcon className="w-4 h-4" />
            Connect Repository
          </button>
        </div>

        {/* 4 Summary stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block">Monitored Repositories</span>
            <span className="text-2xl font-bold text-slate-100">4</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block">Protected Repositories</span>
            <span className="text-2xl font-bold text-emerald-400">4 / 4</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block">Avg Security Score</span>
            <span className="text-2xl font-bold text-sky-400">86</span>
            <span className="text-xs text-slate-500"> / 100</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block">Total Active Findings</span>
            <span className="text-2xl font-bold text-amber-400">32</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search repositories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 w-64 focus:outline-none focus:border-sky-500"
            />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="all">All Languages</option>
              {languages.filter((l) => l !== "all").map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          <span className="text-xs text-slate-400">Showing {filtered.length} repositories</span>
        </div>

        {/* Repositories table */}
        <RepositoriesTable repositories={filtered} />
      </div>
    </AppLayout>
  );
}
