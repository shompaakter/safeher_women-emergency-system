const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Contact        = require('../models/Contact');

function getUserId(req) {
  return req.user?.userId || req.user?.id || req.user?._id || null;
}

// GET /api/contacts
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const contacts = await Contact.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    // Ensure email field always exists in response
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

// POST /api/contacts
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { contactName, phone, email, relationship } = req.body;

    if (!contactName?.trim()) return res.status(400).json({ message: 'Name is required.' });
    if (!phone?.trim())       return res.status(400).json({ message: 'Phone is required.' });

    const count = await Contact.countDocuments({ user: userId });
    if (count >= 5) return res.status(400).json({ message: 'Maximum 5 trusted contacts allowed.' });

    const emailVal = (email || '').trim().toLowerCase();

    const contact = await Contact.create({
      user:         userId,
      contactName:  contactName.trim(),
      phone:        phone.trim(),
      email:        emailVal,
      relationship: (relationship || 'Other').trim(),
    });

    console.log(`✅ Contact added: ${contact.contactName} | email: "${contact.email}"`);
    res.status(201).json({ contact });

  } catch (err) {
    console.error('POST contact:', err.message);
    res.status(500).json({ message: 'Failed to add contact' });
  }
});

// PUT /api/contacts/:id  — update including email
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { contactName, phone, email, relationship } = req.body;
    const emailVal = (email || '').trim().toLowerCase();

    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      {
        $set: {
          contactName:  (contactName || '').trim(),
          phone:        (phone || '').trim(),
          email:        emailVal,
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

// DELETE /api/contacts/:id
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
// GET /api/contacts/fix-email — one time use, তারপর delete করো
router.get('/fix-email', async (req, res) => {
  try {
    const result = await Contact.updateMany(
      { email: { $exists: false } },
      { $set: { email: '' } }
    );
    res.json({ message: 'Fixed!', modified: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;