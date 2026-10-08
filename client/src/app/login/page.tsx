export default function LoginPage() {
  return (
    <div style={{ maxWidth: "450px", margin: "4rem auto", textAlign: "center" }}>
      <div className="card">
        <h2 style={{ marginBottom: "1rem", color: "#38bdf8" }}>Sign In to CodeSecAudit</h2>
        <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
          Authenticate securely via GitHub OAuth with PKCE and state protection.
        </p>
        <a
          href="/api/auth/github/start"
          className="btn btn-primary"
          style={{ width: "100%", padding: "0.75rem", fontSize: "1rem" }}
        >
          Continue with GitHub
        </a>
        <p style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "#64748b" }}>
          Your browser never receives or stores raw GitHub API credentials.
        </p>
      </div>
    </div>
  );
}
