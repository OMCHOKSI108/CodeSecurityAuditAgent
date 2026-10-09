"use client";

import React from "react";
import { SecurityPolicy } from "@/types";
import { ShieldCheckIcon, AlertTriangleIcon } from "@/components/ui/Icons";

interface Props {
  policy: SecurityPolicy;
  onChange: (updated: SecurityPolicy) => void;
  onSave: () => void;
  saving: boolean;
}

export function PolicyForm({ policy, onChange, onSave, saving }: Props) {
  const update = (key: keyof SecurityPolicy, value: any) => {
    onChange({ ...policy, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Policy Rules Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Pull Request Merge Gate Rules</h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure automated GitHub PR check run blocking conditions.
          </p>
        </div>

        <div className="space-y-4 divide-y divide-slate-800/80">
          {/* Critical toggle */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="text-sm font-medium text-slate-200 block">Block on Critical Vulnerabilities</span>
              <span className="text-xs text-slate-400">Strictly block PR merge if SQLi, RCE, or Critical CWEs are found.</span>
            </div>
            <input
              type="checkbox"
              checked={policy.block_critical}
              onChange={(e) => update("block_critical", e.target.checked)}
              className="w-5 h-5 rounded accent-sky-500 cursor-pointer"
            />
          </div>

          {/* Secrets toggle */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="text-sm font-medium text-slate-200 block">Block on Hardcoded Secrets &amp; Keys</span>
              <span className="text-xs text-slate-400">Block PRs introducing AWS, Stripe, GitHub, or high-entropy tokens.</span>
            </div>
            <input
              type="checkbox"
              checked={policy.block_secrets}
              onChange={(e) => update("block_secrets", e.target.checked)}
              className="w-5 h-5 rounded accent-sky-500 cursor-pointer"
            />
          </div>

          {/* High toggle */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="text-sm font-medium text-slate-200 block">Block on High Severity Vulnerabilities</span>
              <span className="text-xs text-slate-400">Require fixes or security lead bypass for SSRF, broken auth, and high CVEs.</span>
            </div>
            <input
              type="checkbox"
              checked={policy.block_high}
              onChange={(e) => update("block_high", e.target.checked)}
              className="w-5 h-5 rounded accent-sky-500 cursor-pointer"
            />
          </div>

          {/* Medium toggle */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="text-sm font-medium text-slate-200 block">Block on Medium Severity Vulnerabilities</span>
              <span className="text-xs text-slate-400">Only recommend warnings by default; toggle on for zero-defect branches.</span>
            </div>
            <input
              type="checkbox"
              checked={policy.block_medium}
              onChange={(e) => update("block_medium", e.target.checked)}
              className="w-5 h-5 rounded accent-sky-500 cursor-pointer"
            />
          </div>

          {/* Secret detection */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="text-sm font-medium text-slate-200 block">Shannon Entropy Analysis</span>
              <span className="text-xs text-slate-400">Run algorithmic high-entropy mathematical scanning on string literals.</span>
            </div>
            <input
              type="checkbox"
              checked={policy.secret_detection}
              onChange={(e) => update("secret_detection", e.target.checked)}
              className="w-5 h-5 rounded accent-sky-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Sliders */}
        <div className="pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-slate-300">Minimum PR Security Score</label>
              <span className="text-xs font-mono font-bold text-sky-400">{policy.min_security_score} / 100</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={policy.min_security_score}
              onChange={(e) => update("min_security_score", Number(e.target.value))}
              className="w-full accent-sky-500"
            />
            <span className="text-[11px] text-slate-500 block mt-1">PRs scoring below this threshold will be marked BLOCKED.</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-slate-300">Minimum AI Confidence to Block</label>
              <span className="text-xs font-mono font-bold text-sky-400">{policy.confidence_threshold}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="99"
              step="1"
              value={policy.confidence_threshold}
              onChange={(e) => update("confidence_threshold", Number(e.target.value))}
              className="w-full accent-sky-500"
            />
            <span className="text-[11px] text-slate-500 block mt-1">Prevents false-positive blocks when confidence is low.</span>
          </div>
        </div>
      </div>

      {/* Gate Simulation Preview & Save */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Simulation on Recent 10 Pull Requests</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            With these rules: <strong className="text-emerald-400">8 would PASS</strong>, <strong className="text-rose-400">2 would be BLOCKED</strong>.
          </p>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs shadow-md transition disabled:opacity-50"
        >
          {saving ? "Saving Policy..." : "Save Policy Configuration"}
        </button>
      </div>
    </div>
  );
}
