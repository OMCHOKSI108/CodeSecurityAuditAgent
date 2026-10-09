"use client";

import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { LogEntry } from "@/types";
import { fetchLogs } from "@/lib/api";

export default function AdminLogsPage() {
  const [activeService, setActiveService] = useState<"main-server" | "client-server" | "rag-server">("main-server");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const loadLogs = async (srv: "main-server" | "client-server" | "rag-server") => {
    setLoading(true);
    const data = await fetchLogs(srv, 50);
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLogs(activeService);
  }, [activeService]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">System Log Streams</h1>
            <p className="text-xs text-slate-400 mt-1">
              Live Redis Streams telemetry with automatic secret redaction.
            </p>
          </div>
          <button
            onClick={() => loadLogs(activeService)}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 text-xs font-semibold transition"
          >
            🔄 Refresh Stream
          </button>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl w-fit">
          {(["main-server", "client-server", "rag-server"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setActiveService(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                activeService === s
                  ? "bg-sky-500 text-slate-950 font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-200">
              Redis Stream: <code className="font-mono text-sky-400">log:{activeService}</code>
            </h3>
            <span className="text-xs text-slate-500">{logs.length} entries tailing</span>
          </div>

          {loading ? (
            <p className="text-xs text-slate-500 py-8 text-center">Tailing log stream...</p>
          ) : logs.length === 0 ? (
            <div className="text-xs text-slate-500 py-8 text-center bg-slate-950 rounded-lg border border-slate-850">
              No recent log entries in stream <code className="font-mono text-slate-400">log:{activeService}</code>. System operating normally.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950/70 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Level</th>
                    <th className="py-2.5 px-3">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {logs.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-850/40">
                      <td className="py-2 px-3 text-slate-500 whitespace-nowrap">{l.timestamp}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`font-bold ${
                            l.level === "ERROR"
                              ? "text-rose-400"
                              : l.level === "WARN"
                              ? "text-amber-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {l.level}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-300 break-all">{l.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
