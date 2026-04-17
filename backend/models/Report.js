// backend/models/Report.js

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reportCode:   { type: String, unique: true, required: true },
    incidentType: {
      type: String,
      enum: ['harassment', 'rape', 'stalking', 'domestic', 'cyber', 'other'],
      required: true,
    },
    incidentDate: { type: Date,   default: null },
    location:     { type: String, default: '' },

    // ── For map display (fuzzed before sending to client) ──
    latitude:     { type: Number, default: null },
    longitude:    { type: Number, default: null },

    description:  { type: String, required: true },

    // Accused info
    accusedName:        { type: String, default: '' },
    accusedRelation:    { type: String, default: '' },
    accusedDescription: { type: String, default: '' },

    // Evidence
    hasEvidence:  { type: Boolean, default: false },
    evidenceNote: { type: String,  default: '' },

    // Contact (anonymous or not)
    isAnonymous:  { type: Boolean, default: true },
    contactName:  { type: String,  default: '' },
    contactPhone: { type: String,  default: '' },
    contactEmail: { type: String,  default: '' },

    // Preferences
    wantsFollowUp: { type: Boolean, default: false },
    consentPolice: { type: Boolean, default: false },

    // Admin workflow
    severity: {
      type:    String,
      enum:    ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type:    String,
      enum:    ['pending', 'reviewing', 'action_taken', 'resolved', 'police_referred', 'closed'],
      default: 'pending',
    },
    adminNote: { type: String, default: '' },

    // Link to user (null for anonymous)
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

// Indexes for fast queries
reportSchema.index({ status: 1 });
reportSchema.index({ incidentType: 1 });
reportSchema.index({ createdAt: -1 });
reportSchema.index({ reportCode: 1 });

module.exports = mongoose.model('Report', reportSchema);