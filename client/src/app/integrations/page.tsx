"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GitHubIcon, ShieldCheckIcon } from "@/components/ui/Icons";

export default function IntegrationsPage() {
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestWebhook = () => {
    setTestingWebhook(true);
    setTimeout(() => {
      setTestingWebhook(false);
      setTestResult("Webhook ping delivered: HTTP 200 OK (Latency 48ms)");
      setTimeout(() => setTestResult(null), 4000);
    }, 800);
  };

  const webhookDeliveries = [
    { id: "del-994", event: "pull_request.opened", repo: "payment-api", status: 200, time: "42 sec ago", latency: "52ms" },
    { id: "del-993", event: "pull_request.synchronize", repo: "user-service", status: 200, time: "8 min ago", latency: "46ms" },
    { id: "del-992", event: "check_suite.requested", repo: "admin-api", status: 200, time: "22 min ago", latency: "61ms" },
    { id: "del-991", event: "ping", repo: "codesec-org", status: 200, time: "1 hour ago", latency: "38ms" },
  ];

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Integrations &amp; Webhooks</h1>
          <p className="text-xs text-slate-400 mt-1">
            Connect CI/CD pipelines, issue trackers, and alerting infrastructure.
          </p>
        </div>

        {testResult && (
          <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-200 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
            <span>✓ {testResult}</span>
            <button onClick={() => setTestResult(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* GitHub Primary Integration */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
                <GitHubIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">GitHub App</h2>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    CONNECTED
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Installed on organization <span className="font-semibold text-slate-200">Acme Engineering</span> &bull; 4 Repositories Selected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTestWebhook}
                disabled={testingWebhook}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 font-semibold text-xs transition disabled:opacity-50"
              >
                {testingWebhook ? "Sending Ping..." : "Test Webhook"}
              </button>
              <a
                href="https://github.com/settings/apps"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition"
              >
                Configure on GitHub ↗
              </a>
            </div>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-lg border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Target Webhook URL:</span>
              <span className="font-mono text-slate-300">https://api.codesec.ai/api/webhooks/github</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Permissions granted:</span>
              <span className="text-slate-300">Pull Requests (Read &amp; Write), Checks (Read &amp; Write)</span>
            </div>
          </div>
        </div>

        {/* Webhook Delivery Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Recent Webhook Deliveries</h3>
          <div className="space-y-2">
            {webhookDeliveries.map((del) => (
              <div key={del.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    HTTP {del.status}
                  </span>
                  <span className="font-mono text-slate-200">{del.event}</span>
                  <span className="text-slate-400">({del.repo})</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <span className="font-mono">{del.latency}</span>
                  <span>{del.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Connectors */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Available DevSecOps Connectors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-850 flex flex-col justify-between space-y-3">
              <div>
                <span className="font-semibold text-slate-200 block text-sm">Slack Alerts</span>
                <p className="text-slate-400 mt-1">Post instant PR block notifications to #security-alerts.</p>
              </div>
              <button onClick={() => alert("Slack integration configured.")} className="px-3 py-1.5 rounded bg-slate-800 text-sky-400 border border-slate-700 font-medium">Configure</button>
            </div>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-850 flex flex-col justify-between space-y-3">
              <div>
                <span className="font-semibold text-slate-200 block text-sm">Jira Software</span>
                <p className="text-slate-400 mt-1">Automatically create security remediation tickets on blocked PRs.</p>
              </div>
              <button onClick={() => alert("Jira integration coming soon.")} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium">Connect</button>
            </div>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-850 flex flex-col justify-between space-y-3">
              <div>
                <span className="font-semibold text-slate-200 block text-sm">Datadog &amp; SIEM</span>
                <p className="text-slate-400 mt-1">Stream vulnerability telemetry into your security operations center.</p>
              </div>
              <button onClick={() => alert("Datadog integration coming soon.")} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium">Connect</button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
