// backend/models/Contact.js

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contactName:  { type: String, required: true, trim: true },
    contactPhone: { type: String, required: true, trim: true },
    email:        { type: String, default: '', trim: true },
    relation:     { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// ✅ OverwriteModelError fix — model আগে থেকে থাকলে সেটাই use করো
module.exports = mongoose.models.Contact || mongoose.model('Contact', contactSchema);