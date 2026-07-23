import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';

export default function LawyerCard({ lawyer }) {
  return (
    <div className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: 19 }}>{lawyer.name}</h3>
          <div style={{ fontSize: 13.5, color: 'var(--slate)', marginTop: 2 }}>
            {lawyer.specialization || 'General Practice'} · {lawyer.city || 'Location not set'}
          </div>
        </div>
        {lawyer.verified && <span className="badge-verified">✓ Verified</span>}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span className="docket-tag">{lawyer.experienceYears || 0} yrs experience</span>
        {lawyer.fee ? <span className="docket-tag">₹{lawyer.fee} / consult</span> : null}
      </div>

      <p style={{ fontSize: 14, color: 'var(--ink)', margin: 0, lineHeight: 1.5, minHeight: 42 }}>
        {(lawyer.bio || 'No bio provided yet.').slice(0, 110)}
        {lawyer.bio && lawyer.bio.length > 110 ? '…' : ''}
      </p>

      <RatingStars value={lawyer.avgRating} count={lawyer.ratingCount} />

      <Link to={`/lawyers/${lawyer._id}`} className="btn-primary" style={{ textAlign: 'center', marginTop: 6, display: 'block' }}>
        View Profile
      </Link>
    </div>
  );
}
