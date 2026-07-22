import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--paper)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700, color: 'var(--navy)' }}>
            Lawyer<span style={{ color: 'var(--gold)' }}>Connect</span>
          </span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link to="/lawyers" style={{ fontSize: 14, fontWeight: 500, color: 'var(--slate)' }}>
            Find a Lawyer
          </Link>

          {!user && (
            <>
              <Link to="/login" style={{ fontSize: 14, fontWeight: 500, color: 'var(--slate)' }}>
                Log in
              </Link>
              <Link to="/register" className="btn-gold" style={{ display: 'inline-block', padding: '9px 18px', fontSize: 14 }}>
                Sign up
              </Link>
            </>
          )}

          {user && (
            <>
              <Link to="/dashboard" style={{ fontSize: 14, fontWeight: 500, color: 'var(--slate)' }}>
                Dashboard
              </Link>
              <span className="docket-tag">{user.role}</span>
              <button onClick={handleLogout} className="btn-outline" style={{ padding: '8px 16px', fontSize: 13 }}>
                Log out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
