import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { getSocket } from '../socket';
import { useAuth } from '../context/AuthContext';

export default function Chat() {
  const { otherUserId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    let socket;

    async function init() {
      // Load past messages + who we're chatting with
      const [{ data: history }, { data: profile }] = await Promise.all([
        api.get(`/messages/${otherUserId}`),
        api.get(`/lawyers/${otherUserId}`).catch(() => ({ data: null })),
      ]);
      setMessages(history);
      setOtherUser(profile);

      socket = getSocket();
      if (socket) {
        socket.emit('join_conversation', otherUserId);
        socket.on('receive_message', (msg) => {
          setMessages((prev) => [...prev, msg]);
        });
      }
    }

    init();

    return () => {
      if (socket) socket.off('receive_message');
    };
  }, [otherUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const socket = getSocket();
    socket.emit('send_message', { receiverId: otherUserId, text });
    setText('');
  }

  return (
    <div className="container" style={{ padding: '40px 24px 60px', maxWidth: 700 }}>
      <h2 style={{ fontSize: 22, marginBottom: 4 }}>
        Chat with {otherUser?.name || 'user'}
      </h2>
      <p style={{ fontSize: 13.5, color: 'var(--slate)', marginBottom: 20 }}>
        Messages are delivered instantly while you're both online.
      </p>

      <div className="card" style={{ height: 420, padding: 18, display: 'flex', flexDirection: 'column', overflowY: 'auto', gap: 10 }}>
        {messages.length === 0 && (
          <p style={{ color: 'var(--slate)', fontSize: 14, margin: 'auto' }}>Say hello to start the conversation.</p>
        )}
        {messages.map((m) => {
          const mine = String(m.sender?._id || m.sender) === String(user._id);
          return (
            <div
              key={m._id}
              style={{
                alignSelf: mine ? 'flex-end' : 'flex-start',
                background: mine ? 'var(--navy)' : 'var(--cream)',
                color: mine ? 'var(--cream)' : 'var(--ink)',
                padding: '9px 14px',
                borderRadius: 12,
                maxWidth: '75%',
                fontSize: 14.5,
              }}
            >
              {m.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <input placeholder="Type a message…" value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit" className="btn-primary" style={{ padding: '0 24px' }}>Send</button>
      </form>
    </div>
  );
}
