const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/lawyers?specialization=Criminal&city=Delhi&minExperience=5&search=text
// Public listing + search/filter, used by the "browse lawyers" page
router.get('/', async (req, res) => {
  try {
    const { specialization, city, minExperience, search } = req.query;
    const query = { role: 'lawyer' };

    if (specialization) query.specialization = specialization;
    if (city) query.city = new RegExp(city, 'i');
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

// GET /api/lawyers/:id - single lawyer profile
router.get('/:id', async (req, res) => {
  try {
    const lawyer = await User.findOne({ _id: req.params.id, role: 'lawyer' }).select('-password');
    if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });
    res.json(lawyer);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch lawyer', error: err.message });
  }
});

// PUT /api/lawyers/me - lawyer edits their own profile
router.put('/me/update', protect, async (req, res) => {
  try {
    if (req.user.role !== 'lawyer') {
      return res.status(403).json({ message: 'Only lawyers can edit a lawyer profile' });
    }
    const allowedFields = [
      'name', 'mobile', 'specialization', 'experienceYears',
      'barRegistrationNo', 'city', 'fee', 'bio',
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
