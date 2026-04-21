import { useState } from 'react';
import { otpService } from '../services/otpService';
import Toast, { ToastType } from './Toast';
import logo from '../../imports/Screenshot_2026-04-16_at_1.54.58_PM-removebg-preview.png';

interface OTPRegistrationProps {
  onNavigate: (page: string) => void;
  onProceedToVerification: (data: { name: string; mobile: string; email: string; mobileOTP: string; emailOTP: string }) => void;
}

export default function OTPRegistration({ onNavigate, onProceedToVerification }: OTPRegistrationProps) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = 'Enter valid 10-digit mobile number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Send OTPs to both mobile and email
      const [mobileResult, emailResult] = await Promise.all([
        otpService.sendMobileOTP(formData.mobile),
        otpService.sendEmailOTP(formData.email),
      ]);

      if (mobileResult.success && emailResult.success) {
        setToast({ message: 'OTPs sent successfully!', type: 'success' });
        
        // For demo: show OTPs in console
        console.log('📱 Mobile OTP:', mobileResult.otp);
        console.log('📧 Email OTP:', emailResult.otp);

        // Proceed to verification screen after short delay
        setTimeout(() => {
          onProceedToVerification({
            ...formData,
            mobileOTP: mobileResult.otp || '',
            emailOTP: emailResult.otp || '',
          });
        }, 1500);
      } else {
        setToast({ message: 'Failed to send OTP. Please try again.', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
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
          <p className="text-lg text-[#8A7650]/80">
            Start your learning journey today
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-[#ECE7D1] rounded-3xl shadow-2xl p-8 border border-[#DBCEA5]" style={{ animation: 'fadeInUp 0.6s ease-out 0.1s backwards' }}>
          <form onSubmit={handleSendOTP} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block mb-2 font-semibold text-primary flex items-center gap-2">
                <span className="text-xl">👤</span>
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrors({ ...errors, name: '' });
                }}
                placeholder="Enter your full name"
                className={`w-full px-5 py-4 border-2 rounded-xl bg-white focus:outline-none transition-all text-lg ${
                  errors.name
                    ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                    : 'border-[#DBCEA5] focus:border-[#8A7650] focus:ring-4 focus:ring-[#8A7650]/10'
                }`}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Mobile Field */}
            <div>
              <label className="block mb-2 font-semibold text-primary flex items-center gap-2">
                <span className="text-xl">📱</span>
                <span>Mobile Number</span>
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({ ...formData, mobile: value });
                    setErrors({ ...errors, mobile: '' });
                  }}
                  placeholder="10-digit mobile number"
                  className={`w-full pl-16 pr-5 py-4 border-2 rounded-xl bg-white focus:outline-none transition-all text-lg ${
                    errors.mobile
                      ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                      : 'border-[#DBCEA5] focus:border-[#8A7650] focus:ring-4 focus:ring-[#8A7650]/10'
                  }`}
                />
              </div>
              {errors.mobile && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.mobile}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block mb-2 font-semibold text-primary flex items-center gap-2">
                <span className="text-xl">📧</span>
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setErrors({ ...errors, email: '' });
                }}
                placeholder="your.email@example.com"
                className={`w-full px-5 py-4 border-2 rounded-xl bg-white focus:outline-none transition-all text-lg ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                    : 'border-[#DBCEA5] focus:border-[#8A7650] focus:ring-4 focus:ring-[#8A7650]/10'
                }`}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Send OTP Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#8A7650] to-[#8E977D] hover:from-[#8A7650]/90 hover:to-[#8E977D]/90 text-white font-bold py-5 px-6 rounded-xl shadow-lg shadow-[#8A7650]/30 hover:shadow-xl transition-all hover:scale-[1.02] text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
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

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-muted-foreground mb-3">
              Already have an account?
            </p>
            <button
              onClick={() => onNavigate('otp-login')}
              className="w-full text-[#8A7650] hover:text-[#8A7650]/80 font-semibold text-lg transition-colors flex items-center justify-center gap-2 py-3 px-6 border-2 border-[#8E977D]/30 hover:border-[#8E977D]/50 rounded-xl hover:bg-[#8E977D]/5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Login with OTP</span>
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