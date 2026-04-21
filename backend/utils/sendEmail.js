import nodemailer from 'nodemailer';

let cachedTransporter = null;

const getTransporter = () => {
  if (cachedTransporter) return cachedTransporter;

  const emailUser = process.env.EMAIL;
  const emailPass = process.env.PASSWORD;

  if (!emailUser || !emailPass) {
    throw new Error('EMAIL and PASSWORD are required in environment variables');
  }

  cachedTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  return cachedTransporter;
};

export const sendEmail = async (email, otp) => {
  if (!email) {
    throw new Error('Recipient email is required');
  }

  if (!otp) {
    throw new Error('OTP is required');
  }

  const transporter = getTransporter();

  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: 'OTP Verification',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937;">
        <h2 style="margin: 0 0 12px;">OTP Verification</h2>
        <p style="margin: 0 0 12px;">Your OTP is:</p>
        <p style="font-size: 24px; font-weight: 700; letter-spacing: 2px; margin: 0 0 12px;">${otp}</p>
        <p style="margin: 0;">This OTP is valid for 5 minutes.</p>
      </div>
    `,
  });

  return { messageId: info.messageId };
};
