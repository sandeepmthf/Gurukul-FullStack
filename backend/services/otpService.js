const otpStore = new Map();

export const createOTP = (email, type) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(email, {
    otp,
    type,
    expires: Date.now() + 5 * 60 * 1000,
  });

  return otp;
};

export const verifyOTP = (email, otp, type) => {
  const data = otpStore.get(email);

  if (!data) return false;
  if (data.type !== type) return false;
  if (Date.now() > data.expires) return false;
  if (data.otp !== otp) return false;

  otpStore.delete(email);
  return true;
};
