"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SettingsIcon } from "@/components/ui/Icons";

export default function SettingsPage() {
  const [orgName, setOrgName] = useState("Acme Engineering");
  const [contactEmail, setContactEmail] = useState("security@acme.corp");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage("Settings saved successfully.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Organization Settings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your workspace configuration, security keys, and alerts.
          </p>
        </div>

        {toastMessage && (
          <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-200 px-4 py-2.5 rounded-lg text-sm flex items-center justify-between">
            <span>✓ {toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Workspace Profile */}
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-100">Workspace Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Security Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition"
            >
              Save Profile
            </button>
          </div>
        </form>

        {/* Notification Preferences */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-100">Alert Notifications</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
              <span>Instant email alert when a PR is blocked by security gate</span>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded accent-sky-500"
              />
            </label>
            <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
              <span>Daily executive digest of open vulnerabilities</span>
              <input
                type="checkbox"
                checked={dailyDigest}
                onChange={(e) => setDailyDigest(e.target.checked)}
                className="w-4 h-4 rounded accent-sky-500"
              />
            </label>
          </div>
        </div>

        {/* API Tokens */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-100">API Access Tokens</h2>
              <p className="text-xs text-slate-400">Tokens for CI/CD pipelines and external CLI tools</p>
            </div>
            <button
              type="button"
              onClick={() => alert("Created token: csa_live_9f81a7b8e4c2")}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 text-xs font-medium"
            >
              + Generate Token
            </button>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="font-mono text-slate-200 block">csa_live_********************481b</span>
              <span className="text-slate-500 text-[11px]">Created Oct 8, 2026 &bull; Full Audit Permissions</span>
            </div>
            <span className="text-emerald-400 text-xs font-semibold">Active</span>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-slate-900 border border-rose-900/40 rounded-xl p-6 space-y-3">
          <h2 className="text-base font-semibold text-rose-400">Danger Zone</h2>
          <p className="text-xs text-slate-400">
            Flushing the audit cache will force CodeSecAudit to perform full semantic re-indexing on all repositories.
          </p>
          <button
            onClick={() => alert("Cache purged successfully.")}
            className="px-3.5 py-2 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-semibold"
          >
            Purge Semantic Audit Cache
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
