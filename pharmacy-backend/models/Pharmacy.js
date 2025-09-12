const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  pharmacyName: { type: String, required: true },
  address: { type: String, required: true },
  licence: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Pharmacy', pharmacySchema); 