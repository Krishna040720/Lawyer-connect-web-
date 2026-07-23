import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import RatingStars from '../components/RatingStars';
import { useAuth } from '../context/AuthContext';

export default function LawyerProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [lawyer, setLawyer] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [newStars, setNewStars] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    const [{ data: lawyerData }, { data: ratingData }] = await Promise.all([
      api.get(`/lawyers/${id}`),
      api.get(`/ratings/${id}`),
    ]);
    setLawyer(lawyerData);
    setRatings(ratingData);
  }

  useEffect(() => { loadData(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function submitReview(e) {
    e.preventDefault();
    if (!newStars) return;
    setSubmitting(true);
    try {
      await api.post(`/ratings/${id}`, { stars: newStars, review: newReview });
      setNewStars(0);
      setNewReview('');
      await loadData();
    } finally {
      setSubmitting(false);
    }
  }

  if (!lawyer) return <div className="container" style={{ padding: 60 }}>Loading…</div>;

  return (
    <div className="container" style={{ padding: '48px 24px 80px', maxWidth: 780 }}>
      <div className="card" style={{ padding: 30 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: 28 }}>{lawyer.name}</h2>
            <div style={{ color: 'var(--slate)', marginTop: 4 }}>
              {lawyer.specialization} · {lawyer.city}
            </div>
          </div>
          {lawyer.verified && <span className="badge-verified">✓ Verified</span>}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
          <span className="docket-tag">{lawyer.experienceYears} yrs experience</span>
          <span className="docket-tag">Bar Reg. {lawyer.barRegistrationNo}</span>
          {lawyer.fee ? <span className="docket-tag">₹{lawyer.fee} / consult</span> : null}
        </div>

        <p style={{ marginTop: 18, lineHeight: 1.6, color: 'var(--ink)' }}>{lawyer.bio || 'No bio provided yet.'}</p>

        <div style={{ marginTop: 14 }}>
          <RatingStars value={lawyer.avgRating} count={lawyer.ratingCount} />
        </div>

        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          {user && user.role === 'client' && (
            <button className="btn-primary" style={{ padding: '12px 24px' }} onClick={() => navigate(`/chat/${lawyer._id}`)}>
              Message {lawyer.name.split(' ')[0]}
            </button>
          )}
          {!user && (
            <button className="btn-primary" style={{ padding: '12px 24px' }} onClick={() => navigate('/login')}>
              Log in to message
            </button>
          )}
        </div>
      </div>

      {user && user.role === 'client' && (
        <div className="card" style={{ padding: 24, marginTop: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 12 }}>Leave a review</h3>
          <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <RatingStars value={newStars} interactive onChange={setNewStars} />
            <textarea
              placeholder="Share your experience..."
              rows={3}
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
            />
            <button type="submit" disabled={submitting || !newStars} className="btn-gold" style={{ padding: '11px 0', width: 160 }}>
              {submitting ? 'Submitting…' : 'Submit review'}
            </button>
          </form>
        </div>
      )}

      <div style={{ marginTop: 30 }}>
        <h3 style={{ fontSize: 18, marginBottom: 14 }}>Client Reviews ({ratings.length})</h3>
        {ratings.length === 0 && <p style={{ color: 'var(--slate)' }}>No reviews yet.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {ratings.map((r) => (
            <div key={r._id} className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 14.5 }}>{r.client?.name || 'Client'}</strong>
                <RatingStars value={r.stars} />
              </div>
              {r.review && <p style={{ marginTop: 8, fontSize: 14, color: 'var(--ink)' }}>{r.review}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
