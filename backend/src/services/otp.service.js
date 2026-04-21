const otpStore = new Map();

const keyFor = (email, purpose) => `${String(email).toLowerCase()}::${purpose}`;

export const createOtp = async ({ email, purpose }) => {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  otpStore.set(keyFor(email, purpose), { otp, expiresAt });

  const showDevOtp = String(process.env.DEV_OTP_IN_RESPONSE || 'true') === 'true';
  return {
    expiresAt,
    ...(showDevOtp ? { devOtp: otp } : {}),
  };
};

export const verifyOtpCode = async ({ email, otp, purpose }) => {
  const key = keyFor(email, purpose);
  const saved = otpStore.get(key);

  if (!saved) return { ok: false, reason: 'OTP not found' };
  if (saved.expiresAt.getTime() < Date.now()) {
    otpStore.delete(key);
    return { ok: false, reason: 'OTP expired' };
  }

  if (String(saved.otp) !== String(otp)) {
    return { ok: false, reason: 'Invalid OTP' };
  }

  otpStore.delete(key);
  return { ok: true };
};
