import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '90px 24px', textAlign: 'center', maxWidth: 480 }}>
      <div className="docket-tag" style={{ display: 'inline-block', marginBottom: 18 }}>
        Case No. — 404
      </div>
      <h2 style={{ fontSize: 30, marginBottom: 10 }}>Page not found</h2>
      <p style={{ color: 'var(--slate)', fontSize: 15, lineHeight: 1.6, marginBottom: 26 }}>
        The page you're looking for doesn't exist, or may have moved. Let's get you back on track.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Link to="/" className="btn-primary" style={{ padding: '11px 22px', fontSize: 14 }}>
          Go home
        </Link>
        <Link to="/lawyers" className="btn-outline" style={{ padding: '11px 22px', fontSize: 14 }}>
          Find a Lawyer
        </Link>
      </div>
    </div>
  );
}
