const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
const signRefresh = (id) => jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role, company } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password, role, company });
  const accessToken = signToken(user._id);
  const refreshToken = signRefresh(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  res.status(201).json({ user, accessToken, refreshToken });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = signToken(user._id);
  const refreshToken = signRefresh(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  res.json({ user, accessToken, refreshToken });
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken)
      return res.status(401).json({ message: 'Invalid refresh token' });
    const newAccess = signToken(user._id);
    res.json({ accessToken: newAccess });
  } catch {
    res.status(401).json({ message: 'Expired refresh token' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => res.json({ user: req.user }));

// POST /api/auth/logout
router.post('/logout', authenticate, async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });
  res.json({ message: 'Logged out' });
});

// PUT /api/auth/profile
router.put('/profile', authenticate, async (req, res) => {
  const updates = req.body;
  delete updates.password; delete updates.email; delete updates.role;
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.json({ user });
});

module.exports = router;
