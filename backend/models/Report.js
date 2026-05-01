// backend/models/Report.js
// ⚠️  পুরনো report.js (lowercase) delete করো আগে!

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reportCode:         { type: String, unique: true, required: true },
    incidentType:       { type: String, enum: ['harassment','rape','stalking','domestic','cyber','other'], required: true },
    incidentDate:       { type: Date,    default: null },
    location:           { type: String,  default: '' },
    latitude:           { type: Number,  default: null },
    longitude:          { type: Number,  default: null },
    description:        { type: String,  required: true },
    accusedName:        { type: String,  default: '' },
    accusedRelation:    { type: String,  default: '' },
    accusedDescription: { type: String,  default: '' },
    hasEvidence:        { type: Boolean, default: false },
    evidenceNote:       { type: String,  default: '' },
    isAnonymous:        { type: Boolean, default: true },
    contactName:        { type: String,  default: '' },
    contactPhone:       { type: String,  default: '' },
    contactEmail:       { type: String,  default: '' },
    wantsFollowUp:      { type: Boolean, default: false },
    consentPolice:      { type: Boolean, default: false },
    severity:           { type: String,  enum: ['low','medium','high'], default: 'medium' },
    status:             { type: String,  enum: ['pending','reviewing','action_taken','resolved','police_referred','closed'], default: 'pending' },
    adminNote:          { type: String,  default: '' },
    user:               { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

// ✅ OverwriteModelError fix
module.exports = mongoose.models.Report || mongoose.model('Report', reportSchema);