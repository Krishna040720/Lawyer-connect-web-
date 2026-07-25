import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import RatingStars from '../components/RatingStars';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.get('/lawyers/meta/stats').then(({ data }) => setStats(data)).catch(() => {});
    api.get('/ratings/featured/top').then(({ data }) => setTestimonials(data)).catch(() => {});
  }, []);

  return (
    <div>
      <section style={{ background: 'var(--navy)', color: 'var(--cream)', padding: '90px 0 70px' }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <div className="docket-tag" style={{ color: 'var(--gold-light)', borderColor: 'var(--gold)', marginBottom: 18 }}>
            Case No. — Find Your Counsel
          </div>
          <h1 style={{ color: 'var(--cream)', fontSize: 44, lineHeight: 1.15 }}>
            Verified lawyers, real experience, straight to your chat.
          </h1>
          <p style={{ fontSize: 17, color: '#c7cede', marginTop: 18, lineHeight: 1.6 }}>
            Browse profiles by specialization and years of practice, read ratings from
            real clients, and message a lawyer directly — no waiting rooms, no phone
            trees.
          </p>
          <div style={{ marginTop: 30, display: 'flex', gap: 14 }}>
            <Link to="/lawyers" className="btn-gold" style={{ padding: '14px 26px', fontSize: 15 }}>
              Browse Lawyers
            </Link>
            <Link to="/register" className="btn-outline" style={{ padding: '14px 26px', fontSize: 15, borderColor: 'var(--cream)', color: 'var(--cream)' }}>
              Join as a Lawyer
            </Link>
          </div>

          {stats && (stats.lawyerCount > 0) && (
            <div style={{ display: 'flex', gap: 36, marginTop: 46, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--gold-light)' }}>{stats.lawyerCount}</div>
                <div style={{ fontSize: 13, color: '#c7cede' }}>Lawyers on the platform</div>
              </div>
              <div>
                <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--gold-light)' }}>{stats.verifiedCount}</div>
                <div style={{ fontSize: 13, color: '#c7cede' }}>Verified profiles</div>
              </div>
              <div>
                <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--gold-light)' }}>{stats.stateCount}</div>
                <div style={{ fontSize: 13, color: '#c7cede' }}>States covered</div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="container" style={{ padding: '60px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {[
          { label: '01 — Search', text: 'Filter by specialization, city, state, and years of experience to shortlist the right fit.' },
          { label: '02 — Compare', text: 'Read client ratings and written reviews before you decide who to reach out to.' },
          { label: '03 — Chat', text: 'Message the lawyer directly and get a response in real time.' },
        ].map((step) => (
          <div key={step.label} className="card" style={{ padding: 24 }}>
            <div className="docket-tag" style={{ marginBottom: 10 }}>{step.label}</div>
            <p style={{ fontSize: 14.5, color: 'var(--slate)', lineHeight: 1.55, margin: 0 }}>{step.text}</p>
          </div>
        ))}
      </section>

      {testimonials.length > 0 && (
        <section className="container" style={{ padding: '10px 24px 70px' }}>
          <h2 style={{ fontSize: 24, marginBottom: 24, textAlign: 'center' }}>What clients are saying</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {testimonials.map((t) => (
              <div key={t._id} className="card" style={{ padding: 22 }}>
                <RatingStars value={t.stars} />
                <p style={{ fontSize: 14.5, color: 'var(--ink)', lineHeight: 1.55, margin: '12px 0' }}>
                  "{t.review}"
                </p>
                <div style={{ fontSize: 13, color: 'var(--slate)' }}>
                  — {t.client?.name || 'Client'}, on {t.lawyer?.name || 'a lawyer'}
                  {t.lawyer?.specialization ? ` (${t.lawyer.specialization})` : ''}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
