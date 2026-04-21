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
    from: `"Gurukul – The Institute" <${process.env.EMAIL}>`,
    to: email,
    subject: '🔐 Your Gurukul OTP Verification Code',
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 480px; margin: 0 auto; background: #f9f6f0; border-radius: 12px; overflow: hidden; border: 1px solid #e0d9cd;">
        <div style="background: #3b5c3a; padding: 28px 32px; text-align: center;">
          <h1 style="color: #d4a853; margin: 0; font-size: 26px; letter-spacing: 2px;">GURUKUL</h1>
          <p style="color: #c8b99a; margin: 6px 0 0; font-size: 13px; letter-spacing: 1px;">THE INSTITUTE</p>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #1f2937; margin: 0 0 12px; font-size: 20px;">Email Verification</h2>
          <p style="color: #4b5563; margin: 0 0 24px; line-height: 1.6;">
            Welcome to Gurukul – The Institute! Use the OTP below to complete your verification. 
            This code is valid for <strong>5 minutes</strong>.
          </p>
          <div style="background: #3b5c3a; border-radius: 10px; padding: 20px; text-align: center; margin: 0 0 24px;">
            <p style="color: #c8b99a; margin: 0 0 8px; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">Your OTP Code</p>
            <p style="color: #d4a853; font-size: 42px; font-weight: 700; letter-spacing: 10px; margin: 0;">${otp}</p>
          </div>
          <p style="color: #6b7280; font-size: 13px; margin: 0; line-height: 1.6;">
            ⚠️ Do not share this OTP with anyone. If you did not request this, please ignore this email.
          </p>
        </div>
        <div style="background: #e8e0d4; padding: 16px 32px; text-align: center;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            © 2026 Gurukul – The Institute | Saidpur Village, New Delhi<br>
            <a href="https://www.gurukultheinstitute.in" style="color: #3b5c3a; text-decoration: none;">www.gurukultheinstitute.in</a>
          </p>
        </div>
      </div>
    `,
  });

  return { messageId: info.messageId };
};
