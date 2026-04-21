import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'from-[#8E977D] to-[#8E977D]',
      icon: '✓',
      shadow: 'shadow-[#8E977D]/30',
    },
    error: {
      bg: 'from-red-500 to-rose-500',
      icon: '✕',
      shadow: 'shadow-red-500/30',
    },
    info: {
      bg: 'from-[#8A7650] to-[#8E977D]',
      icon: 'ℹ',
      shadow: 'shadow-[#8A7650]/30',
    },
  };

  const style = styles[type];

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 bg-gradient-to-r ${style.bg} text-white px-6 py-4 rounded-2xl shadow-2xl ${style.shadow} flex items-center gap-3 min-w-[280px] max-w-md`}
      style={{ animation: 'slideInRight 0.3s ease-out' }}
    >
      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-xl">
        {style.icon}
      </div>
      <p className="font-semibold flex-1">{message}</p>
      <button
        onClick={onClose}
        className="hover:bg-white/20 rounded-lg p-1 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
