const mongoose = require('mongoose');

const savedListSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  name: { type: String, default: '' },
  medicines: [{
    name: { type: String, required: true },
    type: { type: String, default: '' },
    strength: { type: String, default: '' },
    quantity: { type: Number, default: 1 }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SavedList', savedListSchema);
