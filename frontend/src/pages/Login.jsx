import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420, padding: '70px 24px' }}>
      <h2 style={{ fontSize: 28, marginBottom: 24 }}>Log in</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <div style={{ color: 'var(--danger)', fontSize: 13.5 }}>{error}</div>}
        <button type="submit" className="btn-primary" style={{ padding: '13px 0' }}>Log in</button>
      </form>
      <p style={{ fontSize: 14, color: 'var(--slate)', marginTop: 18 }}>
        No account? <Link to="/register" style={{ color: 'var(--navy)', fontWeight: 600 }}>Sign up</Link>
      </p>
    </div>
  );
}
