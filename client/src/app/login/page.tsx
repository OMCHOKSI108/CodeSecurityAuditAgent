"use client";

import React from "react";
import { GitHubIcon, ShieldCheckIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <div
      className="p-8 rounded-2xl border text-center flex flex-col gap-6"
      style={{
        maxWidth: "420px",
        width: "100%",
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="flex justify-center">
        <div
          className="w-12 h-12 rounded-xl border flex items-center justify-center"
          style={{
            backgroundColor: "rgba(56, 189, 248, 0.15)",
            borderColor: "rgba(56, 189, 248, 0.3)",
            color: "var(--accent)",
          }}
        >
          <ShieldCheckIcon size={24} />
        </div>
      </div>

      <div>
        <h1 className="text-xl font-bold text-main tracking-tight">
          CodeSecAudit AI
        </h1>
        <p className="text-xs text-muted mt-1">
          Autonomous Pull Request Security Review &amp; Policy Gate Platform
        </p>
      </div>

      <div
        className="p-4 rounded-xl border text-left flex flex-col gap-2 text-xs"
        style={{
          backgroundColor: "var(--bg-surface-elevated)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <div className="flex items-center gap-2 font-medium" style={{ color: "var(--pass-color)" }}>
          <span>✓</span> End-to-end AST Taint Analysis
        </div>
        <div className="flex items-center gap-2 font-medium" style={{ color: "var(--pass-color)" }}>
          <span>✓</span> OWASP Top 10 Contextual RAG
        </div>
        <div className="flex items-center gap-2 font-medium" style={{ color: "var(--pass-color)" }}>
          <span>✓</span> Automated PR Check Run Blocking
        </div>
      </div>

      <a href="/api/auth/github/start" className="w-full">
        <Button
          variant="primary"
          size="lg"
          className="w-full font-bold"
          icon={<GitHubIcon size={18} />}
        >
          Continue with GitHub
        </Button>
      </a>

      <div className="text-[11px] text-dim flex flex-col gap-1">
        <p>Protected with PKCE authorization and tenant-scoped sessions.</p>
        <p>Browser never accesses or stores raw GitHub API credentials.</p>
      </div>
    </div>
  );
}
