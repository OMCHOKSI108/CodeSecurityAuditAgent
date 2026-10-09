"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";

export function TrendsCharts() {
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  const scoreData = [
    { month: "May", score: 68 },
    { month: "Jun", score: 72 },
    { month: "Jul", score: 75 },
    { month: "Aug", score: 79 },
    { month: "Sep", score: 83 },
    { month: "Oct", score: 87 },
  ];

  const categoryData = [
    {
      name: "SQL Injection (CWE-89)",
      count: 18,
      pct: "35%",
      color: "var(--crit-color)",
      barBg: "rgba(239, 68, 68, 0.8)",
    },
    {
      name: "Hardcoded Secrets (CWE-798)",
      count: 14,
      pct: "27%",
      color: "var(--high-color)",
      barBg: "rgba(249, 115, 22, 0.8)",
    },
    {
      name: "Command Injection (CWE-78)",
      count: 9,
      pct: "18%",
      color: "var(--med-color)",
      barBg: "rgba(234, 179, 8, 0.8)",
    },
    {
      name: "SSRF (CWE-918)",
      count: 6,
      pct: "12%",
      color: "var(--low-color)",
      barBg: "rgba(56, 189, 248, 0.8)",
    },
    {
      name: "Broken Auth (CWE-287)",
      count: 4,
      pct: "8%",
      color: "#a855f7",
      barBg: "rgba(168, 85, 247, 0.8)",
    },
  ];

  return (
    <div className="grid-2">
      {/* Monthly Security Score Progression */}
      <Card
        title="Security Score Progression"
        description="Past 6 months average security posture across repositories"
        actions={
          <span className="badge badge-passed">
            ↑ +19 pts total
          </span>
        }
      >
        <div
          className="flex items-end justify-between h-48 pt-6 px-3 border-b"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          {scoreData.map((item) => {
            const isHovered = hoveredMonth === item.month;
            const barHeight = Math.round((item.score / 100) * 120);

            return (
              <div
                key={item.month}
                className="flex flex-col items-center flex-1 cursor-pointer"
                onMouseEnter={() => setHoveredMonth(item.month)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                <span
                  className="text-xs font-mono font-bold mb-1"
                  style={{
                    color: isHovered ? "var(--accent)" : "var(--text-muted)",
                    transform: isHovered ? "scale(1.15)" : "scale(1)",
                    transition: "all 0.15s ease",
                  }}
                >
                  {item.score}
                </span>

                <div
                  style={{
                    height: `${barHeight}px`,
                    width: "36px",
                    borderRadius: "4px 4px 0 0",
                    background: isHovered
                      ? "var(--accent)"
                      : "linear-gradient(to top, rgba(56, 189, 248, 0.2), rgba(56, 189, 248, 0.7))",
                    border: "1px solid rgba(56, 189, 248, 0.4)",
                    transition: "all 0.2s ease",
                  }}
                />

                <span
                  className="text-xs mt-2 font-medium"
                  style={{
                    color: isHovered ? "var(--text-main)" : "var(--text-dim)",
                  }}
                >
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Vulnerabilities by Category */}
      <Card
        title="Vulnerabilities by Category"
        description="Distribution of detected CWE patterns"
        actions={
          <span className="text-xs text-dim font-mono">
            51 total detected
          </span>
        }
      >
        <div className="flex flex-col gap-3.5 pt-1">
          {categoryData.map((cat) => (
            <div key={cat.name} className="flex flex-col gap-1">
              <div className="flex-between text-xs">
                <span
                  className="font-medium"
                  style={{ color: "var(--text-main)" }}
                >
                  {cat.name}
                </span>
                <span
                  className="font-mono"
                  style={{ color: "var(--text-muted)" }}
                >
                  {cat.count}{" "}
                  <span style={{ color: "var(--text-dim)" }}>
                    ({cat.pct})
                  </span>
                </span>
              </div>

              <div
                style={{
                  height: "8px",
                  width: "100%",
                  background: "var(--bg-surface-elevated)",
                  borderRadius: "999px",
                  overflow: "hidden",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: cat.pct,
                    background: cat.barBg,
                    borderRadius: "999px",
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
