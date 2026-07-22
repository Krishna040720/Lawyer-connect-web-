const express = require('express');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

const router = express.Router();

function conversationId(a, b) {
  return [a, b].sort().join('_');
}

// GET /api/messages/:otherUserId - chat history between me and otherUserId
router.get('/:otherUserId', protect, async (req, res) => {
  try {
    const convoId = conversationId(req.user.id, req.params.otherUserId);
    const messages = await Message.find({ conversationId: convoId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch messages', error: err.message });
  }
});

// GET /api/messages - list of conversations for the logged-in user (for a "my chats" inbox view)
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name role')
      .populate('receiver', 'name role');

    // Reduce to latest message per conversation
    const latestByConvo = {};
    messages.forEach((m) => {
      if (!latestByConvo[m.conversationId]) latestByConvo[m.conversationId] = m;
    });

    res.json(Object.values(latestByConvo));
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch conversations', error: err.message });
  }
});

module.exports = router;
