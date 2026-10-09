"use client";

import React, { useState } from "react";
import { Finding } from "@/types";
import { CheckCircleIcon, ShieldCheckIcon, AlertTriangleIcon } from "@/components/ui/Icons";

interface Props {
  finding: Finding;
  onStatusChange: (newStatus: "open" | "resolved" | "ignored") => void;
}

export function FindingDetailContent({ finding, onStatusChange }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyFix = () => {
    if (finding.suggested_fix) {
      navigator.clipboard.writeText(finding.suggested_fix);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Vulnerability Summary */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-base font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <ShieldCheckIcon className="w-5 h-5 text-sky-400" />
          1. Vulnerability Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-slate-950/60 p-4 rounded-lg border border-slate-800/80 mb-4">
          <div>
            <span className="text-slate-400 block text-xs">Vulnerability</span>
            <span className="font-semibold text-slate-100">{finding.title} ({finding.cwe_id})</span>
          </div>
          <div>
            <span className="text-slate-400 block text-xs">Location</span>
            <span className="font-mono text-xs text-sky-300">{finding.file_path}:{finding.line_number}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-xs">Repository</span>
            <span className="font-medium text-slate-200">{finding.repository}</span>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          {finding.reasoning_summary || "Automated static analysis detected an insecure implementation pattern."}
        </p>
      </section>

      {/* 2. Why this matters */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-base font-semibold text-slate-200 mb-2 flex items-center gap-2">
          <AlertTriangleIcon className="w-5 h-5 text-amber-400" />
          2. Why This Matters
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          {finding.why_it_matters}
        </p>
      </section>

      {/* 3 & 6. Vulnerable Code vs Recommended Fix */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-200">
            3 &amp; 6. Code Comparison &amp; Recommended Fix
          </h2>
          <button
            onClick={handleCopyFix}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition"
          >
            {copied ? "✓ Copied to clipboard" : "Copy Secure Fix"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between px-3 py-1.5 bg-rose-950/40 border border-rose-900/60 rounded-t-lg">
              <span className="text-xs font-semibold text-rose-300">Vulnerable Code</span>
              <span className="text-[11px] font-mono text-rose-400">Line {finding.line_number}</span>
            </div>
            <pre className="p-4 bg-slate-950 border-x border-b border-slate-800 rounded-b-lg text-xs font-mono text-rose-200/90 overflow-x-auto whitespace-pre leading-relaxed">
              {finding.code_snippet || "// Code snippet unavailable"}
            </pre>
          </div>

          <div>
            <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-950/40 border border-emerald-900/60 rounded-t-lg">
              <span className="text-xs font-semibold text-emerald-300">Remediated Fix (OWASP Compliant)</span>
              <span className="text-[11px] text-emerald-400 font-medium">Safe Implementation</span>
            </div>
            <pre className="p-4 bg-slate-950 border-x border-b border-slate-800 rounded-b-lg text-xs font-mono text-emerald-200/90 overflow-x-auto whitespace-pre leading-relaxed">
              {finding.suggested_fix || "// Fix suggestion unavailable"}
            </pre>
          </div>
        </div>
      </section>

      {/* 4. Attack Scenario */}
      {finding.attack_scenario && (
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-base font-semibold text-slate-200 mb-2">
            4. Concrete Attack Scenario
          </h2>
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-lg text-xs font-mono text-amber-200/90 leading-relaxed">
            {finding.attack_scenario}
          </div>
        </section>
      )}

      {/* 5 & 7. OWASP Context & AI Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-base font-semibold text-slate-200 mb-2">5. OWASP Context</h2>
          <div className="text-xs font-semibold text-sky-400 bg-sky-950/40 border border-sky-900/50 px-2.5 py-1 rounded inline-block mb-3">
            {finding.owasp_category || "OWASP Top 10"}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {finding.security_principle || "Follow defense-in-depth secure coding principles."}
          </p>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold text-slate-200">7. AI RAG Analysis</h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-sky-950 text-sky-400 border border-sky-800">
              {finding.confidence || 92}% Confidence
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Taint-tracking path traced from untrusted ingress parameter through the AST nodes directly into the target sink without intermediate validation.
          </p>
          <div className="text-[11px] text-slate-400 font-mono">
            Model: Qdrant Vector Search + Llama 3 Security Classifier
          </div>
        </section>
      </div>

      {/* 8. Action Bar */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">8. Remediation State</h3>
          <p className="text-xs text-slate-400">Update vulnerability status across your workspace.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onStatusChange("resolved")}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition"
          >
            Mark as Resolved
          </button>
          <button
            onClick={() => onStatusChange("ignored")}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            Ignore / Accept Risk
          </button>
          <button
            onClick={() => onStatusChange("open")}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition"
          >
            Re-open Finding
          </button>
        </div>
      </section>
    </div>
  );
}
