// backend/models/SosAlert.js

const mongoose = require('mongoose');

const sosAlertSchema = new mongoose.Schema(
  {
    user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    latitude:  { type: Number, default: null },
    longitude: { type: Number, default: null },
    address:   { type: String, default: 'Location unavailable' },
    mapLink:   { type: String, default: '' },
    smsSent:   { type: Number, default: 0 },
    emailSent: { type: Number, default: 0 },
    status:    { type: String, enum: ['active', 'sent', 'resolved'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SosAlert', sosAlertSchema);