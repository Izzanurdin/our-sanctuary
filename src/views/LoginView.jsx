import { useState } from 'react';
import GradientBackground from '../components/common/GradientBackground';
import PinPad from '../components/features/PinPad';
import ProfileSelector from '../components/features/ProfileSelector';
import { ChevronLeft, HelpCircle, Sparkles } from 'lucide-react';

const VALID_PINS = ['260426'];

export default function LoginView({ onLoginSuccess }) {
  const [step, setStep] = useState('pin'); // 'pin' | 'profile'
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handlePinComplete = (enteredPin) => {
    if (VALID_PINS.includes(enteredPin)) {
      setError(false);
      setShowHint(false);
      setStep('profile');
    } else {
      setError(true);
      setErrorMessage('PIN tidak cocok, coba ingat tanggal spesial kita ❤️');
      setTimeout(() => {
        setError(false);
        setErrorMessage('');
      }, 1500);
    }
  };

  const handleSelectProfile = (profile) => {
    onLoginSuccess(profile);
  };

  return (
    <GradientBackground>
      {/* Top Header Bar */}
      <header className="flex items-center justify-between py-3 mb-2 select-none">
        {step === 'profile' ? (
          <button
            type="button"
            onClick={() => setStep('pin')}
            aria-label="Kembali ke PIN"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 border border-white/10 text-xs text-pink-200 transition-all"
          >
            <ChevronLeft className="w-4 h-4 -ml-1" />
            Ubah PIN
          </button>
        ) : (
          <div className="w-10" />
        )}

        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-pink-300/80 font-semibold font-cinzel">
            Our Sanctuary
          </span>
        </div>

        <div className="w-10" />
      </header>

      {/* Center Form Section */}
      <div className="my-auto py-4">
        {step === 'pin' ? (
          <div className="animate-in fade-in duration-300 flex flex-col items-center">
            <PinPad
              onComplete={handlePinComplete}
              error={error}
              errorMessage={errorMessage}
            />

            {/* Clickable Interactive Hint Button & Secret Message */}
            <div className="mt-7 flex flex-col items-center select-none">
              <button
                type="button"
                onClick={() => setShowHint((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/10 text-xs text-neutral-400 hover:text-pink-300 transition-all duration-200 shadow-sm"
              >
                <HelpCircle className="w-3.5 h-3.5 text-pink-400" />
                <span>{showHint ? 'Tutup Petunjuk' : 'Butuh petunjuk?'}</span>
              </button>

              {showHint && (
                <div className="mt-3.5 p-4 rounded-2xl bg-black/60 border border-pink-500/30 shadow-[0_8px_24px_rgba(244,114,182,0.18)] text-center max-w-xs animate-in fade-in zoom-in-95 duration-200 backdrop-blur-md">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider text-pink-300 font-semibold mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                    <span>Secret Question</span>
                  </div>
                  <p className="text-sm font-medium text-pink-100 italic">
                    "When's our official date?"
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <ProfileSelector onSelectProfile={handleSelectProfile} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center pt-4 pb-2 text-[11px] text-neutral-500 select-none">
        <p className="flex items-center justify-center gap-1">
          Made from Love, with love, and for Love.
        </p>
        <p className="text-[10px] text-neutral-600 mt-0.5">
          &copy; 2026
        </p>
      </footer>
    </GradientBackground>
  );
}
