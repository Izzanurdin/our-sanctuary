import { useState, useEffect, useCallback } from 'react';
import { Delete, Lock } from 'lucide-react';

export default function PinPad({
  onComplete,
  error = false,
  errorMessage = '',
  maxLength = 6,
  className = '',
}) {
  const [pin, setPin] = useState('');

  const handleDigit = useCallback((digit) => {
    setPin((prev) => {
      if (prev.length >= maxLength) return prev;
      const next = prev + digit;
      if (next.length === maxLength && onComplete) {
        // Trigger completion on next tick to allow UI dot to render
        setTimeout(() => onComplete(next), 100);
      }
      return next;
    });
  }, [maxLength, onComplete]);

  const handleBackspace = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setPin('');
  }, []);

  // Listen to physical keyboard events as well for desktop convenience
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (/^[0-9]$/.test(e.key)) {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleBackspace, handleClear]);

  // Reset pin when error occurs
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setPin('');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const keypadButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['clear', '0', 'backspace'],
  ];

  return (
    <div className={`flex flex-col items-center w-full max-w-xs mx-auto select-none ${className}`}>
      {/* Lock Icon */}
      <div className="mb-4 p-3 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 shadow-[0_0_20px_rgba(244,114,182,0.15)]">
        <Lock className="w-6 h-6" />
      </div>

      {/* Title & Subtitle */}
      <h2 className="text-lg font-medium text-pink-100 mb-1 tracking-wide text-center">
        PIN Rahasia Kita
      </h2>
      <p className="text-xs text-neutral-400 mb-6 text-center">
        Masukkan 6 digit kode spesial untuk membuka
      </p>

      {/* 6 Digit Indicators */}
      <div
        className={`flex items-center justify-center gap-3.5 mb-8 ${
          error ? 'animate-shake' : ''
        }`}
      >
        {Array.from({ length: maxLength }).map((_, idx) => {
          const isFilled = idx < pin.length;
          return (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                error
                  ? 'bg-red-500/80 border border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.7)] scale-110'
                  : isFilled
                  ? 'bg-pink-400 border border-pink-300 shadow-[0_0_14px_rgba(244,114,182,0.8)] scale-110'
                  : 'bg-white/10 border border-white/20'
              }`}
            />
          );
        })}
      </div>

      {/* Error Message */}
      <div className="h-6 mb-2 flex items-center justify-center text-center">
        {error && (
          <p className="text-xs text-rose-300 font-medium animate-in fade-in slide-in-from-top-1">
            {errorMessage || 'PIN tidak cocok, coba ingat tanggal spesial kita ❤️'}
          </p>
        )}
      </div>

      {/* Numeric Keypad Grid */}
      <div className="grid grid-cols-3 gap-3.5 w-full">
        {keypadButtons.flat().map((btn, index) => {
          if (btn === 'clear') {
            return (
              <button
                key={`btn-${index}`}
                type="button"
                onClick={handleClear}
                disabled={pin.length === 0}
                className="flex items-center justify-center h-14 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] active:scale-95 text-xs text-neutral-400 disabled:opacity-30 disabled:pointer-events-none transition-all duration-150 border border-white/5"
              >
                Reset
              </button>
            );
          }

          if (btn === 'backspace') {
            return (
              <button
                key={`btn-${index}`}
                type="button"
                onClick={handleBackspace}
                disabled={pin.length === 0}
                aria-label="Hapus digit"
                className="flex items-center justify-center h-14 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] active:scale-95 text-neutral-300 hover:text-pink-200 disabled:opacity-30 disabled:pointer-events-none transition-all duration-150 border border-white/5"
              >
                <Delete className="w-5 h-5" />
              </button>
            );
          }

          return (
            <button
              key={`btn-${index}`}
              type="button"
              onClick={() => handleDigit(btn)}
              className="flex items-center justify-center h-14 rounded-2xl bg-white/[0.05] hover:bg-white/[0.12] hover:border-pink-500/30 active:scale-90 text-xl font-light tracking-wider text-pink-100 shadow-[0_4px_16px_rgba(0,0,0,0.3)] backdrop-blur-sm border border-white/10 transition-all duration-150"
            >
              {btn}
            </button>
          );
        })}
      </div>
    </div>
  );
}
