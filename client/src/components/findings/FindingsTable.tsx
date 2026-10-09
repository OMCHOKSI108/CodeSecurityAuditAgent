"use client";

import React from "react";
import Link from "next/link";
import { Finding } from "@/types";
import { SeverityBadge, StatusBadge } from "@/components/ui/Badge";

interface Props {
  findings: Finding[];
}

export function FindingsTable({ findings }: Props) {
  if (findings.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
        No findings match your current filter criteria.
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/70 text-slate-400 text-xs uppercase border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Severity</th>
              <th className="py-3.5 px-4 font-semibold">Vulnerability &amp; CWE</th>
              <th className="py-3.5 px-4 font-semibold">Repository</th>
              <th className="py-3.5 px-4 font-semibold">File &amp; Line</th>
              <th className="py-3.5 px-4 font-semibold">OWASP Category</th>
              <th className="py-3.5 px-4 font-semibold">Status</th>
              <th className="py-3.5 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {findings.map((f) => (
              <tr key={f.id} className="hover:bg-slate-850/50 transition">
                <td className="py-3.5 px-4">
                  <SeverityBadge severity={f.severity} />
                </td>
                <td className="py-3.5 px-4">
                  <Link
                    href={`/findings/${f.id}`}
                    className="font-medium text-slate-100 hover:text-sky-400 transition block"
                  >
                    {f.title}
                  </Link>
                  <span className="text-xs font-mono text-slate-400">{f.cwe_id}</span>
                </td>
                <td className="py-3.5 px-4">
                  <Link
                    href={`/repositories/${f.repository}`}
                    className="font-mono text-xs text-sky-400 hover:underline"
                  >
                    {f.repository}
                  </Link>
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
                  {f.file_path}:{f.line_number}
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-300">
                  {f.owasp_category || "OWASP Top 10"}
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={f.status || "open"} />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    href={`/findings/${f.id}`}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition"
                  >
                    Review Finding →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
