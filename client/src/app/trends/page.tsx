"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TrendsCharts } from "@/components/trends/TrendsCharts";
import { TrendingUpIcon, ShieldCheckIcon, AlertTriangleIcon } from "@/components/ui/Icons";

export default function TrendsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Security Trends &amp; Posture</h1>
          <p className="text-xs text-slate-400 mt-1">
            Quarterly vulnerability metrics, MTTR performance, and gate enforcement history.
          </p>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Security Score</span>
              <span className="text-emerald-400 font-semibold">+17 pts</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-100">87</span>
              <span className="text-xs text-slate-500">from 70</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">Q3 → Q4 Steady Improvement</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Critical Reduction</span>
              <span className="text-emerald-400 font-semibold">↓ 42%</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-400">2 Active</span>
              <span className="text-xs text-slate-500">vs 8 prev</span>
            </div>
            <span className="text-[11px] text-slate-400">Policy gate blocking regressions</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Critical MTTR</span>
              <span className="text-sky-400 font-semibold">-58%</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-sky-400">3.2 hrs</span>
            </div>
            <span className="text-[11px] text-slate-400">Mean time to remediate</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Gate Enforcement</span>
              <span className="text-emerald-400 font-semibold">Strict</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-400">98.4%</span>
            </div>
            <span className="text-[11px] text-slate-400">474 / 482 PRs gated safely</span>
          </div>
        </div>

        {/* Visual Charts */}
        <TrendsCharts />

        {/* PR Gate Verdict Distribution & Top Remediated CWEs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Pull Request Gate Verdicts (30 Days)</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <span className="text-xs text-emerald-400 block font-semibold">Passed &amp; Merged</span>
                <span className="text-xl font-bold text-slate-100">396 (82.1%)</span>
              </div>
              <div className="flex-1 bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <span className="text-xs text-rose-400 block font-semibold">Blocked by Policy</span>
                <span className="text-xl font-bold text-slate-100">86 (17.9%)</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every blocked pull request required developer remediation or security lead sign-off before merging, preventing 86 potential CVE vulnerabilities from reaching production branches.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Top Remediated CWEs This Quarter</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-850">
                <span className="font-mono text-slate-200">CWE-89: SQL Injection</span>
                <span className="text-emerald-400 font-medium">38 resolved</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-850">
                <span className="font-mono text-slate-200">CWE-798: Hardcoded Credentials</span>
                <span className="text-emerald-400 font-medium">27 resolved</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-850">
                <span className="font-mono text-slate-200">CWE-78: OS Command Injection</span>
                <span className="text-emerald-400 font-medium">19 resolved</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-850">
                <span className="font-mono text-slate-200">CWE-918: Server-Side Request Forgery</span>
                <span className="text-emerald-400 font-medium">14 resolved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
