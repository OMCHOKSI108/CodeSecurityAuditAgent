"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import Link from "next/link";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <header className="app-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
              Production Workspace
            </span>
            <span style={{ color: "var(--border-light)" }}>/</span>
            <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-main)" }}>
              Acme Engineering
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", padding: "0.25rem 0.75rem", borderRadius: "100px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--pass-color)" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--pass-color)" }}>Webhook Active</span>
            </div>

            <Link href="/pull-requests" className="btn btn-secondary" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}>
              ⚡ Scans
            </Link>

            <Link href="/login" className="btn btn-outline" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}>
              Switch Org
            </Link>
          </div>
        </header>

        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}
