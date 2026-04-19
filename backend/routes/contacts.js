const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Contact        = require('../models/contact');

function getUserId(req) {
  return req.user?.userId || req.user?.id || req.user?._id || null;
}

// ═══════════════════════════════════════════════════
// GET /api/contacts/fix-email
// ⚠️ ONE-TIME USE — Railway DB-তে email field add করে
// Use করার পরে এই route টা delete করো
// ═══════════════════════════════════════════════════
router.get('/fix-email', async (req, res) => {
  try {
    const result = await Contact.updateMany(
      { email: { $exists: false } },
      { $set: { email: '' } }
    );
    console.log(`✅ Fixed ${result.modifiedCount} contacts — email field added`);
    res.json({
      success:  true,
      message:  `Fixed! ${result.modifiedCount} contacts updated.`,
      modified: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════
// GET /api/contacts
// ═══════════════════════════════════════════════════
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const contacts = await Contact.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    const normalized = contacts.map(c => ({
      ...c,
      email: c.email || '',
    }));

    res.json({ contacts: normalized });
  } catch (err) {
    console.error('GET contacts:', err.message);
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
});

// ═══════════════════════════════════════════════════
// POST /api/contacts
// ═══════════════════════════════════════════════════
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { contactName, phone, email, relationship } = req.body;

    if (!contactName?.trim()) return res.status(400).json({ message: 'Name is required.' });
    if (!phone?.trim())       return res.status(400).json({ message: 'Phone is required.' });

    const count = await Contact.countDocuments({ user: userId });
    if (count >= 5) return res.status(400).json({ message: 'Maximum 5 trusted contacts allowed.' });

    const contact = await Contact.create({
      user:         userId,
      contactName:  contactName.trim(),
      phone:        phone.trim(),
      email:        (email || '').trim().toLowerCase(),
      relationship: (relationship || 'Other').trim(),
    });

    console.log(`✅ Contact added: ${contact.contactName} | email: "${contact.email}"`);
    res.status(201).json({ contact });

  } catch (err) {
    console.error('POST contact:', err.message);
    res.status(500).json({ message: 'Failed to add contact' });
  }
});

// ═══════════════════════════════════════════════════
// PUT /api/contacts/:id
// ═══════════════════════════════════════════════════
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { contactName, phone, email, relationship } = req.body;

    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      {
        $set: {
          contactName:  (contactName || '').trim(),
          phone:        (phone || '').trim(),
          email:        (email || '').trim().toLowerCase(),
          relationship: (relationship || 'Other').trim(),
        },
      },
      { new: true, runValidators: false }
    );

    if (!contact) return res.status(404).json({ message: 'Contact not found' });

    console.log(`✅ Contact updated: ${contact.contactName} | email: "${contact.email}"`);
    res.json({ contact });

  } catch (err) {
    console.error('PUT contact:', err.message);
    res.status(500).json({ message: 'Failed to update contact' });
  }
});

// ═══════════════════════════════════════════════════
// DELETE /api/contacts/:id
// ═══════════════════════════════════════════════════
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const contact = await Contact.findOneAndDelete({ _id: req.params.id, user: userId });
    if (!contact) return res.status(404).json({ message: 'Contact not found' });

    console.log(`🗑️ Deleted: ${contact.contactName}`);
    res.json({ message: 'Contact deleted' });

  } catch (err) {
    res.status(500).json({ message: 'Failed to delete contact' });
  }
});

module.exports = router;