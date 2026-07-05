const mongoose = require('mongoose');

// --- DEFINE CORE OUTAGE TRACKING SCHEMA ---
const outageSchema = new mongoose.Schema({
  utilityType: { type: String, required: true },
  locationName: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true, default: 'PENDING' },
  estimatedRestoration: { type: String, required: true, default: 'Pending' },
  reporterId: { type: String, required: true },
  reporterName: { type: String, required: true },
  assignedTo: { type: String, default: '' },        // ← ADD THIS
  assignedToName: { type: String, default: '' },    // ← ADD THIS
  createdAt: { type: Date, default: Date.now }
});

// --- COMPILE AND EXPORT INSTANCE ---
module.exports = mongoose.model('Outage', outageSchema);