const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    incidentType: {
      type: String,
      enum: ['harassment', 'rape', 'stalking', 'domestic', 'cyber', 'other'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    description: { type: String, default: '' },
    anonymous:   { type: Boolean, default: true },
    reportedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    // Approximate coordinates — offset for privacy
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Incident', incidentSchema);