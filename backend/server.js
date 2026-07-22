require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const connectDB = require('./config/db');
const Message = require('./models/Message');

const authRoutes = require('./routes/authRoutes');
const lawyerRoutes = require('./routes/lawyerRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const messageRoutes = require('./routes/messageRoutes');

connectDB();

const app = express();

// Support one or more comma-separated origins in CLIENT_URL,
// e.g. CLIENT_URL=https://lawyer-connect-web.vercel.app,http://localhost:5173
const allowedOrigins = (process.env.CLIENT_URL || '*')
  .split(',')
  .map((o) => o.trim());

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like curl, mobile apps, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/lawyers', lawyerRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/messages', messageRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

function conversationId(a, b) {
  return [a, b].sort().join('_');
}

// Map of userId -> socket.id, so we know where to deliver a message
const onlineUsers = new Map();

// Socket auth: client connects with { auth: { token } }
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('No token provided'));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  onlineUsers.set(socket.userId, socket.id);
  console.log(`User connected: ${socket.userId}`);

  // Join a room per conversation so messages route only to the two participants
  socket.on('join_conversation', (otherUserId) => {
    const room = conversationId(socket.userId, otherUserId);
    socket.join(room);
  });

  socket.on('send_message', async ({ receiverId, text }) => {
    if (!text || !text.trim()) return;
    const convoId = conversationId(socket.userId, receiverId);

    const message = await Message.create({
      conversationId: convoId,
      sender: socket.userId,
      receiver: receiverId,
      text: text.trim(),
    });

    io.to(convoId).emit('receive_message', message);

    // Also notify the receiver directly in case they haven't joined the room yet
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('new_message_notification', message);
    }
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.userId);
    console.log(`User disconnected: ${socket.userId}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
