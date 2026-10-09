"use client";

import React from "react";
import { GitHubIcon, ShieldCheckIcon } from "@/components/ui/Icons";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400">
            <ShieldCheckIcon className="w-6 h-6" />
          </div>
        </div>

        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">CodeSecAudit AI</h1>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous Pull Request Security Review &amp; Policy Gate Platform
          </p>
        </div>

        <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl text-left space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <span>✓</span> End-to-end AST Taint Analysis
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <span>✓</span> OWASP Top 10 Contextual RAG
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <span>✓</span> Automated PR Check Run Blocking
          </div>
        </div>

        <a
          href="/api/auth/github/start"
          className="w-full inline-flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-sky-500/10"
        >
          <GitHubIcon className="w-5 h-5" />
          Continue with GitHub
        </a>

        <div className="text-[11px] text-slate-500 space-y-1">
          <p>Protected with PKCE authorization and tenant-scoped sessions.</p>
          <p>Browser never accesses or stores raw GitHub API credentials.</p>
        </div>
      </div>
    </div>
  );
}
