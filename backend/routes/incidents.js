const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Incident       = require('../models/incident');

function getUserId(req) {
  return req.user?.userId || req.user?.id || req.user?._id || null;
}

// GET /api/incidents
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { type, severity } = req.query;
    const filter = {};
    if (type && type !== 'all') filter.incidentType = type;
    if (severity)               filter.severity      = severity;

    const incidents = await Incident.find(filter)
      .select('incidentType severity lat lng date')
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    res.json({ incidents });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch incidents' });
  }
});

// POST /api/incidents
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { incidentType, severity, description, lat, lng, anonymous } = req.body;

    if (!incidentType || !lat || !lng) {
      return res.status(400).json({ message: 'incidentType, lat, lng are required.' });
    }

    const privateLat = lat + (Math.random() - 0.5) * 0.004;
    const privateLng = lng + (Math.random() - 0.5) * 0.004;

    const incident = await Incident.create({
      incidentType,
      severity:    severity   || 'medium',
      description: description || '',
      lat:         privateLat,
      lng:         privateLng,
      anonymous:   anonymous !== false,
      reportedBy:  anonymous ? null : userId,
    });

    res.status(201).json({ success: true, id: incident._id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit incident' });
  }
});

module.exports = router;