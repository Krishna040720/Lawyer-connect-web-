import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    function fetchUnread() {
      api.get('/messages/meta/unread-total').then(({ data }) => setUnreadCount(data.count)).catch(() => {});
    }
    fetchUnread();
    const interval = setInterval(fetchUnread, 20000); // poll every 20s
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, location.pathname]);

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
              <Link to="/dashboard" style={{ fontSize: 14, fontWeight: 500, color: 'var(--slate)', display: 'flex', alignItems: 'center', gap: 6 }}>
                Dashboard
                {unreadCount > 0 && (
                  <span
                    style={{
                      background: '#c0392b', color: '#fff', borderRadius: 999,
                      fontSize: 11, fontWeight: 700, padding: '1px 7px', lineHeight: 1.5,
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" style={{ fontSize: 14, fontWeight: 500, color: 'var(--slate)' }}>
                  Admin
                </Link>
              )}
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
