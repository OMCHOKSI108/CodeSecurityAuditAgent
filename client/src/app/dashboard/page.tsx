"use client";

import { useEffect, useState } from "react";
import { ReviewRecord, UserProfile } from "@/types";
import { fetchMe, fetchReviews } from "@/lib/api";

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [u, r] = await Promise.all([fetchMe(), fetchReviews()]);
      setUser(u);
      setReviews(r);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const totalReviews = reviews.length;
  const approved = reviews.filter((r) => r.verdict === "APPROVE").length;
  const warnings = reviews.filter((r) => r.verdict === "WARNING").length;
  const changes = reviews.filter((r) => r.verdict === "REQUEST_CHANGES").length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2>Organization: {user?.organization_name || "Personal Org"}</h2>
          <p style={{ color: "#94a3b8" }}>Welcome back, {user?.username || "Developer"}</p>
        </div>
        <a href="https://github.com/apps/codesecaudit-ai/installations/new" target="_blank" className="btn btn-primary">
          + Install GitHub App
        </a>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="card"><h3>Total Reviews</h3><p style={{ fontSize: "2rem", fontWeight: "bold" }}>{totalReviews}</p></div>
        <div className="card"><h3>Approved</h3><p style={{ fontSize: "2rem", fontWeight: "bold", color: "#34d399" }}>{approved}</p></div>
        <div className="card"><h3>Warnings</h3><p style={{ fontSize: "2rem", fontWeight: "bold", color: "#fbbf24" }}>{warnings}</p></div>
        <div className="card"><h3>Changes Requested</h3><p style={{ fontSize: "2rem", fontWeight: "bold", color: "#f87171" }}>{changes}</p></div>
      </div>

      <div className="card">
        <h3>Recent Reviews</h3>
        {reviews.length === 0 ? (
          <p style={{ color: "#94a3b8", marginTop: "1rem" }}>No reviews found for this organization yet.</p>
        ) : (
          <table>
            <thead>
              <tr><th>PR #</th><th>Verdict</th><th>Risk Score</th><th>Commit</th><th>Date</th></tr>
            </thead>
            <tbody>
              {reviews.slice(0, 5).map((r) => (
                <tr key={r.id}>
                  <td><a href={`/reviews?id=${r.id}`} style={{ color: "#38bdf8" }}>#{r.pr_number}</a></td>
                  <td><span className={`badge badge-${r.verdict.toLowerCase().replace("_", "-")}`}>{r.verdict}</span></td>
                  <td>{r.risk_score} / 100</td>
                  <td><code>{r.commit_sha.substring(0, 7)}</code></td>
                  <td>{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
