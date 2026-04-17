// backend/testEmail.js
// Run: node testEmail.js

require('dotenv').config();
const { sendOTP, sendSosEmail, sendNewReportEmail } = require('./utils/mailer');

async function run() {
  const me = process.env.MAIL_USER;

  console.log('\n🔧 Email Config');
  console.log('══════════════════════════════════════');
  console.log(`MAIL_USER : ${me || '❌ NOT SET'}`);
  console.log(`MAIL_PASS : ${process.env.MAIL_PASS ? `✅ Set (${process.env.MAIL_PASS.length} chars)` : '❌ NOT SET'}`);
  console.log('══════════════════════════════════════\n');

  if (!me || !process.env.MAIL_PASS) {
    console.log('❌ Set MAIL_USER and MAIL_PASS in .env first!\n');
    process.exit(1);
  }

  // Test 1: OTP
  try {
    console.log('Test 1: OTP email...');
    await sendOTP(me, '847291', 'Shompa');
    console.log('✅ OTP email sent!\n');
  } catch (e) {
    console.log(`❌ OTP failed: ${e.message}`);
    if (e.message.includes('Invalid login') || e.message.includes('Username and Password')) {
      console.log('\n⚠️  FIX: Use Gmail APP PASSWORD (not your normal password)');
      console.log('   1. Go to: myaccount.google.com');
      console.log('   2. Security → 2-Step Verification → App Passwords');
      console.log('   3. Generate for "Mail" → copy 16-char password');
      console.log('   4. Paste in .env as MAIL_PASS=xxxx xxxx xxxx xxxx\n');
    }
  }

  // Test 2: SOS email
  try {
    console.log('Test 2: SOS alert email...');
    await sendSosEmail({
      toEmail:     me,
      toName:      'Test Contact',
      senderName:  'Shompa Akter',
      senderPhone: '01762254990',
      location:    'Tilagoar, Sylhet, Bangladesh',
      mapLink:     'https://maps.google.com/?q=24.8949,91.8687',
      sentAt:      new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' }),
    });
    console.log('✅ SOS email sent!\n');
  } catch (e) {
    console.log(`❌ SOS email failed: ${e.message}\n`);
  }

  // Test 3: Report notification
  try {
    console.log('Test 3: Report notification email...');
    await sendNewReportEmail({
      reportCode:   'SH-TEST1234',
      incidentType: 'harassment',
      location:     'Sylhet, Bangladesh',
      isAnonymous:  false,
      contactName:  'Shompa Akter',
    });
    console.log('✅ Report notification sent!\n');
  } catch (e) {
    console.log(`❌ Report notification failed: ${e.message}\n`);
  }

  console.log(`✅ Done! Check inbox: ${me}\n`);
}

run();