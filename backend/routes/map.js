// backend/routes/map.js

const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Report         = require('../models/Report');   // ← capital R

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { type } = req.query;

    const query = {
      latitude:  { $ne: null, $exists: true },
      longitude: { $ne: null, $exists: true },
      status:    { $in: ['reviewing', 'action_taken', 'resolved', 'police_referred'] },
    };
    if (type && type !== 'all') query.incidentType = type;

    const reports = await Report.find(query)
      .select('incidentType incidentDate latitude longitude severity')
      .sort({ incidentDate: -1 })
      .limit(300);

    // Privacy: fuzz location ±~500m
    const incidents = reports.map(r => ({
      id:           r._id,
      incidentType: r.incidentType,
      date:         r.incidentDate,
      severity:     r.severity || 'medium',
      lat:          r.latitude  + (Math.random() - 0.5) * 0.01,
      lng:          r.longitude + (Math.random() - 0.5) * 0.01,
    }));

    const now        = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, thisMonth, highSeverity] = await Promise.all([
      Report.countDocuments({ status: { $ne: 'pending' } }),
      Report.countDocuments({ status: { $ne: 'pending' }, createdAt: { $gte: monthStart } }),
      Report.countDocuments({ status: { $ne: 'pending' }, severity: 'high' }),
    ]);

    res.json({ incidents, stats: { total, thisMonth, highSeverity } });
  } catch (err) {
    console.error('Map API error:', err.message);
    res.status(500).json({ error: 'Failed to load map data' });
  }
});

module.exports = router;