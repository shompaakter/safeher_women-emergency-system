// backend/routes/report.js
// POST /api/report        → submit new incident report
// GET  /api/report/status → check report status by code

const express = require('express');
const router  = express.Router();
const Report  = require('../models/Report');
const { sendNewReportEmail } = require('../utils/mailer');

// Generate unique report code e.g. SH-K7MN4PQ2
function generateReportCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'SH-';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// ── POST /api/report ──────────────────────────────────
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

    // Build report code (retry if duplicate)
    let reportCode;
    let attempts = 0;
    do {
      reportCode = generateReportCode();
      attempts++;
    } while (await Report.exists({ reportCode }) && attempts < 5);

    // Parse date
    let parsedDate = null;
    if (incidentDate) {
      parsedDate = incidentTime
        ? new Date(`${incidentDate}T${incidentTime}`)
        : new Date(incidentDate);
    }

    // ✅ FIXED — isAnonymous সঠিকভাবে check করা হচ্ছে
    const anonymous = isAnonymous === true || isAnonymous === 'true';

    const report = await Report.create({
      reportCode,
      incidentType: incidentType === 'other' && otherType ? 'other' : incidentType,
      incidentDate:  parsedDate,
      location:      location || '',
      latitude:      latitude  || null,
      longitude:     longitude || null,
      description,
      accusedName:        accusedName        || '',
      accusedRelation:    accusedRelation    || '',
      accusedDescription: accusedDescription || '',
      hasEvidence:   !!hasEvidence,
      evidenceNote:  evidenceNote  || '',
      isAnonymous:   anonymous,           // ✅ FIXED
      contactName:   contactName  || '',
      contactPhone:  contactPhone || '',
      contactEmail:  contactEmail || '',
      wantsFollowUp: !!wantsFollowUp,
      consentPolice: !!consentPolice,
    });

    // Notify team by email
    try {
      await sendNewReportEmail({
        reportCode,
        incidentType: report.incidentType,
        location:     location || 'Not provided',
        isAnonymous:  report.isAnonymous,
      });
    } catch (mailErr) {
      console.log('Report notification email failed:', mailErr.message);
    }

    res.status(201).json({
      success:    true,
      reportCode: report.reportCode,
      message:    'Report submitted successfully.',
    });
  } catch (err) {
    console.error('Report submit error:', err);
    res.status(500).json({ message: 'Failed to submit report. Please try again.' });
  }
});

// ── GET /api/report/status?code=SH-XXXXXXXX ──────────
router.get('/status', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: 'Report code is required.' });

    const report = await Report.findOne({ reportCode: code })
      .select('reportCode incidentType status createdAt wantsFollowUp consentPolice');

    if (!report) return res.status(404).json({ message: 'Report not found.' });

    res.json({
      reportCode:   report.reportCode,
      incidentType: report.incidentType,
      status:       report.status,
      submittedAt:  report.createdAt,
      wantsFollowUp: report.wantsFollowUp,
      consentPolice: report.consentPolice,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch status.' });
  }
});

module.exports = router;