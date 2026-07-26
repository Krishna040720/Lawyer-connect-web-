const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { specialization, city, state, minExperience, search } = req.query;
    const query = { role: 'lawyer' };

    if (specialization) query.specialization = specialization;
    if (city) query.city = new RegExp(city, 'i');
    if (state) query.state = state;
    if (minExperience) query.experienceYears = { $gte: Number(minExperience) };
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { specialization: new RegExp(search, 'i') },
        { bio: new RegExp(search, 'i') },
      ];
    }

    const lawyers = await User.find(query)
      .select('-password')
      .sort({ avgRating: -1, experienceYears: -1 });

    res.json(lawyers);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch lawyers', error: err.message });
  }
});

router.get('/meta/states', async (req, res) => {
  try {
    const states = await User.distinct('state', { role: 'lawyer', state: { $ne: '' } });
    res.json(states.sort());
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch states', error: err.message });
  }
});

router.get('/meta/stats', async (req, res) => {
  try {
    const [lawyerCount, verifiedCount, states] = await Promise.all([
      User.countDocuments({ role: 'lawyer' }),
      User.countDocuments({ role: 'lawyer', verified: true }),
      User.distinct('state', { role: 'lawyer', state: { $ne: '' } }),
    ]);
    res.json({ lawyerCount, verifiedCount, stateCount: states.length });
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch stats', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const lawyer = await User.findOne({ _id: req.params.id, role: 'lawyer' }).select('-password');
    if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });
    res.json(lawyer);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch lawyer', error: err.message });
  }
});

router.put('/me/update', protect, async (req, res) => {
  try {
    if (req.user.role !== 'lawyer') {
      return res.status(403).json({ message: 'Only lawyers can edit a lawyer profile' });
    }
    const allowedFields = [
      'name', 'mobile', 'specialization', 'experienceYears',
      'barRegistrationNo', 'city', 'state', 'fee', 'bio', 'available',
    ];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updated = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

module.exports = router;
