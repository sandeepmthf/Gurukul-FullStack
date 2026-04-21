import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../../services/api';
import OTPInput from './OTPInput';
import logo from '../../imports/Screenshot_2026-04-16_at_1.54.58_PM-removebg-preview.png';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const { login, setAuthUser } = useAuth();
  const [mode, setMode] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!otpSent || timer <= 0) {
      setCanResend(timer <= 0);
      return;
    }

    const timeout = setTimeout(() => setTimer((prev: number) => prev - 1), 1000);
    return () => clearTimeout(timeout);
  }, [otpSent, timer]);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setError('Please enter a valid Gmail/email address');
      return;
    }

    setIsLoading(true);
    setError('');

    const localTeachers = JSON.parse(localStorage.getItem('gurukul_teachers') || '[]');
    const isTeacher = localTeachers.some((t: any) => t.email === email && t.password === password);

    // Handle Admin master account and Teachers directly on frontend to bypass backend API which does not have it natively registered.
    if ((email === 'admin@gurukul.com' && password === 'admin@123') || isTeacher) {
      const result = await login(email, password);
      if (result.success) {
        onNavigate('admin');
      } else {
        setError(result.error || 'Login failed');
      }
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.token) localStorage.setItem('token', data.token);
        if (data.user) {
          setAuthUser(data.user);
        }
        onNavigate('dashboard');
      } else {
        setError(data.message || data.error || 'Login failed');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setError('Please enter a valid Gmail/email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/login/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setTimer(30);
        setCanResend(false);
      } else {
        setError(data.message || data.error || 'Failed to send OTP');
      }
    } catch (err: any) {
      setError('Could not send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/login/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('token', 'session-active');
        if (data.user) {
          setAuthUser(data.user);
        }
        onNavigate('dashboard');
      } else {
        setError(data.message || data.error || 'Invalid OTP');
      }
    } catch (err: any) {
      setError('OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || isLoading) return;

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5001/api/auth/login/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setTimer(30);
        setCanResend(false);
        setOtp('');
      } else {
        setError(data.message || data.error || 'Failed to resend OTP');
      }
    } catch (err: any) {
      setError('Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeMode = (nextMode: 'password' | 'otp') => {
    setMode(nextMode);
    setError('');
    setOtp('');
    setOtpSent(false);
    setTimer(30);
    setCanResend(false);
  };

  const handleSkipLogin = () => {
    onNavigate('home');
  };

  const handleEmailChange = (value: string) => {
    setEmail(value.trim());
    setError('');
    if (otpSent) {
      setOtpSent(false);
      setOtp('');
      setTimer(30);
      setCanResend(false);
    }
  };

  const inputClassName =
    'w-full px-4 py-3.5 border-2 border-border rounded-xl bg-input-background focus:border-[#8A7650] focus:ring-4 focus:ring-[#8A7650]/10 focus:outline-none transition-all text-base hover:border-[#8A7650]/50';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ECE7D1] via-[#DBCEA5] to-[#ECE7D1] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#8E977D] rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#8A7650] rounded-full blur-3xl" style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-border" style={{ animation: 'fadeInUp 0.6s ease-out 0.1s backwards' }}>
          {/* Header with Logo */}
          <div className="text-center mb-6 md:mb-7">
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-18 h-18 md:w-20 md:h-20 flex items-center justify-center bg-white rounded-2xl shadow-lg p-3">
                <img
                  src={logo}
                  alt="Gurukul Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h1 className="font-bold text-2xl md:text-3xl text-primary mb-1" style={{ fontFamily: 'var(--font-family-display)' }}>
              Welcome Back
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Login to access your account
            </p>
          </div>

          <div className="mb-5">
            <div className="flex gap-2 p-1.5 bg-muted rounded-xl">
              <button
                type="button"
                onClick={() => handleChangeMode('password')}
                className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-sm md:text-base transition-all ${
                  mode === 'password'
                    ? 'bg-gradient-to-r from-[#8A7650] to-[#8E977D] text-white shadow-lg'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => handleChangeMode('otp')}
                className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-sm md:text-base transition-all ${
                  mode === 'otp'
                    ? 'bg-gradient-to-r from-[#8A7650] to-[#8E977D] text-white shadow-lg'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Login via OTP
              </button>
            </div>
          </div>

          {mode === 'password' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
            {/* Header with Logo */}
            {/* Email */}
            <div>
              <label className="block mb-2 text-primary font-semibold text-sm md:text-base flex items-center gap-2">
                <span>📧</span>
                Gmail / Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                required
                placeholder="Enter your Gmail"
                className={inputClassName}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-primary font-semibold text-sm md:text-base flex items-center gap-2">
                <span>🔒</span>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required
                placeholder="Enter your password"
                className={inputClassName}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-sm text-[#8A7650] hover:text-[#8A7650]/80 font-semibold transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-semibold flex items-center gap-2">
                  <span>⚠️</span>
                  {error}
                </p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#8A7650] to-[#8E977D] hover:from-[#8A7650]/90 hover:to-[#8E977D]/90 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-[#8A7650]/30 hover:shadow-xl hover:shadow-[#8A7650]/40 transition-all hover:scale-[1.01] text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
            </form>
          ) : (
            <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} className="space-y-5">
              <div>
                <label className="block mb-2 text-primary font-semibold text-sm md:text-base flex items-center gap-2">
                  <span>📧</span>
                  Gmail / Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  required
                  placeholder="Enter your Gmail"
                  className={inputClassName}
                />
              </div>

              {otpSent && (
                <div>
                  <label className="block mb-3 text-primary font-semibold text-sm md:text-base text-center">
                    Enter 6-digit OTP
                  </label>
                  <OTPInput
                    length={6}
                    value={otp}
                    onChange={setOtp}
                    disabled={isLoading}
                    error={Boolean(error && otp.length > 0)}
                  />
                  <div className="mt-4 flex items-center justify-center gap-2">
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={isLoading}
                        className="text-[#8A7650] hover:text-[#8A7650]/80 font-semibold text-sm transition-colors disabled:opacity-50"
                      >
                        {isLoading ? 'Resending...' : '🔄 Resend OTP'}
                      </button>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Resend OTP in <span className="font-bold text-[#8A7650]">{timer}s</span>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm font-semibold flex items-center gap-2">
                    <span>⚠️</span>
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || (otpSent && otp.length !== 6)}
                className="w-full bg-gradient-to-r from-[#8A7650] to-[#8E977D] hover:from-[#8A7650]/90 hover:to-[#8E977D]/90 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-[#8A7650]/30 hover:shadow-xl hover:shadow-[#8A7650]/40 transition-all hover:scale-[1.01] text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>{otpSent ? 'Verifying OTP...' : 'Sending OTP...'}</span>
                  </>
                ) : (
                  <>
                    <span>{otpSent ? 'Login with OTP' : 'Send OTP'}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Registration Link */}
          <div className="mt-7 text-center p-4 md:p-5 bg-muted rounded-2xl">
            <p className="text-sm md:text-base text-muted-foreground mb-2">
              Don't have an account?
            </p>
            <button
              onClick={() => onNavigate('register')}
              className="text-[#8A7650] hover:text-[#8A7650]/80 font-semibold text-base transition-colors flex items-center justify-center gap-1 mx-auto group"
            >
              <span>Register Now</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <button
              onClick={handleSkipLogin}
              className="mt-3 text-[#8A7650] hover:text-[#8A7650]/80 font-semibold text-sm md:text-base transition-colors"
            >
              Skip login and continue as guest
            </button>
          </div>

          {/* Help */}
          <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground text-center">
              📞 Need help? Call: <a href="tel:+919818034565" className="text-[#8A7650] hover:underline font-semibold">98180 34565</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
