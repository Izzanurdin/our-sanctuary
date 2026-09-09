import { useState } from 'react';
import GradientBackground from '../components/common/GradientBackground';
import PinPad from '../components/features/PinPad';
import ProfileSelector from '../components/features/ProfileSelector';
import { Heart, ChevronLeft } from 'lucide-react';

const VALID_PINS = ['150926', '123456', '260915'];

export default function LoginView({ onLoginSuccess }) {
  const [step, setStep] = useState('pin'); // 'pin' | 'profile'
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePinComplete = (enteredPin) => {
    if (VALID_PINS.includes(enteredPin)) {
      setError(false);
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
          <span className="text-[11px] uppercase tracking-widest text-pink-300/70 font-semibold">
            Private Space
          </span>
        </div>

        <div className="w-10" />
      </header>

      {/* Center Form Section */}
      <div className="my-auto py-4">
        {step === 'pin' ? (
          <div className="animate-in fade-in duration-300">
            <PinPad
              onComplete={handlePinComplete}
              error={error}
              errorMessage={errorMessage}
            />

            {/* Subtle Hint */}
            <div className="mt-8 text-center">
              <span className="text-[11px] text-neutral-500 hover:text-neutral-400 transition-colors cursor-default">
                Hint: Tanggal rilis / spesial kita (150926)
              </span>
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
          Made with <Heart className="w-3 h-3 text-pink-400 fill-pink-400" /> for Our Memories
        </p>
        <p className="text-[10px] text-neutral-600 mt-0.5">
          Target Rilis: 15 September 2026
        </p>
      </footer>
    </GradientBackground>
  );
}
