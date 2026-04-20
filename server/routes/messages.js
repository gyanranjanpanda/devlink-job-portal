const router = require('express').Router();
const Message = require('../models/Message');
const { authenticate } = require('../middleware/auth');

// GET /api/messages/:roomId
router.get('/:roomId', authenticate, async (req, res) => {
  const messages = await Message.find({ roomId: req.params.roomId })
    .populate('sender', 'name avatar').sort({ createdAt: 1 }).limit(100);
  res.json({ messages });
});

// GET /api/messages/conversations/list
router.get('/conversations/list', authenticate, async (req, res) => {
  const userId = req.user._id.toString();
  const msgs = await Message.find({
    $or: [{ sender: req.user._id }, { receiver: req.user._id }]
  }).sort({ createdAt: -1 });

  const seen = new Set();
  const conversations = [];
  for (const m of msgs) {
    const otherId = m.sender.toString() === userId ? m.receiver.toString() : m.sender.toString();
    if (!seen.has(otherId)) {
      seen.add(otherId);
      conversations.push({ roomId: m.roomId, lastMessage: m.content, updatedAt: m.createdAt, otherId });
    }
  }
  res.json({ conversations });
});

module.exports = router;
