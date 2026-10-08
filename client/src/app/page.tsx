export default function HomePage() {
  return (
    <div>
      <section style={{ textAlign: "center", padding: "4rem 1rem" }}>
        <h1 style={{ fontSize: "2.75rem", marginBottom: "1rem", color: "#38bdf8" }}>
          Enterprise AI Pull Request Reviewer
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#94a3b8", maxWidth: "700px", margin: "0 auto 2rem" }}>
          Detect vulnerabilities, calculate risk scores, suggest OWASP-backed fixes, and prevent security debt before code merges.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <a href="/login" className="btn btn-primary">Get Started with GitHub</a>
          <a href="/dashboard" className="btn" style={{ background: "#334155", color: "#f8fafc" }}>View Dashboard</a>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        <div className="card">
          <h3 style={{ marginBottom: "0.5rem", color: "#38bdf8" }}>⚡ Asynchronous GitHub Reviews</h3>
          <p style={{ color: "#94a3b8" }}>Receives webhooks, enforces signature checks, and enqueues bounded worker jobs with 202 responses.</p>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: "0.5rem", color: "#38bdf8" }}>🧠 Private RAG Guidance</h3>
          <p style={{ color: "#94a3b8" }}>Embeds and retrieves OWASP cheat sheet guidance from an isolated private Qdrant vector store.</p>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: "0.5rem", color: "#38bdf8" }}>🔒 Secure Multi-Tenancy</h3>
          <p style={{ color: "#94a3b8" }}>PostgreSQL persistence with tenant boundaries, opaque Redis sessions, and admin audit logging.</p>
        </div>
      </div>
    </div>
  );
}
