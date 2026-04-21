import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createOTP, verifyOTP } from '../services/otpService.js';
import { sendEmail } from '../utils/sendEmail.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const sanitizeUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  mobile: user.mobile || '',
  batch: user.batch || '',
  isVerified: user.isVerified,
  role: 'student',
});

router.post('/register/send-otp', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const otp = createOTP(email, 'register');
    await sendEmail(email, otp);

    return res.json({ success: true, message: 'OTP sent for registration' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to send OTP' });
  }
});

router.post('/register/verify', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');
    const mobile = String(req.body.mobile || '').trim();
    const batch = String(req.body.batch || '').trim();
    const otp = String(req.body.otp || '');

    if (!name || !email || !password || otp.length !== 6) {
      return res.status(400).json({ success: false, message: 'Name, email, password and 6-digit OTP are required' });
    }

    const valid = verifyOTP(email, otp, 'register');
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      mobile,
      batch,
      isVerified: true,
    });

    return res.status(201).json({ 
      success: true, 
      user: sanitizeUser(user),
      token: generateToken(user._id)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
});

router.post('/login/send-otp', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = createOTP(email, 'login');
    await sendEmail(email, otp);

    return res.json({ success: true, message: 'OTP sent for login' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to send OTP' });
  }
});

router.post('/login/verify', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || '');

    if (!email || otp.length !== 6) {
      return res.status(400).json({ success: false, message: 'Email and 6-digit OTP are required' });
    }

    const valid = verifyOTP(email, otp, 'login');
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ 
      success: true, 
      user: sanitizeUser(user),
      token: generateToken(user._id)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
});

router.post('/forgot/send-otp', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = createOTP(email, 'reset');
    await sendEmail(email, otp);

    return res.json({ success: true, message: 'OTP sent for password reset' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to send OTP' });
  }
});

router.post('/forgot/reset', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || '');
    const newPassword = String(req.body.newPassword || '');

    if (!email || otp.length !== 6 || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, 6-digit OTP and new password are required' });
    }

    const valid = verifyOTP(email, otp, 'reset');
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    const result = await User.updateOne({ email }, { password: newPassword });
    if (!result.matchedCount) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Password reset failed' });
  }
});

router.post('/login-password', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    return res.json({ 
      success: true, 
      user: sanitizeUser(user),
      token: generateToken(user._id)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
});

export default router;
