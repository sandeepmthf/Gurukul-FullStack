import express from 'express';
import {
  loginOtpHandler,
  loginPasswordHandler,
  meHandler,
  registerHandler,
  sendLoginOtpHandler,
  sendOtpHandler,
  verifyLoginOtpHandler,
  verifyOtpHandler,
  verifyRegisterOtpHandler,
} from '../controllers/auth.controller.js';

const router = express.Router();
router.post('/register', registerHandler);
router.post('/verify-register-otp', verifyRegisterOtpHandler);
router.post('/login-password', loginPasswordHandler);
router.post('/send-login-otp', sendLoginOtpHandler);
router.post('/verify-login-otp', verifyLoginOtpHandler);
router.post('/send-otp', sendOtpHandler);
router.post('/verify-otp', verifyOtpHandler);
router.post('/login-otp', loginOtpHandler);
router.get('/me', meHandler);

export default router;