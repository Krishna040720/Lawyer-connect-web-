const express = require('express');
const User = require('../models/User');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

// All routes here require a logged-in admin
router.use(protect, requireRole('admin'));

// GET /api/admin/lawyers?status=pending|verified|all - list lawyers for review
router.get('/lawyers', async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    const query = { role: 'lawyer' };
    if (status === 'pending') query.verified = false;
    if (status === 'verified') query.verified = true;

    const lawyers = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(lawyers);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch lawyers', error: err.message });
  }
});

// PUT /api/admin/lawyers/:id/verify - approve a lawyer's bar registration
router.put('/lawyers/:id/verify', async (req, res) => {
  try {
    const lawyer = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'lawyer' },
      { verified: true },
      { new: true }
    ).select('-password');
    if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });
    res.json(lawyer);
  } catch (err) {
    res.status(500).json({ message: 'Could not verify lawyer', error: err.message });
  }
});

// PUT /api/admin/lawyers/:id/unverify - revoke verification if needed
router.put('/lawyers/:id/unverify', async (req, res) => {
  try {
    const lawyer = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'lawyer' },
      { verified: false },
      { new: true }
    ).select('-password');
    if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });
    res.json(lawyer);
  } catch (err) {
    res.status(500).json({ message: 'Could not update lawyer', error: err.message });
  }
});

module.exports = router;
