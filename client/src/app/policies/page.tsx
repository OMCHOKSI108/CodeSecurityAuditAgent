"use client";

import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SecurityPolicy } from "@/types";
import { fetchSecurityPolicy, saveSecurityPolicy } from "@/lib/api";
import { PolicyForm } from "@/components/policies/PolicyForm";
import { ShieldCheckIcon, AlertTriangleIcon } from "@/components/ui/Icons";

export default function PoliciesPage() {
  const [policy, setPolicy] = useState<SecurityPolicy | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSecurityPolicy().then((p) => setPolicy(p));
  }, []);

  const handleSave = async () => {
    if (!policy) return;
    setSaving(true);
    await saveSecurityPolicy(policy);
    setSaving(false);
    setToastMessage("Security policy successfully updated and synchronized with GitHub check runs.");
    setTimeout(() => setToastMessage(null), 4000);
  };

  if (!policy) {
    return (
      <AppLayout>
        <div className="p-8 text-center text-slate-400">Loading policy rules...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Security Policies</h1>
          <p className="text-xs text-slate-400 mt-1">
            Define automated guardrails and blocking criteria for CI/CD Pull Request gates.
          </p>
        </div>

        {toastMessage && (
          <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-200 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
            <span>✓ {toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Active Gate status banner */}
        <div className="bg-gradient-to-r from-sky-950/60 to-slate-900 border border-sky-800/60 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-900/50 flex items-center justify-center text-sky-400">
              <ShieldCheckIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-100">Active Enforcement Gate: Strict Mode</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  LIVE IN PRODUCTION
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Blocking merge on Critical &amp; High vulnerabilities, hardcoded secrets, and scores &lt; {policy.min_security_score}.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Configuration Form */}
        <PolicyForm policy={policy} onChange={setPolicy} onSave={handleSave} saving={saving} />
      </div>
    </AppLayout>
  );
}
