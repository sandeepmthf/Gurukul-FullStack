import { useState, useEffect } from 'react';
import OTPInput from './OTPInput';
import Toast, { ToastType } from './Toast';
import { otpService } from '../services/otpService';
import { useAuth } from '../contexts/AuthContext';

interface OTPVerificationProps {
  registrationData: {
    name: string;
    mobile: string;
    email: string;
    mobileOTP: string;
    emailOTP: string;
  };
  onNavigate: (page: string) => void;
  onSuccess: () => void;
}

export default function OTPVerification({ registrationData, onNavigate, onSuccess }: OTPVerificationProps) {
  const { register } = useAuth();
  const [mobileOTP, setMobileOTP] = useState('');
  const [emailOTP, setEmailOTP] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errors, setErrors] = useState({ mobile: false, email: false });
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  
  // Resend timers
  const [mobileTimer, setMobileTimer] = useState(30);
  const [emailTimer, setEmailTimer] = useState(30);
  const [canResendMobile, setCanResendMobile] = useState(false);
  const [canResendEmail, setCanResendEmail] = useState(false);
  const [isResending, setIsResending] = useState({ mobile: false, email: false });

  // Countdown timers
  useEffect(() => {
    if (mobileTimer > 0) {
      const timer = setTimeout(() => setMobileTimer(mobileTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResendMobile(true);
    }
  }, [mobileTimer]);

  useEffect(() => {
    if (emailTimer > 0) {
      const timer = setTimeout(() => setEmailTimer(emailTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResendEmail(true);
    }
  }, [emailTimer]);

  const maskMobile = (mobile: string) => {
    return `+91 XXXXX${mobile.slice(-4)}`;
  };

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    return `${name[0]}${'*'.repeat(Math.min(name.length - 1, 4))}@${domain}`;
  };

  const handleResendMobileOTP = async () => {
    setIsResending({ ...isResending, mobile: true });
    try {
      const result = await otpService.sendMobileOTP(registrationData.mobile);
      if (result.success) {
        setToast({ message: 'Mobile OTP resent!', type: 'success' });
        console.log('📱 New Mobile OTP:', result.otp);
        setMobileTimer(30);
        setCanResendMobile(false);
      }
    } catch (error) {
      setToast({ message: 'Failed to resend OTP', type: 'error' });
    } finally {
      setIsResending({ ...isResending, mobile: false });
    }
  };

  const handleResendEmailOTP = async () => {
    setIsResending({ ...isResending, email: true });
    try {
      const result = await otpService.sendEmailOTP(registrationData.email);
      if (result.success) {
        setToast({ message: 'Email OTP resent!', type: 'success' });
        console.log('📧 New Email OTP:', result.otp);
        setEmailTimer(30);
        setCanResendEmail(false);
      }
    } catch (error) {
      setToast({ message: 'Failed to resend OTP', type: 'error' });
    } finally {
      setIsResending({ ...isResending, email: false });
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mobileOTP.length !== 6 || emailOTP.length !== 6) {
      setToast({ message: 'Please enter both 6-digit OTPs', type: 'error' });
      return;
    }

    setIsVerifying(true);
    setErrors({ mobile: false, email: false });

    try {
      // Verify both OTPs
      const [mobileResult, emailResult] = await Promise.all([
        otpService.verifyMobileOTP(registrationData.mobile, mobileOTP),
        otpService.verifyEmailOTP(registrationData.email, emailOTP),
      ]);

      if (!mobileResult.success || !emailResult.success) {
        setErrors({
          mobile: !mobileResult.success,
          email: !emailResult.success,
        });
        
        const errorMsg = !mobileResult.success && !emailResult.success
          ? 'Both OTPs are invalid'
          : !mobileResult.success
          ? 'Mobile OTP is invalid'
          : 'Email OTP is invalid';
        
        setToast({ message: errorMsg, type: 'error' });
        setIsVerifying(false);
        return;
      }

      // Both verified - create account
      const result = await register({
        name: registrationData.name,
        email: registrationData.email,
        mobile: registrationData.mobile,
        password: '', // No password needed for OTP registration
        role: 'student',
      });

      if (result.success) {
        setToast({ message: 'Account created successfully!', type: 'success' });
        setTimeout(onSuccess, 1500);
      } else {
        setToast({ message: result.error || 'Registration failed', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Verification failed. Please try again.', type: 'error' });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ECE7D1] via-[#DBCEA5] to-[#ECE7D1] flex items-center justify-center px-4 py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#8E977D] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#8A7650] rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#8A7650] to-[#8E977D] rounded-3xl mb-5 shadow-xl shadow-[#8A7650]/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-bold text-4xl mb-2 bg-gradient-to-r from-[#8A7650] to-[#8E977D] bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-family-display)' }}>
            Verify OTP
          </h1>
          <p className="text-lg text-[#8A7650]/80">
            Enter the codes sent to your mobile and email
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-[#ECE7D1] rounded-3xl shadow-2xl p-8 md:p-10 border border-[#DBCEA5]" style={{ animation: 'fadeInUp 0.6s ease-out 0.1s backwards' }}>
          <form onSubmit={handleVerify} className="space-y-8">
            {/* Mobile OTP */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold text-primary flex items-center gap-2">
                  <span className="text-xl">📱</span>
                  <span>Mobile OTP</span>
                </label>
                <span className="text-sm text-muted-foreground font-medium">
                  {maskMobile(registrationData.mobile)}
                </span>
              </div>
              
              <OTPInput
                length={6}
                value={mobileOTP}
                onChange={setMobileOTP}
                disabled={isVerifying}
                error={errors.mobile}
              />

              {/* Resend Mobile OTP */}
              <div className="mt-3 flex items-center justify-center gap-2">
                {canResendMobile ? (
                  <button
                    type="button"
                    onClick={handleResendMobileOTP}
                    disabled={isResending.mobile}
                    className="text-[#8A7650] hover:text-[#8A7650]/80 font-semibold text-sm transition-colors disabled:opacity-50"
                  >
                    {isResending.mobile ? 'Resending...' : '🔄 Resend Mobile OTP'}
                  </button>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Resend OTP in <span className="font-bold text-[#8A7650]">{mobileTimer}s</span>
                  </span>
                )}
              </div>
            </div>

            {/* Email OTP */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold text-primary flex items-center gap-2">
                  <span className="text-xl">📧</span>
                  <span>Email OTP</span>
                </label>
                <span className="text-sm text-muted-foreground font-medium">
                  {maskEmail(registrationData.email)}
                </span>
              </div>
              
              <OTPInput
                length={6}
                value={emailOTP}
                onChange={setEmailOTP}
                disabled={isVerifying}
                error={errors.email}
              />

              {/* Resend Email OTP */}
              <div className="mt-3 flex items-center justify-center gap-2">
                {canResendEmail ? (
                  <button
                    type="button"
                    onClick={handleResendEmailOTP}
                    disabled={isResending.email}
                    className="text-[#8A7650] hover:text-[#8A7650]/80 font-semibold text-sm transition-colors disabled:opacity-50"
                  >
                    {isResending.email ? 'Resending...' : '🔄 Resend Email OTP'}
                  </button>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Resend OTP in <span className="font-bold text-[#8A7650]">{emailTimer}s</span>
                  </span>
                )}
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isVerifying || mobileOTP.length !== 6 || emailOTP.length !== 6}
              className="w-full bg-gradient-to-r from-[#8A7650] to-[#8E977D] hover:from-[#8A7650]/90 hover:to-[#8E977D]/90 text-white font-bold py-5 px-6 rounded-xl shadow-lg shadow-[#8A7650]/30 hover:shadow-xl transition-all hover:scale-[1.02] text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Verify & Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-5 bg-[#ECE7D1] border-2 border-[#DBCEA5] rounded-2xl">
            <div className="flex gap-3">
              <div className="text-2xl">💡</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#8A7650] mb-1">
                  Demo Mode Active
                </p>
                <p className="text-sm text-[#8A7650]/70">
                  Check browser console for OTP codes. In production, OTPs will be sent via SMS and email.
                </p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate('otp-register')}
              className="text-muted-foreground hover:text-primary font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Change details</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}