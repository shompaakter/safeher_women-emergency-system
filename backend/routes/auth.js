const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { sendOTP } = require('../utils/mailer');

const otpStore = new Map();

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

router.post('/send-otp', async (req, res) => {
  try {
    const { phone, email, name } = req.body;

    if (!phone || !email || !name) {
      return res.status(400).json({ message: 'Name, email, and phone are required.' });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(409).json({ message: 'This phone number is already registered.' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: 'This email is already registered.' });
    }

    const otp       = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore.set(phone, { otp, expiresAt, name, email });

    console.log(`📧 OTP for ${email} (${phone}): ${otp}`);

    await sendOTP(email, otp, name);

    res.json({ message: 'OTP sent to your email. Valid for 5 minutes.' });

  } catch (err) {
    console.error('send-otp error:', err);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
});
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, otp } = req.body;

    if (!name || !email || !phone || !password || !otp) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const stored = otpStore.get(phone);
    if (!stored) {
      return res.status(400).json({ message: 'OTP not found. Please request a new one.' });
    }
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(phone);
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }
    if (stored.otp !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    otpStore.delete(phone);

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      phone,
      password:   hashedPassword,
      isVerified: true,
    });
    await user.save();

    console.log(`✅ Registered: ${name} (${phone})`);

    res.status(201).json({ message: 'Account created successfully. Please log in.' });

  } catch (err) {
    console.error('register error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Phone or email already registered.' });
    }
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required.' });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: 'Invalid phone number or password.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Account not verified. Please register again.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid phone number or password.' });
    }

    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`✅ Login: ${user.name} (${phone})`);

    res.json({
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email.' });
    }

    const otp       = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore.set(email, { otp, expiresAt, userId: user._id });

    console.log(`📧 Forgot-password OTP for ${email}: ${otp}`);

    await sendOTP(email, otp, user.name);

    res.json({ message: 'Password reset OTP sent to your email.' });

  } catch (err) {
    console.error('forgot-password error:', err);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const stored = otpStore.get(email);
    if (!stored) {
      return res.status(400).json({ message: 'OTP not found. Please request a new one.' });
    }
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }
    if (stored.otp !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    otpStore.delete(email);

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(stored.userId, { password: hashedPassword });

    console.log(`✅ Password reset for ${email}`);

    res.json({ message: 'Password reset successfully. Please log in.' });

  } catch (err) {
    console.error('reset-password error:', err);
    res.status(500).json({ message: 'Failed to reset password. Please try again.' });
  }
});

module.exports = router;