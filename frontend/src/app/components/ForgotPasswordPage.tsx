import { useState } from 'react';
import OTPInput from './OTPInput';
import { API_BASE_URL } from '../../services/api';
import logo from '../../imports/Screenshot_2026-04-16_at_1.54.58_PM-removebg-preview.png';

interface ForgotPasswordPageProps {
  onNavigate: (page: string) => void;
}

type Step = 'email' | 'otp' | 'reset' | 'success';

export default function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const inputClassName =
    'w-full px-4 py-3.5 border-2 border-border rounded-xl bg-input-background focus:border-[#8A7650] focus:ring-4 focus:ring-[#8A7650]/10 focus:outline-none transition-all text-base hover:border-[#8A7650]/50';

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setStep('otp');
        setMessage('OTP sent to your email address');
      } else {
        setError(data.message || data.error || 'Failed to send OTP');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setStep('reset');
    setMessage('OTP captured. Now set your new password.');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });

      if (response.ok) {
        setStep('success');
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || data.error || 'Invalid OTP or reset failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ECE7D1] via-[#DBCEA5] to-[#ECE7D1] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#8E977D] rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#8A7650] rounded-full blur-3xl" style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-border" style={{ animation: 'fadeInUp 0.6s ease-out 0.1s backwards' }}>
          <div className="text-center mb-6 md:mb-7">
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-18 h-18 md:w-20 md:h-20 flex items-center justify-center bg-white rounded-2xl shadow-lg p-3">
                <img src={logo} alt="Gurukul Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <h1 className="font-bold text-2xl md:text-3xl text-primary mb-1" style={{ fontFamily: 'var(--font-family-display)' }}>
              Forgot Password
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Recover your account in a few quick steps
            </p>
          </div>

          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block mb-2 text-primary font-semibold text-sm md:text-base flex items-center gap-2">
                  <span>📧</span>
                  Gmail / Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value.trim());
                    setError('');
                  }}
                  required
                  placeholder="Enter your registered email"
                  className={inputClassName}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#8A7650] to-[#8E977D] hover:from-[#8A7650]/90 hover:to-[#8E977D]/90 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-[#8A7650]/30 hover:shadow-xl hover:shadow-[#8A7650]/40 transition-all hover:scale-[1.01] text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block mb-3 text-primary font-semibold text-sm md:text-base text-center">
                  Enter 6-digit OTP
                </label>
                <OTPInput
                  length={6}
                  value={otp}
                  onChange={(value) => {
                    setOtp(value);
                    setError('');
                  }}
                  disabled={isLoading}
                  error={Boolean(error && otp.length > 0)}
                />
                <p className="mt-3 text-center text-sm text-muted-foreground">OTP sent to {email}</p>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-[#8A7650] to-[#8E977D] hover:from-[#8A7650]/90 hover:to-[#8E977D]/90 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-[#8A7650]/30 hover:shadow-xl hover:shadow-[#8A7650]/40 transition-all hover:scale-[1.01] text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block mb-2 text-primary font-semibold text-sm md:text-base flex items-center gap-2">
                  <span>🔒</span>
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError('');
                  }}
                  required
                  minLength={6}
                  placeholder="Enter new password"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className="block mb-2 text-primary font-semibold text-sm md:text-base flex items-center gap-2">
                  <span>🔐</span>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  required
                  minLength={6}
                  placeholder="Confirm new password"
                  className={inputClassName}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#8A7650] to-[#8E977D] hover:from-[#8A7650]/90 hover:to-[#8E977D]/90 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-[#8A7650]/30 hover:shadow-xl hover:shadow-[#8A7650]/40 transition-all hover:scale-[1.01] text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold text-primary">Password Updated</h2>
              <p className="text-muted-foreground">Your password has been reset successfully. Please login with your new password.</p>
              <button
                onClick={() => onNavigate('login')}
                className="w-full bg-gradient-to-r from-[#8A7650] to-[#8E977D] hover:from-[#8A7650]/90 hover:to-[#8E977D]/90 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-[#8A7650]/30 hover:shadow-xl hover:shadow-[#8A7650]/40 transition-all hover:scale-[1.01] text-base"
              >
                Back to Login
              </button>
            </div>
          )}

          {message && step !== 'success' && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-700 text-sm font-medium text-center">{message}</p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-semibold flex items-center gap-2 justify-center">
                <span>⚠️</span>
                {error}
              </p>
            </div>
          )}

          {step !== 'success' && (
            <div className="mt-7 text-center p-4 md:p-5 bg-muted rounded-2xl">
              <p className="text-sm md:text-base text-muted-foreground mb-2">Remember your password?</p>
              <button
                onClick={() => onNavigate('login')}
                className="text-[#8A7650] hover:text-[#8A7650]/80 font-semibold text-base transition-colors"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
