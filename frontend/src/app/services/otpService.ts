// OTP Service - Uses API calls to Node Backend for email OTP
// Mobile OTP uses mock (no SMS backend configured yet)

import { API_BASE_URL } from '../../services/api';

// In-memory mock store for mobile OTPs (no SMS backend yet)
const mockMobileOTPs = new Map<string, string>();

export const otpService = {
  // ─── Email OTP (Real - via backend + Nodemailer) ───

  // Send email OTP for registration
  sendEmailOTP: async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      return { success: data.success, message: data.message || "OTP sent", otp: '' };
    } catch (error) {
      return { success: false, message: "Network error sending OTP", otp: '' };
    }
  },

  // Verify email OTP for registration
  verifyEmailOTP: async (email: string, otp: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, name: 'temp', password: 'temp123' })
      });
      const data = await response.json();
      // We only care if the OTP is valid; the actual registration is handled separately
      return { success: data.success || response.ok, message: data.message || "Verified" };
    } catch (error) {
      return { success: false, message: "Network error verifying OTP" };
    }
  },

  // ─── Mobile OTP (Mock - no SMS provider configured) ───

  sendMobileOTP: async (mobile: string) => {
    // Generate a mock 6-digit OTP for mobile (no SMS backend yet)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    mockMobileOTPs.set(mobile, otp);
    console.log(`📱 [Mock] Mobile OTP for ${mobile}: ${otp}`);
    return { success: true, message: 'Mobile OTP sent (mock)', otp };
  },

  verifyMobileOTP: async (mobile: string, otp: string) => {
    const stored = mockMobileOTPs.get(mobile);
    if (stored && stored === otp) {
      mockMobileOTPs.delete(mobile);
      return { success: true, message: 'Mobile OTP verified', user: null, token: null };
    }
    return { success: false, message: 'Invalid mobile OTP', user: null, token: null };
  },

  // ─── Login OTP (Real - via backend) ───

  sendLoginOTP: async (contact: string, type: 'mobile' | 'email') => {
    if (type === 'mobile') {
      // Mock mobile OTP for login
      return await otpService.sendMobileOTP(contact);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: contact })
      });
      const data = await response.json();
      return { success: data.success, message: data.message || "OTP sent", otp: '' };
    } catch (error) {
      return { success: false, message: "Network error sending OTP", otp: '' };
    }
  },

  verifyLoginOTP: async (contact: string, type: 'mobile' | 'email', otp: string) => {
    if (type === 'mobile') {
      return await otpService.verifyMobileOTP(contact, otp);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: contact, otp })
      });
      const data = await response.json();
      return { success: data.success, message: data.message || "Verified", user: data.user, token: data.token };
    } catch (error) {
      return { success: false, message: "Network error verifying OTP", user: null, token: null };
    }
  }
};
