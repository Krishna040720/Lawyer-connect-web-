import { useEffect, useState } from 'react';
import api from '../api';
import LawyerFeedRow from '../components/LawyerFeedRow';
import { INDIAN_STATES } from '../constants';

const SPECIALIZATIONS = ['Criminal', 'Corporate', 'Family', 'Property', 'Civil', 'Tax', 'Labour & Employment'];

export default function LawyerList() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statesWithLawyers, setStatesWithLawyers] = useState([]);
  const [filters, setFilters] = useState({
    search: '', specialization: '', state: '', city: '', minExperience: '',
  });

  async function fetchLawyers(activeFilters = filters) {
    setLoading(true);
    const params = {};
    Object.entries(activeFilters).forEach(([k, v]) => { if (v) params[k] = v; });
    const { data } = await api.get('/lawyers', { params });
    setLawyers(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchLawyers();
    api.get('/lawyers/meta/states').then(({ data }) => setStatesWithLawyers(data)).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFilterSubmit(e) {
    e.preventDefault();
    fetchLawyers();
  }

  function selectState(state) {
    const next = { ...filters, state: filters.state === state ? '' : state };
    setFilters(next);
    fetchLawyers(next);
  }

  return (
    <div className="container" style={{ padding: '48px 24px 80px', maxWidth: 820 }}>
      <h2 style={{ fontSize: 30, marginBottom: 6 }}>Find a Lawyer</h2>
      <p style={{ color: 'var(--slate)', fontSize: 14.5, marginBottom: 24 }}>
        Browse verified lawyers from across India, or filter by specialization and experience.
      </p>

      {/* State browser - quick chips so clients can browse without typing */}
      {statesWithLawyers.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--slate)', marginBottom: 8 }}>
            Browse by state
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {statesWithLawyers.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => selectState(s)}
                className={filters.state === s ? 'btn-primary' : 'btn-outline'}
                style={{ padding: '6px 14px', fontSize: 13 }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={handleFilterSubmit}
        className="card"
        style={{ padding: 18, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 10, marginBottom: 28, alignItems: 'center' }}
      >
        <input
          placeholder="Search by name, keyword..."
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
        />
        <select value={filters.specialization} onChange={(e) => setFilters((f) => ({ ...f, specialization: e.target.value }))}>
          <option value="">All specializations</option>
          {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.state} onChange={(e) => setFilters((f) => ({ ...f, state: e.target.value }))}>
          <option value="">All states</option>
          {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="submit" className="btn-primary" style={{ padding: '11px 20px' }}>Search</button>
      </form>

      {loading ? (
        <p style={{ color: 'var(--slate)' }}>Loading lawyers…</p>
      ) : lawyers.length === 0 ? (
        <p style={{ color: 'var(--slate)' }}>No lawyers match these filters yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {lawyers.map((lawyer) => <LawyerFeedRow key={lawyer._id} lawyer={lawyer} />)}
        </div>
      )}
    </div>
  );
}
