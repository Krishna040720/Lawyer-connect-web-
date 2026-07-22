const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['client', 'lawyer'], required: true },
    mobile: { type: String, required: true },

    // Lawyer-specific fields (ignored for clients)
    specialization: { type: String, default: '' }, // e.g. Criminal, Corporate, Family, Property
    experienceYears: { type: Number, default: 0 },
    barRegistrationNo: { type: String, default: '' },
    city: { type: String, default: '' },
    fee: { type: Number, default: 0 }, // consultation fee
    bio: { type: String, default: '' },
    verified: { type: Boolean, default: false },

    // Aggregated rating fields, updated whenever a new rating is added
    avgRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
