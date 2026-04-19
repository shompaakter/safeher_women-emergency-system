// backend/routes/report.js

const express = require('express');
const router  = express.Router();
const Report  = require('../models/Report');   // ← capital R
const { sendNewReportEmail } = require('../utils/mailer');

function generateReportCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'SH-';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// POST /api/report
router.post('/', async (req, res) => {
  try {
    const {
      incidentType, otherType, incidentDate, incidentTime,
      location, latitude, longitude, description,
      accusedName, accusedRelation, accusedDescription,
      hasEvidence, evidenceNote,
      isAnonymous, contactName, contactPhone, contactEmail,
      wantsFollowUp, consentPolice,
    } = req.body;

    if (!incidentType || !description) {
      return res.status(400).json({ message: 'Incident type and description are required.' });
    }

    let reportCode, attempts = 0;
    do {
      reportCode = generateReportCode();
      attempts++;
    } while (await Report.exists({ reportCode }) && attempts < 5);

    let parsedDate = null;
    if (incidentDate) {
      parsedDate = incidentTime
        ? new Date(`${incidentDate}T${incidentTime}`)
        : new Date(incidentDate);
    }

    const report = await Report.create({
      reportCode,
      incidentType,
      incidentDate:       parsedDate,
      location:           location           || '',
      latitude:           latitude           || null,
      longitude:          longitude          || null,
      description,
      accusedName:        accusedName        || '',
      accusedRelation:    accusedRelation    || '',
      accusedDescription: accusedDescription || '',
      hasEvidence:        !!hasEvidence,
      evidenceNote:       evidenceNote       || '',
      isAnonymous:        isAnonymous !== false,
      contactName:        contactName        || '',
      contactPhone:       contactPhone       || '',
      contactEmail:       contactEmail       || '',
      wantsFollowUp:      !!wantsFollowUp,
      consentPolice:      !!consentPolice,
    });

    console.log(`📋 New report: ${reportCode} | ${incidentType}`);

    try {
      await sendNewReportEmail({
        reportCode,
        incidentType,
        location:    location || 'Not provided',
        isAnonymous: report.isAnonymous,
        contactName: contactName || '',
      });
    } catch (e) {
      console.log('Report notification email failed:', e.message);
    }

    res.status(201).json({ success: true, reportCode: report.reportCode });

  } catch (err) {
    console.error('Report submit error:', err.message);
    res.status(500).json({ message: 'Failed to submit report.' });
  }
});

// GET /api/report/status?code=SH-XXXXXXXX
router.get('/status', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: 'Report code is required.' });

    const report = await Report.findOne({ reportCode: code.toUpperCase() })
      .select('reportCode incidentType status createdAt wantsFollowUp consentPolice');

    if (!report) return res.status(404).json({ message: 'Report not found.' });

    res.json({
      reportCode:    report.reportCode,
      incidentType:  report.incidentType,
      status:        report.status,
      submittedAt:   report.createdAt,
      wantsFollowUp: report.wantsFollowUp,
      consentPolice: report.consentPolice,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch status.' });
  }
});

module.exports = router;