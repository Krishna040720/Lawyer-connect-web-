const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    lawyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, default: '' },
  },
  { timestamps: true }
);

// A client can rate a given lawyer only once (they can edit it, not duplicate it)
ratingSchema.index({ lawyer: 1, client: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
