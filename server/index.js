require('dotenv').config();
require('express-async-errors');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const messageRoutes = require('./routes/messages');
const { errorHandler } = require('./middleware/errorHandler');
const { authenticateSocket } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }
});

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/messages', messageRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Socket.io — real-time messaging
const onlineUsers = new Map();

io.use(authenticateSocket);

io.on('connection', (socket) => {
  const userId = socket.user.id;
  onlineUsers.set(userId, socket.id);
  io.emit('onlineUsers', Array.from(onlineUsers.keys()));

  socket.on('joinRoom', (roomId) => socket.join(roomId));

  socket.on('sendMessage', async ({ roomId, content, receiverId }) => {
    const Message = require('./models/Message');
    const msg = await Message.create({ sender: userId, receiver: receiverId, roomId, content });
    await msg.populate('sender', 'name avatar');
    io.to(roomId).emit('newMessage', msg);
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(userId);
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/devlink')
  .then(() => {
    server.listen(PORT, () => console.log(`DevLink server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
