// backend/routes/admin.js

const express    = require('express');
const router     = express.Router();
const jwt        = require('jsonwebtoken');
const Report     = require('../models/Report');    // ← capital R
const SosAlert   = require('../models/SosAlert');  // ← capital S, capital A

function adminAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    if (decoded.role !== 'admin')
      return res.status(403).json({ message: 'Admin access only' });
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail    = process.env.ADMIN_EMAIL    || 'admin@safeher.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'SafeHer@2025';

  if (email !== adminEmail || password !== adminPassword)
    return res.status(401).json({ message: 'Invalid credentials.' });

  const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' });
  console.log(`✅ Admin login: ${email}`);
  res.json({ token });
});

// GET /api/admin/reports
router.get('/reports', adminAuth, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status && status !== 'all' ? { status } : {};
    const reports = await Report.find(query).sort({ createdAt: -1 }).select('-__v');

    const [total, pending, reviewing, resolved] = await Promise.all([
      Report.countDocuments({}),
      Report.countDocuments({ status: 'pending' }),
      Report.countDocuments({ status: 'reviewing' }),
      Report.countDocuments({ status: 'resolved' }),
    ]);

    res.json({ reports, stats: { total, pending, reviewing, resolved } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/reports/:id
router.put('/reports/:id', adminAuth, async (req, res) => {
  try {
    const { status, adminNote, severity } = req.body;
    const update = {};
    if (status)    update.status    = status;
    if (adminNote !== undefined) update.adminNote = adminNote;
    if (severity)  update.severity  = severity;

    const report = await Report.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!report) return res.status(404).json({ message: 'Report not found.' });

    console.log(`📋 Report ${report.reportCode} → ${status}`);
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/sos-alerts
router.get('/sos-alerts', adminAuth, async (req, res) => {
  try {
    const alerts = await SosAlert.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('user', 'name phone email')
      .select('-__v');
    res.json({ alerts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;