// backend/routes/contacts.js
// GET    /api/contacts      → list contacts
// POST   /api/contacts      → add contact
// PUT    /api/contacts/:id  → update contact
// DELETE /api/contacts/:id  → delete contact

const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Contact        = require('../models/Contact');

// ── GET /api/contacts ─────────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId   = req.user?.userId;
    const contacts = await Contact.find({ user: userId }).sort({ createdAt: 1 });
    res.json(contacts);
  } catch (err) {
    console.error('GET contacts error:', err.message);
    res.status(500).json({ message: 'Failed to fetch contacts.' });
  }
});

// ── POST /api/contacts ────────────────────────────────
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // ── Accept both field name conventions ──
    const contactName  = req.body.contactName  || req.body.name  || '';
    const contactPhone = req.body.contactPhone || req.body.phone || '';
    const email        = req.body.email        || '';
    const relation     = req.body.relation     || req.body.relationship || '';

    console.log('POST /api/contacts body:', { contactName, contactPhone, email, relation });

    // Validation
    if (!contactName.trim())  return res.status(400).json({ message: 'Name is required.' });
    if (!contactPhone.trim()) return res.status(400).json({ message: 'Phone is required.' });
    if (!relation.trim())     return res.status(400).json({ message: 'Relationship is required.' });

    // Max 5 contacts
    const count = await Contact.countDocuments({ user: userId });
    if (count >= 5) return res.status(400).json({ message: 'Maximum 5 trusted contacts allowed.' });

    const contact = await Contact.create({
      user:         userId,
      contactName:  contactName.trim(),
      contactPhone: contactPhone.trim(),
      email:        email.trim(),
      relation:     relation.trim(),
    });

    console.log('✅ Contact saved:', contact.contactName);
    res.status(201).json(contact);

  } catch (err) {
    console.error('POST contacts error:', err.message, err);
    res.status(500).json({ message: 'Failed to save contact. ' + err.message });
  }
});

// ── PUT /api/contacts/:id ─────────────────────────────
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId;

    const contactName  = req.body.contactName  || req.body.name  || '';
    const contactPhone = req.body.contactPhone || req.body.phone || '';
    const email        = req.body.email        || '';
    const relation     = req.body.relation     || req.body.relationship || '';

    if (!contactName.trim())  return res.status(400).json({ message: 'Name is required.' });
    if (!contactPhone.trim()) return res.status(400).json({ message: 'Phone is required.' });
    if (!relation.trim())     return res.status(400).json({ message: 'Relationship is required.' });

    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      { contactName: contactName.trim(), contactPhone: contactPhone.trim(), email: email.trim(), relation: relation.trim() },
      { new: true }
    );

    if (!contact) return res.status(404).json({ message: 'Contact not found.' });

    console.log('✅ Contact updated:', contact.contactName);
    res.json(contact);

  } catch (err) {
    console.error('PUT contacts error:', err.message);
    res.status(500).json({ message: 'Failed to update contact.' });
  }
});

// ── DELETE /api/contacts/:id ──────────────────────────
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId;
    await Contact.findOneAndDelete({ _id: req.params.id, user: userId });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE contacts error:', err.message);
    res.status(500).json({ message: 'Failed to delete contact.' });
  }
});

module.exports = router;