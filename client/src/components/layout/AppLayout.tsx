"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import Link from "next/link";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="app-main flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="font-semibold text-slate-400 uppercase tracking-wider">
              Workspace
            </span>
            <span className="text-slate-600">/</span>
            <span className="font-bold text-slate-100">
              Acme Engineering
            </span>
            <span className="text-slate-600">/</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-sky-400 border border-slate-700">
              Production Gate
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-full text-xs text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Webhook Live</span>
            </div>

            <Link
              href="/pull-requests"
              className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition"
            >
              Audits
            </Link>

            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium text-xs transition"
            >
              Sign Out
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
