const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(protect, requireRole('admin'));

const DEMO_PASSWORD = 'Demo@12345';

const demoLawyers = [
  { name: 'Ananya Sharma', email: 'ananya.sharma.demo@lawyerconnect.test', mobile: '9876543210', specialization: 'Family', experienceYears: 8, barRegistrationNo: 'DL/1234/2016', city: 'New Delhi', state: 'Delhi', fee: 1500, bio: 'Family law specialist handling divorce, custody, and maintenance cases with a client-first approach.' },
  { name: 'Rohan Verma', email: 'rohan.verma.demo@lawyerconnect.test', mobile: '9812345678', specialization: 'Criminal', experienceYears: 12, barRegistrationNo: 'MH/5678/2011', city: 'Mumbai', state: 'Maharashtra', fee: 2500, bio: 'Criminal defense lawyer with over a decade of trial experience across Mumbai courts.' },
  { name: 'Priya Nair', email: 'priya.nair.demo@lawyerconnect.test', mobile: '9900112233', specialization: 'Corporate', experienceYears: 6, barRegistrationNo: 'KA/3344/2018', city: 'Bengaluru', state: 'Karnataka', fee: 3000, bio: 'Corporate counsel advising startups on contracts, compliance, and fundraising.' },
  { name: 'Vikram Singh', email: 'vikram.singh.demo@lawyerconnect.test', mobile: '9845098450', specialization: 'Property', experienceYears: 15, barRegistrationNo: 'UP/7890/2008', city: 'Lucknow', state: 'Uttar Pradesh', fee: 2000, bio: 'Property and real estate disputes specialist, handling title verification and tenancy matters.' },
  { name: 'Meera Iyer', email: 'meera.iyer.demo@lawyerconnect.test', mobile: '9988776655', specialization: 'Civil', experienceYears: 5, barRegistrationNo: 'TN/2233/2019', city: 'Chennai', state: 'Tamil Nadu', fee: 1200, bio: 'Civil litigation lawyer focused on contract disputes and consumer protection cases.' },
  { name: 'Arjun Malhotra', email: 'arjun.malhotra.demo@lawyerconnect.test', mobile: '9765432109', specialization: 'Tax', experienceYears: 10, barRegistrationNo: 'WB/4455/2013', city: 'Kolkata', state: 'West Bengal', fee: 2800, bio: 'Tax law advisor helping individuals and small businesses with GST and income tax matters.' },
  { name: 'Sneha Reddy', email: 'sneha.reddy.demo@lawyerconnect.test', mobile: '9123456789', specialization: 'Labour & Employment', experienceYears: 7, barRegistrationNo: 'TS/6677/2015', city: 'Hyderabad', state: 'Telangana', fee: 1800, bio: 'Labour and employment lawyer representing both employees and employers in workplace disputes.' },
  { name: 'Karan Mehta', email: 'karan.mehta.demo@lawyerconnect.test', mobile: '9234567890', specialization: 'Family', experienceYears: 4, barRegistrationNo: 'GJ/8899/2020', city: 'Ahmedabad', state: 'Gujarat', fee: 1000, bio: 'Young family law practitioner focused on mediation-first approaches to reduce court time.' },
];

router.post('/seed-demo-lawyers', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
    let created = 0;
    let skipped = 0;

    for (const lawyer of demoLawyers) {
      const existing = await User.findOne({ email: lawyer.email });
      if (existing) {
        skipped++;
        continue;
      }
      await User.create({ ...lawyer, password: hashedPassword, role: 'lawyer', verified: true });
      created++;
    }

    res.json({ message: `Created ${created} demo lawyer(s), skipped ${skipped} already existing.`, created, skipped });
  } catch (err) {
    res.status(500).json({ message: 'Seeding failed', error: err.message });
  }
});

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
