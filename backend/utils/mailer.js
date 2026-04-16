const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendOTP = async (email, otp, name) => {
  await transporter.sendMail({
    from: `"SafeHer" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'SafeHer - Your Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #ec4899;">SafeHer 🛡️</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your verification code is:</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
          <h1 style="color: #ec4899; letter-spacing: 10px; font-size: 40px;">${otp}</h1>
        </div>
        <p>This code expires in <strong>5 minutes</strong>.</p>
        <p>Do not share this code with anyone.</p>
        <p style="color: #9ca3af; font-size: 12px;">- SafeHer Team</p>
      </div>
    `,
  });
};

module.exports = { sendOTP };