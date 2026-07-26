const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['client', 'lawyer', 'admin'], required: true },
    mobile: { type: String, required: true },

    specialization: { type: String, default: '' },
    experienceYears: { type: Number, default: 0 },
    barRegistrationNo: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    fee: { type: Number, default: 0 },
    bio: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    available: { type: Boolean, default: true },

    avgRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },

    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
