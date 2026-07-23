import { Link } from 'react-router-dom';

export default function Home() {
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
        </div>
      </section>

      <section className="container" style={{ padding: '60px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {[
          { label: '01 — Search', text: 'Filter by specialization, city, and years of experience to shortlist the right fit.' },
          { label: '02 — Compare', text: 'Read client ratings and reviews before you decide who to reach out to.' },
          { label: '03 — Chat', text: 'Message the lawyer directly and get a response in real time.' },
        ].map((step) => (
          <div key={step.label} className="card" style={{ padding: 24 }}>
            <div className="docket-tag" style={{ marginBottom: 10 }}>{step.label}</div>
            <p style={{ fontSize: 14.5, color: 'var(--slate)', lineHeight: 1.55, margin: 0 }}>{step.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
