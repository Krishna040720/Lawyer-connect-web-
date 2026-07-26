import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('idle'); // idle | saving | error
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setStatus('saving');
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      navigate('/login');
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.message || 'This link is invalid or has expired.');
    }
  }

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: 420 }}>
      <h2 style={{ fontSize: 26, marginBottom: 8 }}>Set a new password</h2>
      <p style={{ color: 'var(--slate)', fontSize: 14.5, marginBottom: 24 }}>
        Choose a new password for your account.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        {error && <p style={{ color: '#c0392b', fontSize: 13.5 }}>{error}</p>}
        <button type="submit" className="btn-primary" style={{ padding: '11px 0' }} disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : 'Reset password'}
        </button>
      </form>

      <p style={{ marginTop: 20, fontSize: 14 }}>
        <Link to="/login">Back to log in</Link>
      </p>
    </div>
  );
}
