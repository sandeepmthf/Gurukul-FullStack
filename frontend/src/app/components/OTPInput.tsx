import { useRef, useEffect, KeyboardEvent } from 'react';

interface OTPInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export default function OTPInput({ length, value, onChange, disabled = false, error = false }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  const handleChange = (index: number, digit: string) => {
    if (disabled) return;

    // Allow only numbers
    if (digit && !/^\d$/.test(digit)) return;

    const newValue = value.split('');
    newValue[index] = digit;
    const updatedValue = newValue.join('');

    onChange(updatedValue);

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Move to previous input on backspace if current is empty
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData.padEnd(length, ''));
      // Focus last filled input
      const lastIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all
            ${error 
              ? 'border-red-500 bg-red-50 text-red-600' 
              : disabled
              ? 'border-[#DBCEA5] bg-[#ECE7D1] text-muted-foreground cursor-not-allowed'
              : 'border-[#DBCEA5] bg-white text-[#8A7650] focus:border-[#8A7650] focus:ring-4 focus:ring-[#8A7650]/20 hover:border-[#8E977D]'
            }
            focus:outline-none
          `}
        />
      ))}
    </div>
  );
}
