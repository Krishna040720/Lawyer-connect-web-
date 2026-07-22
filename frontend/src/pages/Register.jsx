import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SPECIALIZATIONS = ['Criminal', 'Corporate', 'Family', 'Property', 'Civil', 'Tax', 'Labour & Employment'];

export default function Register() {
  const [role, setRole] = useState('client');
  const [form, setForm] = useState({
    name: '', email: '', password: '', mobile: '',
    specialization: '', experienceYears: '', barRegistrationNo: '', city: '', fee: '', bio: '',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await register({ ...form, role });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <div className="container" style={{ maxWidth: 480, padding: '60px 24px 80px' }}>
      <h2 style={{ fontSize: 28, marginBottom: 8 }}>Create an account</h2>
      <p style={{ fontSize: 14, color: 'var(--slate)', marginBottom: 20 }}>
        Sign up as a client to find lawyers, or as a lawyer to build your profile.
      </p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
        {['client', 'lawyer'].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={role === r ? 'btn-primary' : 'btn-outline'}
            style={{ flex: 1, padding: '11px 0', textTransform: 'capitalize' }}
          >
            I'm a {r}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input placeholder="Full name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => update('password', e.target.value)} required />
        <input placeholder="Mobile number" value={form.mobile} onChange={(e) => update('mobile', e.target.value)} required />

        {role === 'lawyer' && (
          <>
            <select value={form.specialization} onChange={(e) => update('specialization', e.target.value)} required>
              <option value="">Select specialization</option>
              {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="number" min="0" placeholder="Years of experience" value={form.experienceYears} onChange={(e) => update('experienceYears', e.target.value)} required />
            <input placeholder="Bar registration number" value={form.barRegistrationNo} onChange={(e) => update('barRegistrationNo', e.target.value)} required />
            <input placeholder="City" value={form.city} onChange={(e) => update('city', e.target.value)} required />
            <input type="number" min="0" placeholder="Consultation fee (₹)" value={form.fee} onChange={(e) => update('fee', e.target.value)} />
            <textarea placeholder="Short bio" rows={3} value={form.bio} onChange={(e) => update('bio', e.target.value)} />
          </>
        )}

        {error && <div style={{ color: 'var(--danger)', fontSize: 13.5 }}>{error}</div>}
        <button type="submit" className="btn-primary" style={{ padding: '13px 0' }}>Create account</button>
      </form>

      <p style={{ fontSize: 14, color: 'var(--slate)', marginTop: 18 }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--navy)', fontWeight: 600 }}>Log in</Link>
      </p>
    </div>
  );
}
