import { useState } from 'react';
import OTPInput from './OTPInput';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../../services/api';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export default function RegisterPage({ onNavigate }: RegisterPageProps) {
  const { setAuthUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'teacher',
    batch: ''
  });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 'register') {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Validate password strength
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await fetch(`${API_BASE_URL}/auth/register/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setStep('verify');
        } else {
          setError(data.message || data.error || 'Failed to send OTP');
        }
      } catch (err: any) {
        setError('Network error. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Verify OTP step
      if (otp.length !== 6) {
        setError('Please enter a valid 6-digit OTP');
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await fetch(`${API_BASE_URL}/auth/register/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            mobile: formData.mobile,
            batch: formData.batch,
            otp
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Store user in auth context so dashboard can access it
          if (data.user) {
            setAuthUser(data.user);
            if (data.token) localStorage.setItem('token', data.token);
          }
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            onNavigate('dashboard');
          }, 2000);
        } else {
          setError(data.message || data.error || 'Invalid OTP');
        }
      } catch (err: any) {
        setError('Network error. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted via-background to-muted px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-accent to-indigo-600 rounded-2xl mb-4 shadow-lg shadow-accent/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="font-bold text-4xl mb-2 text-primary" style={{ fontFamily: 'var(--font-family-display)' }}>
            Create Account
          </h1>
          <p className="text-lg text-muted-foreground">
            Begin Your Journey
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-border" style={{ animation: 'fadeInUp 0.6s ease-out 0.2s backwards' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 'register' ? (
              <>
                {/* Name */}
                <div className="group">
                  <label className="block mb-2 text-primary font-semibold flex items-center gap-2">
                    <span className="text-lg">👤</span>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-5 py-4 border-2 border-border rounded-xl bg-input-background focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all text-lg hover:border-accent/50"
                  />
                </div>

                {/* Email */}
                <div className="group">
                  <label className="block mb-2 text-primary font-semibold flex items-center gap-2">
                    <span className="text-lg">📧</span>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    className="w-full px-5 py-4 border-2 border-border rounded-xl bg-input-background focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all text-lg hover:border-accent/50"
                  />
                </div>

                {/* Mobile */}
                <div className="group">
                  <label className="block mb-2 text-primary font-semibold flex items-center gap-2">
                    <span className="text-lg">📱</span>
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    placeholder="Enter 10 digit mobile number"
                    pattern="[0-9]{10}"
                    className="w-full px-5 py-4 border-2 border-border rounded-xl bg-input-background focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all text-lg hover:border-accent/50"
                  />
                </div>

                {/* Password */}
                <div className="group">
                  <label className="block mb-2 text-primary font-semibold flex items-center gap-2">
                    <span className="text-lg">🔒</span>
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a password (min 6 characters)"
                    minLength={6}
                    className="w-full px-5 py-4 border-2 border-border rounded-xl bg-input-background focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all text-lg hover:border-accent/50"
                  />
                </div>

                {/* Confirm Password */}
                <div className="group">
                  <label className="block mb-2 text-primary font-semibold flex items-center gap-2">
                    <span className="text-lg">🔐</span>
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Re-enter your password"
                    minLength={6}
                    className="w-full px-5 py-4 border-2 border-border rounded-xl bg-input-background focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all text-lg hover:border-accent/50"
                  />
                </div>

                {/* Batch (for students) */}
                {formData.role === 'student' && (
                  <div className="group">
                    <label className="block mb-2 text-primary font-semibold flex items-center gap-2">
                      <span className="text-lg">📚</span>
                      Select Batch <span className="text-sm text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <select
                      name="batch"
                      value={formData.batch}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-border rounded-xl bg-input-background focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none transition-all text-lg hover:border-accent/50"
                    >
                      <option value="">Select a batch</option>
                      <option value="IIT-JEE-2026">IIT JEE 2026</option>
                      <option value="IIT-JEE-2027">IIT JEE 2027</option>
                      <option value="NEET-2026">NEET 2026</option>
                      <option value="NEET-2027">NEET 2027</option>
                      <option value="CLASS-10-2026">Class 10 - 2026</option>
                      <option value="CLASS-12-2026">Class 12 - 2026</option>
                      <option value="SSC-2026">SSC CGL 2026</option>
                    </select>
                  </div>
                )}
              </>
            ) : (
              <div className="group">
                <label className="block mb-3 text-primary font-semibold flex items-center justify-center gap-2">
                  <span className="text-lg">📩</span>
                  Enter Verification OTP
                </label>
                <div className="flex justify-center mb-2">
                  <OTPInput length={6} value={otp} onChange={setOtp} disabled={isSubmitting} error={Boolean(error && otp.length > 0)} />
                </div>
                <p className="text-center text-sm text-muted-foreground">OTP sent to {formData.email}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-semibold flex items-center gap-2">
                  <span>⚠️</span>
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || (step === 'verify' && otp.length !== 6)}
              className="w-full bg-gradient-to-r from-accent to-indigo-600 hover:from-accent/90 hover:to-indigo-600/90 text-white font-bold py-5 px-6 rounded-xl shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all hover:scale-[1.02] text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{step === 'register' ? 'Creating Account...' : 'Verifying OTP...'}</span>
                </>
              ) : (
                <>
                  <span>{step === 'register' ? 'Create Account' : 'Verify OTP'}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center p-5 bg-muted rounded-2xl">
            <p className="text-muted-foreground mb-3">
              Already have an account?
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="text-accent hover:text-accent/80 font-semibold text-lg transition-colors flex items-center justify-center gap-1 mx-auto group"
            >
              <span>Login Now</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          {/* Help Section */}
          <div className="mt-8 p-5 bg-gradient-to-r from-muted to-muted/50 rounded-2xl border border-border">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <p className="text-sm text-foreground font-semibold mb-1">Need Help?</p>
                <p className="text-sm text-muted-foreground">
                  📞 Call us: <a href="tel:+919818034565" className="text-accent hover:underline font-semibold">+91 98180 34565</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl" style={{ animation: 'scaleIn 0.4s ease-out' }}>
            <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-primary mb-3" style={{ fontFamily: 'var(--font-family-display)' }}>
              Account Created!
            </h2>
            <p className="text-sm text-muted-foreground">
              Welcome to Gurukul The Institute. Redirecting to your dashboard...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}