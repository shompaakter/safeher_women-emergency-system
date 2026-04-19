const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Incident       = require('../models/incident');

// GET /api/map?type=harassment
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type && type !== 'all') filter.incidentType = type;

    const incidents = await Incident.find(filter)
      .select('incidentType severity lat lng date')
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const now = new Date();
    const thisMonth = incidents.filter(i => {
      const d = new Date(i.date || i.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    res.json({
      incidents,
      stats: {
        total:        incidents.length,
        thisMonth,
        highSeverity: incidents.filter(i => i.severity === 'high').length,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load map data' });
  }
});

module.exports = router;