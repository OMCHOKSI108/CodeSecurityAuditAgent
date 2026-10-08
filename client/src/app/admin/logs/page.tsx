"use client";

import { useEffect, useState } from "react";
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
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2>🛡️ Admin Log Streams (Redis Streams)</h2>
        <button onClick={() => loadLogs(activeService)} className="btn btn-primary">🔄 Refresh</button>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {(["main-server", "client-server", "rag-server"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setActiveService(s)}
            className="btn"
            style={{
              background: activeService === s ? "#38bdf8" : "#334155",
              color: activeService === s ? "#0f172a" : "#f8fafc",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="card" style={{ overflowX: "auto" }}>
        <h3>Log Stream: <code>log:{activeService}</code></h3>
        {loading ? (
          <p style={{ color: "#94a3b8", marginTop: "1rem" }}>Tailing log stream...</p>
        ) : logs.length === 0 ? (
          <p style={{ color: "#94a3b8", marginTop: "1rem" }}>No log entries in Redis stream or unauthorized.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Timestamp</th><th>Level</th><th>Message</th></tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td style={{ whiteSpace: "nowrap", color: "#94a3b8", fontSize: "0.85rem" }}>{l.timestamp}</td>
                  <td>
                    <span style={{ color: l.level === "ERROR" ? "#f87171" : l.level === "WARN" ? "#fbbf24" : "#34d399", fontWeight: "bold" }}>
                      {l.level}
                    </span>
                  </td>
                  <td><code>{l.message}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
