const express = require('express');
const Rating = require('../models/Rating');
const User = require('../models/User');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/ratings/:lawyerId - all reviews for a lawyer (public)
router.get('/:lawyerId', async (req, res) => {
  try {
    const ratings = await Rating.find({ lawyer: req.params.lawyerId })
      .populate('client', 'name')
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch ratings', error: err.message });
  }
});

// POST /api/ratings/:lawyerId - client rates a lawyer (one rating per client per lawyer)
router.post('/:lawyerId', protect, requireRole('client'), async (req, res) => {
  try {
    const { stars, review } = req.body;
    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ message: 'Stars must be between 1 and 5' });
    }

    const rating = await Rating.findOneAndUpdate(
      { lawyer: req.params.lawyerId, client: req.user.id },
      { stars, review },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Recalculate the lawyer's aggregate rating
    const allRatings = await Rating.find({ lawyer: req.params.lawyerId });
    const avg = allRatings.reduce((sum, r) => sum + r.stars, 0) / allRatings.length;

    await User.findByIdAndUpdate(req.params.lawyerId, {
      avgRating: Math.round(avg * 10) / 10,
      ratingCount: allRatings.length,
    });

    res.json(rating);
  } catch (err) {
    res.status(500).json({ message: 'Could not submit rating', error: err.message });
  }
});

module.exports = router;
