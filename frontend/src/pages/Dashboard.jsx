import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [profile, setProfile] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/messages').then(({ data }) => setConversations(data));
    if (user.role === 'lawyer') {
      setProfile({
        specialization: user.specialization || '',
        experienceYears: user.experienceYears || 0,
        city: user.city || '',
        fee: user.fee || '',
        bio: user.bio || '',
        mobile: user.mobile || '',
      });
    }
  }, [user]);

  async function saveProfile(e) {
    e.preventDefault();
    await api.put('/lawyers/me/update', profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function otherPartyId(convo) {
    const senderId = convo.sender?._id || convo.sender;
    return String(senderId) === String(user._id) ? (convo.receiver?._id || convo.receiver) : senderId;
  }

  function otherPartyName(convo) {
    const senderId = convo.sender?._id || convo.sender;
    return String(senderId) === String(user._id) ? convo.receiver?.name : convo.sender?.name;
  }

  return (
    <div className="container" style={{ padding: '48px 24px 80px', maxWidth: 780 }}>
      <h2 style={{ fontSize: 28, marginBottom: 4 }}>Welcome, {user.name.split(' ')[0]}</h2>
      <p style={{ color: 'var(--slate)', fontSize: 14.5, marginBottom: 30 }}>
        {user.role === 'lawyer' ? 'Manage your public profile and chats.' : 'Your conversations with lawyers.'}
      </p>

      {user.role === 'lawyer' && profile && (
        <div className="card" style={{ padding: 24, marginBottom: 30 }}>
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>Edit Profile</h3>
          <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input placeholder="Specialization" value={profile.specialization} onChange={(e) => setProfile((p) => ({ ...p, specialization: e.target.value }))} />
            <input type="number" placeholder="Years of experience" value={profile.experienceYears} onChange={(e) => setProfile((p) => ({ ...p, experienceYears: e.target.value }))} />
            <input placeholder="City" value={profile.city} onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))} />
            <input type="number" placeholder="Consultation fee (₹)" value={profile.fee} onChange={(e) => setProfile((p) => ({ ...p, fee: e.target.value }))} />
            <input placeholder="Mobile number" value={profile.mobile} onChange={(e) => setProfile((p) => ({ ...p, mobile: e.target.value }))} />
            <textarea placeholder="Bio" rows={3} value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} />
            <button type="submit" className="btn-gold" style={{ padding: '11px 0', width: 160 }}>
              {saved ? 'Saved ✓' : 'Save changes'}
            </button>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 18, marginBottom: 14 }}>Your Conversations</h3>
        {conversations.length === 0 && <p style={{ color: 'var(--slate)' }}>No conversations yet.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {conversations.map((c) => (
            <Link
              key={c._id}
              to={`/chat/${otherPartyId(c)}`}
              className="card"
              style={{ padding: 14, display: 'flex', justifyContent: 'space-between' }}
            >
              <span style={{ fontWeight: 600 }}>{otherPartyName(c) || 'User'}</span>
              <span style={{ color: 'var(--slate)', fontSize: 13.5 }}>{c.text.slice(0, 40)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
