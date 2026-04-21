import jwt from 'jsonwebtoken';
import { createOtp, verifyOtpCode } from '../services/otp.service.js';

const users = new Map();
const otpLoginVerified = new Map();

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const ok = (res, message, data = {}, status = 200) => {
  return res.status(status).json({ success: true, message, data });
};

const issueToken = (user) => jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
  mobile: user.mobile,
});

export const sendOtpHandler = async (req, res, next) => {
  try {
    const { contact, purpose = 'registration', channel = 'email' } = req.body;

    if (channel && channel !== 'email') {
      const err = new Error('Mobile OTP is not supported. Please use Gmail OTP.');
      err.statusCode = 400;
      throw err;
    }

  const normalizedEmail = normalizeEmail(contact);

    if (purpose === 'login') {
  const user = users.get(normalizedEmail);
      if (!user) {
        const err = new Error('User not found. Please register first.');
        err.statusCode = 404;
        throw err;
      }

      if (!user.isVerified) {
        const err = new Error('Please verify your email before login');
        err.statusCode = 403;
        throw err;
      }

  const otpData = await createOtp({ email: normalizedEmail, purpose: 'login' });
      return ok(res, 'OTP sent successfully', {
        email: normalizedEmail,
        purpose: 'login',
        expiresAt: otpData.expiresAt,
      });
    }

    const otpData = await createOtp({ email: normalizedEmail, purpose: 'register' });
    return ok(res, 'OTP sent successfully', {
      email: normalizedEmail,
      purpose: 'registration',
      expiresAt: otpData.expiresAt,
    });
  } catch (error) {
    return next(error);
  }
};

export const registerHandler = async (req, res, next) => {
  try {
    const { email, password, name, mobile } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const existing = users.get(normalizedEmail);
    if (existing?.isVerified) {
      const err = new Error('User already exists with this email');
      err.statusCode = 409;
      throw err;
    }

    const user = {
      id: existing?.id || `user-${Date.now()}`,
      name: name || existing?.name || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      mobile: mobile || existing?.mobile || '',
      password: password || existing?.password || 'changeme123',
      role: 'student',
      isVerified: true,
    };
    users.set(normalizedEmail, user);

    const token = issueToken(user);
    return ok(res, 'Registration successful', { token, user: sanitizeUser(user) }, 201);
  } catch (error) {
    return next(error);
  }
};

export const verifyRegisterOtpHandler = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const result = await verifyOtpCode({ email: normalizedEmail, otp, purpose: 'register' });
    if (!result.ok) {
      const err = new Error(result.reason);
      err.statusCode = 400;
      throw err;
    }

    const user = users.get(normalizedEmail);
    if (user) {
      user.isVerified = true;
      users.set(normalizedEmail, user);
      const token = issueToken(user);
      return ok(res, 'Registration verified successfully', { token, user: sanitizeUser(user) }, 200);
    }

    return ok(res, 'OTP verified successfully', { email: normalizedEmail }, 200);
  } catch (error) {
    return next(error);
  }
};

export const loginPasswordHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

  const user = users.get(normalizedEmail);
    if (!user) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

  const passwordOk = password === user.password;
    if (!passwordOk) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    if (!user.isVerified) {
      const err = new Error('Please verify your email before login');
      err.statusCode = 403;
      throw err;
    }

  const token = issueToken(user);
    return ok(res, 'Login successful', { token, user: sanitizeUser(user) }, 200);
  } catch (error) {
    return next(error);
  }
};

export const sendLoginOtpHandler = async (req, res, next) => {
  try {
    const { email } = req.body;
    const normalizedEmail = normalizeEmail(email);

  const user = users.get(normalizedEmail);
    if (!user) {
      const err = new Error('User not found. Please register first.');
      err.statusCode = 404;
      throw err;
    }

    if (!user.isVerified) {
      const err = new Error('Please verify your email before login');
      err.statusCode = 403;
      throw err;
    }

    const otpData = await createOtp({ email: normalizedEmail, purpose: 'login' });
    return ok(res, 'Login OTP sent successfully', {
      email: normalizedEmail,
      expiresAt: otpData.expiresAt,
    });
  } catch (error) {
    return next(error);
  }
};

export const verifyLoginOtpHandler = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = normalizeEmail(email);

  const user = users.get(normalizedEmail);
    if (!user) {
      const err = new Error('User not found. Please register first.');
      err.statusCode = 404;
      throw err;
    }

    if (!user.isVerified) {
      const err = new Error('Please verify your email before login');
      err.statusCode = 403;
      throw err;
    }

    const result = await verifyOtpCode({ email: normalizedEmail, otp, purpose: 'login' });
    if (!result.ok) {
      const err = new Error(result.reason);
      err.statusCode = 400;
      throw err;
    }

  otpLoginVerified.set(normalizedEmail, Date.now() + 5 * 60 * 1000);
  return ok(res, 'OTP verified successfully', { email: normalizedEmail }, 200);
  } catch (error) {
    return next(error);
  }
};

export const verifyOtpHandler = async (req, res, next) => {
  try {
    const { contact, otp, purpose = 'registration' } = req.body;
    const normalizedEmail = normalizeEmail(contact);

    const verifyPurpose = purpose === 'login' ? 'login' : 'register';
    const result = await verifyOtpCode({ email: normalizedEmail, otp, purpose: verifyPurpose });

    if (!result.ok) {
      const err = new Error(result.reason);
      err.statusCode = 400;
      throw err;
    }

    if (verifyPurpose === 'login') {
      otpLoginVerified.set(normalizedEmail, Date.now() + 5 * 60 * 1000);
    }

    return ok(res, 'OTP verified successfully', { email: normalizedEmail, purpose }, 200);
  } catch (error) {
    return next(error);
  }
};

export const loginOtpHandler = async (req, res, next) => {
  try {
    const { contact, type = 'email' } = req.body;

    if (type !== 'email') {
      const err = new Error('Mobile OTP login is not supported. Please use Gmail OTP.');
      err.statusCode = 400;
      throw err;
    }

    const normalizedEmail = normalizeEmail(contact);
  const user = users.get(normalizedEmail);

    if (!user) {
      const err = new Error('User not found. Please register first.');
      err.statusCode = 404;
      throw err;
    }

    if (!user.isVerified) {
      const err = new Error('Please verify your email before login');
      err.statusCode = 403;
      throw err;
    }

    const verifiedUntil = otpLoginVerified.get(normalizedEmail) || 0;
    if (verifiedUntil < Date.now()) {
      const err = new Error('Please verify OTP first');
      err.statusCode = 401;
      throw err;
    }

    otpLoginVerified.delete(normalizedEmail);
    const token = issueToken(user);
    return ok(res, 'OTP login successful', { token, user: sanitizeUser(user) }, 200);
  } catch (error) {
    return next(error);
  }
};

export const meHandler = async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = users.get(payload.email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    return ok(res, 'User profile fetched', { user: sanitizeUser(user) }, 200);
  } catch (_error) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};