import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

export default function LawyerFeedRow({ lawyer }) {
  return (
    <div
      className="card"
      style={{
        padding: 22,
        display: 'flex',
        gap: 18,
        alignItems: 'flex-start',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
          background: 'var(--navy)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 700, letterSpacing: 0.5,
        }}
      >
        {initials(lawyer.name)}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h3 style={{ fontSize: 18, marginBottom: 2 }}>
              {lawyer.name}
              {lawyer.verified && (
                <span className="badge-verified" style={{ marginLeft: 8, fontSize: 12 }}>✓ Verified</span>
              )}
            </h3>
            <div style={{ fontSize: 13.5, color: 'var(--slate)' }}>
              {lawyer.specialization || 'General Practice'} Lawyer
              {lawyer.experienceYears ? ` · ${lawyer.experienceYears} yrs experience` : ''}
            </div>
            <div style={{ fontSize: 13, color: 'var(--slate)', marginTop: 2 }}>
              {[lawyer.city, lawyer.state].filter(Boolean).join(', ') || 'Location not set'}
            </div>
          </div>

          <Link
            to={`/lawyers/${lawyer._id}`}
            className="btn-primary"
            style={{ padding: '9px 18px', fontSize: 13.5, whiteSpace: 'nowrap' }}
          >
            View Profile
          </Link>
        </div>

        <p style={{ fontSize: 14, color: 'var(--ink)', margin: '12px 0 10px', lineHeight: 1.55 }}>
          {(lawyer.bio || 'No bio provided yet.').slice(0, 220)}
          {lawyer.bio && lawyer.bio.length > 220 ? '…' : ''}
        </p>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <RatingStars value={lawyer.avgRating} count={lawyer.ratingCount} />
          {lawyer.fee ? (
            <span className="docket-tag">₹{lawyer.fee} / consult</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
