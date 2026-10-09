"use client";

import React from "react";

export function TrendsCharts() {
  const scoreData = [
    { month: "May", score: 68 },
    { month: "Jun", score: 72 },
    { month: "Jul", score: 75 },
    { month: "Aug", score: 79 },
    { month: "Sep", score: 83 },
    { month: "Oct", score: 87 },
  ];

  const categoryData = [
    { name: "SQL Injection (CWE-89)", count: 18, color: "bg-rose-500", pct: "35%" },
    { name: "Hardcoded Secrets (CWE-798)", count: 14, color: "bg-orange-500", pct: "27%" },
    { name: "Command Injection (CWE-78)", count: 9, color: "bg-amber-500", pct: "18%" },
    { name: "SSRF (CWE-918)", count: 6, color: "bg-sky-500", pct: "12%" },
    { name: "Broken Auth (CWE-287)", count: 4, color: "bg-purple-500", pct: "8%" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Security Score Progression */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Security Score Progression</h3>
            <p className="text-xs text-slate-400">Past 6 months average posture across repos</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
            +19 pts total
          </span>
        </div>

        <div className="flex items-end justify-between h-44 pt-6 px-2 border-b border-slate-800">
          {scoreData.map((item) => (
            <div key={item.month} className="flex flex-col items-center gap-2 flex-1">
              <span className="text-[11px] font-semibold text-sky-400">{item.score}</span>
              <div
                className="w-8 rounded-t bg-gradient-to-t from-sky-950 to-sky-500 transition-all hover:brightness-125"
                style={{ height: `${(item.score / 100) * 110}px` }}
              />
              <span className="text-xs text-slate-400 mt-1">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vulnerabilities by Category */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Vulnerabilities by Category</h3>
            <p className="text-xs text-slate-400">Distribution of detected CWE patterns</p>
          </div>
          <span className="text-xs text-slate-400">51 total</span>
        </div>

        <div className="space-y-3.5 pt-1">
          {categoryData.map((cat) => (
            <div key={cat.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{cat.name}</span>
                <span className="text-slate-400 font-mono">{cat.count} ({cat.pct})</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className={`h-full ${cat.color} rounded-full`} style={{ width: cat.pct }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
