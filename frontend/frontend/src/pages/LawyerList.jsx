import { useEffect, useState } from 'react';
import api from '../api';
import LawyerCard from '../components/LawyerCard';

const SPECIALIZATIONS = ['Criminal', 'Corporate', 'Family', 'Property', 'Civil', 'Tax', 'Labour & Employment'];

export default function LawyerList() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', specialization: '', city: '', minExperience: '' });

  async function fetchLawyers() {
    setLoading(true);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    const { data } = await api.get('/lawyers', { params });
    setLawyers(data);
    setLoading(false);
  }

  useEffect(() => { fetchLawyers(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleFilterSubmit(e) {
    e.preventDefault();
    fetchLawyers();
  }

  return (
    <div className="container" style={{ padding: '48px 24px 80px' }}>
      <h2 style={{ fontSize: 30, marginBottom: 6 }}>Find a Lawyer</h2>
      <p style={{ color: 'var(--slate)', fontSize: 14.5, marginBottom: 28 }}>
        Filter by specialization, city, and experience.
      </p>

      <form onSubmit={handleFilterSubmit} className="card" style={{ padding: 20, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 12, marginBottom: 32, alignItems: 'center' }}>
        <input
          placeholder="Search by name, keyword..."
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
        />
        <select value={filters.specialization} onChange={(e) => setFilters((f) => ({ ...f, specialization: e.target.value }))}>
          <option value="">All specializations</option>
          {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          placeholder="City"
          value={filters.city}
          onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
        />
        <input
          type="number" min="0"
          placeholder="Min. years exp."
          value={filters.minExperience}
          onChange={(e) => setFilters((f) => ({ ...f, minExperience: e.target.value }))}
        />
        <button type="submit" className="btn-primary" style={{ padding: '11px 20px' }}>Search</button>
      </form>

      {loading ? (
        <p style={{ color: 'var(--slate)' }}>Loading lawyers…</p>
      ) : lawyers.length === 0 ? (
        <p style={{ color: 'var(--slate)' }}>No lawyers match these filters yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {lawyers.map((lawyer) => <LawyerCard key={lawyer._id} lawyer={lawyer} />)}
        </div>
      )}
    </div>
  );
}
