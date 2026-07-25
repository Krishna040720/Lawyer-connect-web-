import { useEffect, useState } from 'react';
import api from '../api';

export default function Admin() {
  const [status, setStatus] = useState('pending');
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await api.get('/admin/lawyers', { params: { status } });
    setLawyers(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  async function toggleVerify(lawyer) {
    const action = lawyer.verified ? 'unverify' : 'verify';
    await api.put(`/admin/lawyers/${lawyer._id}/${action}`);
    load();
  }

  return (
    <div className="container" style={{ padding: '48px 24px 80px', maxWidth: 820 }}>
      <h2 style={{ fontSize: 28, marginBottom: 6 }}>Lawyer Verification</h2>
      <p style={{ color: 'var(--slate)', fontSize: 14.5, marginBottom: 22 }}>
        Review bar registration details and approve genuine lawyer profiles.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['pending', 'verified', 'all'].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={status === s ? 'btn-primary' : 'btn-outline'}
            style={{ padding: '8px 16px', fontSize: 13, textTransform: 'capitalize' }}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'var(--slate)' }}>Loading…</p>
      ) : lawyers.length === 0 ? (
        <p style={{ color: 'var(--slate)' }}>No lawyers in this list.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {lawyers.map((lawyer) => (
            <div key={lawyer._id} className="card" style={{ padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15.5 }}>
                  {lawyer.name}{' '}
                  {lawyer.verified && <span className="badge-verified" style={{ marginLeft: 6, fontSize: 12 }}>✓ Verified</span>}
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--slate)', marginTop: 2 }}>
                  {lawyer.specialization} · {[lawyer.city, lawyer.state].filter(Boolean).join(', ')} · {lawyer.experienceYears} yrs
                </div>
                <div style={{ fontSize: 13, color: 'var(--slate)', marginTop: 2 }}>
                  Bar Reg. No: {lawyer.barRegistrationNo || 'Not provided'} · {lawyer.email}
                </div>
              </div>
              <button
                onClick={() => toggleVerify(lawyer)}
                className={lawyer.verified ? 'btn-outline' : 'btn-gold'}
                style={{ padding: '9px 18px', fontSize: 13.5, whiteSpace: 'nowrap' }}
              >
                {lawyer.verified ? 'Revoke verification' : 'Approve & verify'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
