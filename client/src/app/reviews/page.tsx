"use client";

import { useEffect, useState } from "react";
import { ReviewRecord } from "@/types";
import { fetchReviewDetail, fetchReviews } from "@/lib/api";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [selected, setSelected] = useState<ReviewRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchReviews();
      setReviews(data);
      if (data.length > 0) {
        const detail = await fetchReviewDetail(data[0].id);
        setSelected(detail || data[0]);
      }
      setLoading(false);
    }
    load();
  }, []);

  const selectReview = async (id: string) => {
    const detail = await fetchReviewDetail(id);
    if (detail) setSelected(detail);
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
      <div className="card">
        <h3>Pull Request Reviews</h3>
        <table>
          <thead>
            <tr><th>PR #</th><th>Verdict</th><th>Risk</th><th>Action</th></tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td>#{r.pr_number}</td>
                <td><span className={`badge badge-${r.verdict.toLowerCase().replace("_", "-")}`}>{r.verdict}</span></td>
                <td>{r.risk_score}/100</td>
                <td><button onClick={() => selectReview(r.id)} className="btn btn-primary" style={{ padding: "0.2rem 0.5rem" }}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        {selected ? (
          <div>
            <h3>Review Details: PR #{selected.pr_number}</h3>
            <p style={{ color: "#94a3b8", margin: "0.5rem 0" }}>Summary: {selected.summary}</p>
            <p>Verdict: <span className={`badge badge-${selected.verdict.toLowerCase().replace("_", "-")}`}>{selected.verdict}</span></p>
            <p>Risk Score: {selected.risk_score} / 100</p>
            <p>RAG Guidance: {selected.guidance_available ? "✅ Available" : "⚠️ Rule-only"}</p>
            
            <h4 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>Security Findings ({selected.findings?.length || 0})</h4>
            {selected.findings?.map((f) => (
              <div key={f.id} style={{ background: "#0f172a", padding: "1rem", borderRadius: "6px", marginBottom: "0.75rem", borderLeft: "4px solid #ef4444" }}>
                <strong>[{f.cwe_id}] {f.title}</strong> ({f.severity})
                <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{f.file_path}:{f.line_number}</p>
                {f.code_snippet && <pre style={{ background: "#1e293b", padding: "0.5rem", marginTop: "0.5rem", borderRadius: "4px", overflowX: "auto" }}><code>{f.code_snippet}</code></pre>}
                {f.suggested_fix && <p style={{ marginTop: "0.5rem", color: "#38bdf8" }}>💡 {f.suggested_fix}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#94a3b8" }}>Select a review to inspect findings</p>
        )}
      </div>
    </div>
  );
}
