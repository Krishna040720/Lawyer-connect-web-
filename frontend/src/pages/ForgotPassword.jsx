import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/auth/forgot-password', { email });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: 420 }}>
      <h2 style={{ fontSize: 26, marginBottom: 8 }}>Forgot your password?</h2>
      <p style={{ color: 'var(--slate)', fontSize: 14.5, marginBottom: 24 }}>
        Enter the email on your account and we'll send you a link to reset your password.
      </p>

      {status === 'sent' ? (
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: 14.5, lineHeight: 1.6 }}>
            If an account with that email exists, a reset link has been sent. Check your inbox
            (and spam folder) — the link is valid for 1 hour.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {status === 'error' && (
            <p style={{ color: '#c0392b', fontSize: 13.5 }}>Something went wrong. Please try again.</p>
          )}
          <button type="submit" className="btn-primary" style={{ padding: '11px 0' }} disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}

      <p style={{ marginTop: 20, fontSize: 14 }}>
        <Link to="/login">Back to log in</Link>
      </p>
    </div>
  );
}
