// backend/utils/mailer.js
// সব কিছু শুধু Nodemailer (Gmail) দিয়ে:
// 1. sendOTP              → Registration + Forgot Password OTP
// 2. sendSosEmail         → SOS alert with location + map link
// 3. sendNewReportEmail   → New report notification to admin

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// ═══════════════════════════════════════════════════════
// 1. OTP EMAIL → Registration + Forgot Password
// ═══════════════════════════════════════════════════════
const sendOTP = async (toEmail, otp, name) => {
  const info = await transporter.sendMail({
    from:    `"SafeHer" <${process.env.MAIL_USER}>`,
    to:      toEmail,
    subject: `${otp} — Your SafeHer Verification Code`,
    html: `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px">
<table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #fce7f3">

  <tr><td style="background:#ec4899;padding:28px 32px">
    <p style="color:#fff;margin:0;font-size:24px;font-weight:700">SafeHer 🛡️</p>
    <p style="color:#fce7f3;margin:6px 0 0;font-size:13px">Women Safety Platform — Bangladesh</p>
  </td></tr>

  <tr><td style="padding:36px 32px">
    <p style="color:#111827;font-size:16px;margin:0 0 6px">Hi <b>${name || 'there'}</b> 👋</p>
    <p style="color:#374151;font-size:14px;margin:0 0 28px;line-height:1.6">
      Here is your verification code. It is valid for <b>5 minutes</b>.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="background:#fdf2f8;border:2px dashed #f9a8d4;border-radius:14px;padding:30px 20px">
      <p style="font-size:52px;font-weight:700;letter-spacing:14px;color:#ec4899;margin:0;font-family:'Courier New',monospace">${otp}</p>
      <p style="color:#9ca3af;font-size:12px;margin:12px 0 0">Do not share this code with anyone</p>
    </td></tr></table>
    <p style="color:#6b7280;font-size:13px;margin:24px 0 6px">⏱ Expires in <b>5 minutes</b>.</p>
    <p style="color:#9ca3af;font-size:12px;margin:0">If you didn't request this, please ignore this email.</p>
  </td></tr>

  <tr><td style="background:#fdf2f8;padding:16px 32px;border-top:1px solid #fce7f3">
    <p style="color:#d1d5db;font-size:11px;margin:0;text-align:center">© SafeHer · Women Safety Platform · Bangladesh</p>
  </td></tr>

</table></td></tr></table>
</body></html>`,
  });
  console.log(`✅ OTP email → ${toEmail} | ID: ${info.messageId}`);
};

// ═══════════════════════════════════════════════════════
// 2. SOS ALERT EMAIL → Trusted Contacts (with location + map)
// ═══════════════════════════════════════════════════════
const sendSosEmail = async ({ toEmail, toName, senderName, senderPhone, location, mapLink, sentAt }) => {
  const time = sentAt || new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' });

  const info = await transporter.sendMail({
    from:    `"SafeHer Emergency 🆘" <${process.env.MAIL_USER}>`,
    to:      toEmail,
    subject: `🆘 EMERGENCY — ${senderName} needs help RIGHT NOW!`,
    html: `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px">
<table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;border:2px solid #fca5a5">

  <tr><td style="background:#dc2626;padding:28px 32px">
    <p style="color:#fff;margin:0;font-size:26px;font-weight:700">🆘 Emergency Alert</p>
    <p style="color:#fee2e2;margin:6px 0 0;font-size:13px">Sent via SafeHer — Women Safety Platform</p>
  </td></tr>

  <tr><td style="padding:32px">
    <p style="color:#111827;font-size:16px;margin:0 0 6px">Hi <b>${toName || 'there'}</b>,</p>
    <p style="color:#111827;font-size:15px;margin:0 0 24px;line-height:1.7">
      <b style="color:#dc2626">${senderName}</b> has triggered an <b>emergency SOS alert</b>
      and needs your immediate help. Please take action right now!
    </p>

    <!-- Location -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px">
    <tr><td style="background:#fef2f2;border:1px solid #fca5a5;border-radius:10px;padding:20px">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#991b1b">📍 Last Known Location</p>
      <p style="margin:0 0 ${mapLink ? '16px' : '0'};font-size:14px;color:#374151;line-height:1.6">
        ${location || 'Location not available'}
      </p>
      ${mapLink
        ? `<a href="${mapLink}" style="display:inline-block;background:#dc2626;color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:700">
            📍 Open in Google Maps →
           </a>`
        : ''}
    </td></tr></table>

    <!-- Contact Info -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px">
    <tr><td style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:18px">
      <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#9a3412">📱 Her Contact Information</p>
      <p style="margin:0 0 4px;font-size:14px;color:#374151"><b>Name:</b> ${senderName}</p>
      ${senderPhone
        ? `<p style="margin:0;font-size:14px;color:#374151"><b>Phone:</b>
            <a href="tel:${senderPhone}" style="color:#dc2626;text-decoration:none;font-weight:700">${senderPhone}</a>
           </p>`
        : ''}
    </td></tr></table>

    <!-- What to do -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
    <tr><td style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:20px">
      <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#166534">✅ What To Do RIGHT NOW</p>
      <p style="margin:0 0 8px;font-size:14px;color:#374151">1️⃣  Call <b>${senderName}</b> immediately</p>
      <p style="margin:0 0 8px;font-size:14px;color:#374151">2️⃣  If no answer — go to her location or send someone</p>
      <p style="margin:0;font-size:14px;color:#374151">3️⃣  Call emergency services:
        <b style="color:#dc2626;font-size:18px"> 999</b>
      </p>
    </td></tr></table>

    <p style="font-size:12px;color:#9ca3af;margin:0;line-height:1.8">
      Alert sent at: <b>${time}</b><br>
      You received this because <b>${senderName}</b> added you as a trusted contact on SafeHer.
    </p>
  </td></tr>

  <tr><td style="background:#fef2f2;padding:16px 32px;border-top:1px solid #fca5a5">
    <p style="color:#d1d5db;font-size:11px;margin:0;text-align:center">© SafeHer · Women Safety Platform · Bangladesh</p>
  </td></tr>

</table></td></tr></table>
</body></html>`,
  });
  console.log(`✅ SOS email → ${toEmail} (${toName}) | ID: ${info.messageId}`);
};

// ═══════════════════════════════════════════════════════
// 3. NEW REPORT NOTIFICATION → Admin/Team
// ═══════════════════════════════════════════════════════
const sendNewReportEmail = async ({ reportCode, incidentType, location, isAnonymous, contactName }) => {
  const info = await transporter.sendMail({
    from:    `"SafeHer Reports" <${process.env.MAIL_USER}>`,
    to:      process.env.TEAM_EMAIL || process.env.MAIL_USER,
    subject: `📋 New Incident Report — ${reportCode}`,
    html: `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px">
<table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #f9a8d4">

  <tr><td style="background:#ec4899;padding:24px 32px">
    <p style="color:#fff;margin:0;font-size:20px;font-weight:700">📋 New Incident Report</p>
    <p style="color:#fce7f3;margin:4px 0 0;font-size:13px">SafeHer Admin Notification</p>
  </td></tr>

  <tr><td style="padding:28px 32px">
    <p style="color:#374151;font-size:14px;margin:0 0 20px">A new incident report has been submitted and requires your review.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
      <tr style="border-bottom:1px solid #f3f4f6">
        <td style="padding:10px 0;color:#6b7280;width:140px;font-weight:600">Report Code</td>
        <td style="padding:10px 0;font-family:'Courier New',monospace;font-weight:700;font-size:17px;color:#ec4899">${reportCode}</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6">
        <td style="padding:10px 0;color:#6b7280;font-weight:600">Incident Type</td>
        <td style="padding:10px 0;color:#111827;text-transform:capitalize;font-weight:600">${incidentType}</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6">
        <td style="padding:10px 0;color:#6b7280;font-weight:600">Location</td>
        <td style="padding:10px 0;color:#111827">${location || 'Not provided'}</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6">
        <td style="padding:10px 0;color:#6b7280;font-weight:600">Anonymous</td>
        <td style="padding:10px 0">
          ${isAnonymous
            ? '<span style="background:#fef3c7;color:#92400e;padding:3px 12px;border-radius:999px;font-size:12px;font-weight:600">Yes — Anonymous</span>'
            : '<span style="background:#d1fae5;color:#065f46;padding:3px 12px;border-radius:999px;font-size:12px;font-weight:600">No — Contact provided</span>'}
        </td>
      </tr>
      ${!isAnonymous && contactName ? `
      <tr>
        <td style="padding:10px 0;color:#6b7280;font-weight:600">Contact</td>
        <td style="padding:10px 0;color:#111827">${contactName}</td>
      </tr>` : ''}
    </table>
    <p style="color:#9ca3af;font-size:12px;margin:20px 0 0">
      Submitted: <b>${new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })}</b>
    </p>
  </td></tr>

  <tr><td style="background:#fdf2f8;padding:16px 32px;border-top:1px solid #fce7f3">
    <p style="color:#d1d5db;font-size:11px;margin:0;text-align:center">© SafeHer · Admin Panel · Bangladesh</p>
  </td></tr>

</table></td></tr></table>
</body></html>`,
  });
  console.log(`✅ Report notification → ${process.env.TEAM_EMAIL || process.env.MAIL_USER} | Code: ${reportCode} | ID: ${info.messageId}`);
};

module.exports = { sendOTP, sendSosEmail, sendNewReportEmail };