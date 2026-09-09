import { useState } from 'react';
import GradientBackground from '../components/common/GradientBackground';
import AppHeader from '../components/common/AppHeader';
import { Heart } from 'lucide-react';

export default function MissYouView({ onBack, user }) {
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleTestClick = () => {
    if (isSending) return;
    setIsSending(true);
    setFeedback('Tombol rindu berdenyut! (Integrasi WhatsApp Gateway Fonnte di Fase 5)');
    setTimeout(() => {
      setIsSending(false);
    }, 2000);
  };

  return (
    <GradientBackground>
      <AppHeader
        title="I Miss You"
        subtitle="Kanal Afeksi & Rindu Instan"
        onBack={onBack}
        rightAction={
          <div className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300">
            Fase 5
          </div>
        }
      />

      <div className="my-auto py-2 flex flex-col items-center text-center space-y-6">
        <div className="max-w-xs">
          <p className="text-xs text-neutral-400 leading-relaxed">
            Sentuh tombol di bawah untuk mengirimkan sinyal rindu langsung ke WhatsApp {user?.name === 'Izza' ? 'Sayang' : 'Izza'}.
          </p>
        </div>

        {/* Giant Glowing Heart Button */}
        <div className="relative flex items-center justify-center my-4">
          <div className="absolute w-52 h-52 rounded-full bg-pink-500/20 blur-3xl animate-pulse" />
          <button
            type="button"
            onClick={handleTestClick}
            disabled={isSending}
            aria-label="Kirim sinyal rindu"
            className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center bg-gradient-to-b from-pink-500/20 to-rose-600/30 border-2 border-pink-400/50 shadow-[0_0_40px_rgba(244,114,182,0.4)] backdrop-blur-md transition-all duration-300 active:scale-90 ${
              isSending ? 'scale-95 border-rose-400 bg-pink-500/40' : 'hover:scale-105 hover:border-pink-300'
            }`}
          >
            <Heart
              className={`w-14 h-14 text-pink-300 fill-pink-400/50 transition-all ${
                isSending ? 'scale-125 fill-pink-400' : 'animate-pulse'
              }`}
            />
            <span className="text-xs font-semibold tracking-wider uppercase text-pink-100 mt-2">
              {isSending ? 'Terkirim...' : 'I Miss You'}
            </span>
          </button>
        </div>

        {feedback ? (
          <div className="px-4 py-2 rounded-xl bg-pink-500/20 border border-pink-500/40 text-xs text-pink-200 animate-in fade-in">
            {feedback}
          </div>
        ) : (
          <p className="text-[11px] text-neutral-500">
            Dilengkapi Cooldown State 2 detik agar tidak spam
          </p>
        )}

        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="w-full max-w-xs py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] active:scale-98 border border-white/10 text-xs font-medium text-pink-200 transition-all text-center"
        >
          Kembali ke Dashboard
        </button>
      </div>

      <footer className="text-center pt-4 pb-2 text-[11px] text-neutral-500 select-none">
        <p className="flex items-center justify-center gap-1">
          Instant WhatsApp Gateway via Fonnte
        </p>
      </footer>
    </GradientBackground>
  );
}
