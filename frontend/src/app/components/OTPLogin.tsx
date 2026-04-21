import { useState, useEffect, useRef } from 'react';
import { otpService } from '../services/otpService';
import { useAuth } from '../contexts/AuthContext';
import OTPInput from './OTPInput';
import Toast, { ToastType } from './Toast';
import logo from '../../imports/Screenshot_2026-04-16_at_1.54.58_PM-removebg-preview.png';

interface OTPLoginProps {
  onNavigate: (page: string) => void;
  onSuccess: () => void;
}

export default function OTPLogin({ onNavigate, onSuccess }: OTPLoginProps) {
  const { setAuthUser } = useAuth();
  const [loginType, setLoginType] = useState<'mobile' | 'email'>('mobile');
  const [contact, setContact] = useState('');
  const [otp, setOTP] = useState('');
  const [otpSent, setOTPSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  
  // Resend timer
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (otpSent && timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, otpSent]);

  const validateContact = () => {
    if (loginType === 'mobile') {
      if (!/^[6-9]\d{9}$/.test(contact)) {
        setError('Enter valid 10-digit mobile number');
        return false;
      }
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
        setError('Enter valid email address');
        return false;
      }
    }
    return true;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateContact()) return;

    setIsLoading(true);

    try {
      const result = await otpService.sendLoginOTP(contact, loginType);
      
      if (result.success) {
        setOTPSent(true);
        setToast({ message: `OTP sent to your ${loginType}!`, type: 'success' });
        console.log(`🔐 Login OTP for ${contact}:`, result.otp);
        setTimer(30);
        setCanResend(false);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const result = await otpService.sendLoginOTP(contact, loginType);
      if (result.success) {
        setToast({ message: 'OTP resent!', type: 'success' });
        console.log(`🔐 New Login OTP for ${contact}:`, result.otp);
        setTimer(30);
        setCanResend(false);
        setOTP('');
        setOtpError(false);
      }
    } catch (error) {
      setToast({ message: 'Failed to resend OTP', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setToast({ message: 'Please enter 6-digit OTP', type: 'error' });
      return;
    }

    setIsVerifying(true);
    setOtpError(false);

    try {
      const result = await otpService.verifyLoginOTP(contact, loginType, otp);

      if (!result.success) {
        setOtpError(true);
        setToast({ message: result.message, type: 'error' });
        setIsVerifying(false);
        return;
      }

      // Login successful
      if (result.user && result.token) {
        setAuthUser(result.user);
        localStorage.setItem('token', result.token);
        setToast({ message: 'Login successful!', type: 'success' });
        setTimeout(onSuccess, 1500);
      } else if (loginType === 'mobile') {
        // Mock fallback for mobile OTP login
        setToast({ message: 'Mobile login successful!', type: 'success' });
        localStorage.setItem('token', 'session-active');
        setTimeout(onSuccess, 1500);
      } else {
        setToast({ message: 'Login failed: No user data returned', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Verification failed. Please try again.', type: 'error' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLoginTypeChange = (type: 'mobile' | 'email') => {
    setLoginType(type);
    setContact('');
    setOTPSent(false);
    setOTP('');
    setError('');
    setOtpError(false);
  };

  const maskContact = () => {
    if (loginType === 'mobile') {
      return `+91 XXXXX${contact.slice(-4)}`;
    } else {
      const [name, domain] = contact.split('@');
      return `${name[0]}${'*'.repeat(Math.min(name.length - 1, 4))}@${domain}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ECE7D1] via-[#DBCEA5] to-[#ECE7D1] flex items-center justify-center px-4 py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#8E977D] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#8A7650] rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          {/* Logo */}
          <div className="flex items-center justify-center mb-5">
            <div className="relative w-24 h-24 flex items-center justify-center bg-white rounded-2xl shadow-xl p-4">
              <img
                src={logo}
                alt="Gurukul Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className="mb-2">
            <div className="font-bold text-2xl leading-tight text-[#8A7650] tracking-tight" style={{ fontFamily: 'var(--font-family-display)' }}>GURUKUL</div>
            <div className="text-xs text-[#8E977D] font-semibold tracking-widest">THE INSTITUTE</div>
          </div>
          <p className="text-lg text-muted-foreground">
            Login with OTP - No password needed
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-border" style={{ animation: 'fadeInUp 0.6s ease-out 0.1s backwards' }}>
          {!otpSent ? (
            <>
              {/* Login Type Toggle */}
              <div className="mb-6">
                <div className="flex gap-2 p-1.5 bg-muted rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleLoginTypeChange('mobile')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                      loginType === 'mobile'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    📱 Mobile
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoginTypeChange('email')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                      loginType === 'email'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    📧 Email
                  </button>
                </div>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-6">
                {/* Contact Input */}
                <div>
                  <label className="block mb-2 font-semibold text-primary flex items-center gap-2">
                    <span className="text-xl">{loginType === 'mobile' ? '📱' : '📧'}</span>
                    <span>{loginType === 'mobile' ? 'Mobile Number' : 'Email Address'}</span>
                  </label>
                  {loginType === 'mobile' ? (
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={contact}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setContact(value);
                          setError('');
                        }}
                        placeholder="10-digit mobile number"
                        className={`w-full pl-16 pr-5 py-4 border-2 rounded-xl bg-input-background focus:outline-none transition-all text-lg ${
                          error
                            ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : 'border-border focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                        }`}
                      />
                    </div>
                  ) : (
                    <input
                      type="email"
                      value={contact}
                      onChange={(e) => {
                        setContact(e.target.value);
                        setError('');
                      }}
                      placeholder="your.email@example.com"
                      className={`w-full px-5 py-4 border-2 rounded-xl bg-input-background focus:outline-none transition-all text-lg ${
                        error
                          ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                          : 'border-border focus:border-green-500 focus:ring-4 focus:ring-green-100'
                      }`}
                    />
                  )}
                  {error && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </p>
                  )}
                </div>

                {/* Send OTP Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full text-white font-bold py-5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 ${
                    loginType === 'mobile'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/30'
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/30'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleVerifyLogin} className="space-y-6">
              {/* OTP Sent To */}
              <div className="text-center p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <p className="text-sm text-blue-900 font-medium mb-1">
                  OTP sent to
                </p>
                <p className="text-lg font-bold text-blue-600">
                  {maskContact()}
                </p>
              </div>

              {/* OTP Input */}
              <div>
                <label className="block mb-3 font-semibold text-primary text-center">
                  Enter 6-Digit OTP
                </label>
                <OTPInput
                  length={6}
                  value={otp}
                  onChange={setOTP}
                  disabled={isVerifying}
                  error={otpError}
                />

                {/* Resend OTP */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Resending...' : '🔄 Resend OTP'}
                    </button>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Resend OTP in <span className="font-bold text-blue-600">{timer}s</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isVerifying || otp.length !== 6}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold py-5 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all hover:scale-[1.02] text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Login</span>
                  </>
                )}
              </button>

              {/* Change Contact */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setOTPSent(false);
                    setOTP('');
                    setOtpError(false);
                  }}
                  className="text-muted-foreground hover:text-primary font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Change {loginType}</span>
                </button>
              </div>
            </form>
          )}

          {/* Registration Link */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-muted-foreground mb-3">
              Don't have an account?
            </p>
            <button
              onClick={() => onNavigate('otp-register')}
              className="w-full text-green-600 hover:text-green-700 font-semibold text-lg transition-colors flex items-center justify-center gap-2 py-3 px-6 border-2 border-green-200 hover:border-green-300 rounded-xl hover:bg-green-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Create New Account</span>
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center p-4 bg-white/80 backdrop-blur rounded-2xl border border-border">
          <p className="text-sm text-muted-foreground">
            📞 Need help? Call: <a href="tel:+919818034565" className="text-blue-600 hover:underline font-semibold">+91 98180 34565</a>
          </p>
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