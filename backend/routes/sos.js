const express          = require('express');
const router           = express.Router();
const authMiddleware   = require('../middleware/authMiddleware');
const User             = require('../models/user');
const Contact          = require('../models/Contact');
const SosAlert         = require('../models/SosAlert');
const { sendSosEmail } = require('../utils/mailer');

console.log('SosAlert model:', typeof SosAlert.find === 'function' ? '✅ OK' : '❌ PROBLEM');

function getUserId(req) {
  return req.user?.userId || req.user?.id || req.user?._id || null;
}

router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Invalid token payload' });

    const { latitude, longitude, address } = req.body;

    const user = await User.findById(userId).select('name phone email');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const mapLink = (latitude && longitude)
      ? `https://maps.google.com/?q=${latitude},${longitude}`
      : '';

    const locationText = address
      || (latitude && longitude
        ? `Lat: ${latitude}, Lng: ${longitude}`
        : 'Location unavailable');

    const sentAt = new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' });

    console.log(`\n🆘 SOS — ${user.name} | ${locationText}`);

    const alert = await SosAlert.create({
      user:      userId,
      latitude:  latitude  || null,
      longitude: longitude || null,
      address:   locationText,
      mapLink:   mapLink || '',
      emailSent: 0,
      status:    'active',
    });

    const contacts = await Contact.find({ user: userId });

    if (contacts.length === 0) {
      await SosAlert.findByIdAndUpdate(alert._id, { status: 'sent' });
      return res.json({
        success:   true,
        alertId:   alert._id,
        emailSent: 0,
        message:   'SOS saved. No trusted contacts found — please add contacts in your dashboard.',
      });
    }

    let emailSent = 0;
    for (const c of contacts) {
      if (!c.email) {
        console.log(`   ⚠️  No email for ${c.contactName}`);
        continue;
      }
      try {
        await sendSosEmail({
          toEmail:     c.email,
          toName:      c.contactName,
          senderName:  user.name,
          senderPhone: user.phone || '',
          location:    locationText,
          mapLink:     mapLink || null,
          sentAt,
        });
        emailSent++;
        console.log(`   ✅ Email → ${c.contactName} (${c.email})`);
      } catch (mailErr) {
        console.log(`   ❌ Failed for ${c.contactName}: ${mailErr.message}`);
      }
    }

    await SosAlert.findByIdAndUpdate(alert._id, { emailSent, status: 'sent' });
    console.log(`📊 SOS done — Emails sent: ${emailSent}\n`);

    res.json({
      success:   true,
      alertId:   alert._id,
      emailSent,
      mapLink,
      message:   `SOS sent — ${emailSent} email${emailSent !== 1 ? 's' : ''} delivered`,
    });

  } catch (err) {
    console.error('❌ SOS ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Invalid token payload' });

    const alerts = await SosAlert.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const cleaned = alerts.map(a => ({
      _id:       a._id,
      address:   a.address   || 'Location unavailable',
      mapLink:   a.mapLink   || '',
      emailSent: a.emailSent ?? 0,
      status:    a.status    || 'sent',
      createdAt: a.createdAt,
    }));

    res.json({ alerts: cleaned });

  } catch (err) {
    console.error('HISTORY ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/demo', async (req, res) => {
  try {
    const { email, phone, latitude, longitude } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required for demo.' });

    const mapLink = (latitude && longitude)
      ? `https://maps.google.com/?q=${latitude},${longitude}`
      : '';

    const locationText = (latitude && longitude)
      ? `Lat: ${Number(latitude).toFixed(4)}, Lng: ${Number(longitude).toFixed(4)}`
      : 'Dhaka, Bangladesh (demo location)';

    const sentAt = new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' });

    console.log(`\n🎯 DEMO SOS → ${email}`);

    await sendSosEmail({
      toEmail:     email,
      toName:      'You (Demo)',
      senderName:  'SafeHer Demo User',
      senderPhone: phone || 'Not provided',
      location:    locationText,
      mapLink:     mapLink || null,
      sentAt,
    });

    console.log(`✅ Demo email sent to ${email}\n`);

    res.json({ success: true, message: `Demo SOS email sent to ${email}` });

  } catch (err) {
    console.error('DEMO SOS ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;