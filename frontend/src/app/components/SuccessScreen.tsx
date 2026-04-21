import { useEffect } from 'react';

interface SuccessScreenProps {
  type: 'registration' | 'login';
  onContinue: () => void;
}

export default function SuccessScreen({ type, onContinue }: SuccessScreenProps) {
  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      onContinue();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-md w-full">
        {/* Success Animation */}
        <div 
          className="mb-8 inline-block"
          style={{ animation: 'scaleIn 0.6s ease-out, pulse 2s ease-in-out infinite 0.6s' }}
        >
          <div className="relative">
            {/* Outer Ring */}
            <div className="w-32 h-32 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/40">
              {/* Checkmark */}
              <svg 
                className="w-16 h-16 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ animation: 'checkmarkDraw 0.6s ease-out 0.3s backwards' }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3.5} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>

            {/* Animated Rings */}
            <div 
              className="absolute inset-0 w-32 h-32 border-4 border-emerald-300 rounded-full mx-auto"
              style={{ animation: 'ripple 1.5s ease-out infinite' }}
            />
            <div 
              className="absolute inset-0 w-32 h-32 border-4 border-teal-300 rounded-full mx-auto"
              style={{ animation: 'ripple 1.5s ease-out infinite 0.5s' }}
            />
          </div>
        </div>

        {/* Success Message */}
        <div style={{ animation: 'fadeInUp 0.6s ease-out 0.4s backwards' }}>
          <h1 className="font-bold text-4xl mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-family-display)' }}>
            {type === 'registration' ? '🎉 Account Created!' : '✓ Login Successful!'}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {type === 'registration' 
              ? 'Welcome to Gurukul The Institute' 
              : 'Welcome back to Gurukul The Institute'}
          </p>

          {/* Auto-redirect indicator */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 border border-emerald-300 rounded-full">
              <svg className="animate-spin h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm font-medium text-emerald-700">
                Redirecting to dashboard...
              </span>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={onContinue}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-5 px-10 rounded-2xl shadow-xl shadow-emerald-500/30 hover:shadow-2xl transition-all hover:scale-105 text-lg flex items-center justify-center gap-3 mx-auto"
          >
            <span>Continue to Dashboard</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Confetti Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                animation: `confetti ${2 + Math.random() * 2}s ease-out ${Math.random() * 0.5}s`,
                opacity: 0,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes checkmarkDraw {
          from {
            stroke-dasharray: 0 100;
          }
          to {
            stroke-dasharray: 100 100;
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
