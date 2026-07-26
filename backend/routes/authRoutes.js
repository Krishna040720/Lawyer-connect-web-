const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { welcomeEmail, loginAlertEmail, resetPasswordEmail } = require('../utils/email');
const router = express.Router();
function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}
function toSafeUser(user) {
  const obj = user.toObject();
  delete obj.password;
  return obj;
}
router.post('/register', async (req, res) => {
  try {
    const {
      name, email, password, role, mobile,
      specialization, experienceYears, barRegistrationNo, city, state, fee, bio,
    } = req.body;
    if (!name || !email || !password || !role || !mobile) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      mobile,
      specialization: role === 'lawyer' ? specialization : undefined,
      experienceYears: role === 'lawyer' ? experienceYears : undefined,
      barRegistrationNo: role === 'lawyer' ? barRegistrationNo : undefined,
      city: role === 'lawyer' ? city : undefined,
      state: role === 'lawyer' ? state : undefined,
      fee: role === 'lawyer' ? fee : undefined,
      bio: role === 'lawyer' ? bio : undefined,
    });
    const token = signToken(user);
    res.status(201).json({ token, user: toSafeUser(user) });
    welcomeEmail(user).catch(() => {});
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid email or password' });
    const token = signToken(user);
    res.json({ token, user: toSafeUser(user) });
    loginAlertEmail(user).catch(() => {});
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
      user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
      await user.save();
      const clientUrl = (process.env.CLIENT_URL || '').split(',')[0].trim() || 'http://localhost:5173';
      const resetUrl = `${clientUrl}/reset-password/${rawToken}`;
      resetPasswordEmail(user, resetUrl).catch(() => {});
    }
    res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (err) {
    res.status(500).json({ message: 'Could not process request', error: err.message });
  }
});
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: 'This reset link is invalid or has expired' });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.json({ message: 'Password updated successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Could not reset password', error: err.message });
  }
});
module.exports = router;
