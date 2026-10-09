import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CodeSecAudit AI — Enterprise PR Security",
  description: "Automated Pull Request Security Reviewer powered by OWASP RAG",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; line-height: 1.5; }
          header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: #1e293b; border-bottom: 1px solid #334155; }
          header a { color: #38bdf8; text-decoration: none; font-weight: 600; margin-left: 1.5rem; }
          header a:hover { text-decoration: underline; }
          .logo { font-size: 1.25rem; font-weight: bold; color: #f8fafc; }
          main { max-width: 1200px; margin: 2rem auto; padding: 0 1.5rem; min-height: 80vh; }
          .card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
          .btn { display: inline-block; padding: 0.5rem 1.25rem; border-radius: 6px; font-weight: 600; text-decoration: none; cursor: pointer; border: none; }
          .btn-primary { background: #38bdf8; color: #0f172a; }
          .btn-primary:hover { background: #7dd3fc; }
          .badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; font-weight: bold; }
          .badge-approve { background: #065f46; color: #34d399; }
          .badge-warning { background: #78350f; color: #fbbf24; }
          .badge-request-changes { background: #7f1d1d; color: #f87171; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #334155; }
          th { color: #94a3b8; font-size: 0.9rem; text-transform: uppercase; }
          footer { text-align: center; padding: 2rem; color: #64748b; font-size: 0.875rem; border-top: 1px solid #334155; }
        `,
          }}
        />
      </head>
      <body>
        <header>
          <div className="logo">🛡️ CodeSecAudit AI</div>
          <nav>
            <a href="/dashboard">Dashboard</a>
            <a href="/reviews">Reviews</a>
            <a href="/admin/logs">Admin Logs</a>
            <a href="/login">Login</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer>CodeSecAudit AI — Enterprise PR Security & RAG Guidance</footer>
      </body>
    </html>
  );
}
