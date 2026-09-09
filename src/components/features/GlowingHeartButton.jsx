import { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Send, RotateCcw } from 'lucide-react';
import {
  getAffectionTier,
  playLoveTapSound,
  playCelebrationFanfare,
  triggerHaptic,
} from '../../services/whatsapp';

export default function GlowingHeartButton({
  partnerName = 'Sayang',
  cooldownRemaining = 0,
  onSend,
  onTapCountChange,
  isSending = false,
}) {
  const [tapCount, setTapCount] = useState(0);
  const [particles, setParticles] = useState([]);
  const [isBouncing, setIsBouncing] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [celebrationData, setCelebrationData] = useState(null);
  const celebrationTimerRef = useRef(null);

  const tier = getAffectionTier(tapCount > 0 ? tapCount : 1);
  const isInCooldown = cooldownRemaining > 0;

  // Bersihkan partikel yang sudah selesai animasi
  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setTimeout(() => {
      setParticles((prev) => prev.slice(1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [particles]);

  // Handle klik tombol hati (Love Charge / Spam Tap)
  const handleHeartTap = (e) => {
    if (isInCooldown || isSending || isCelebrating) return;

    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (onTapCountChange) {
      onTapCountChange(newCount);
    }

    // Mainkan audio denting kristal & haptic
    playLoveTapSound(newCount);
    triggerHaptic(15);

    // Animasi bounce tombol
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 120);

    // Generate partikel hati mini di posisi klik atau random
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX ? e.clientX - rect.left : rect.width / 2;
    const clickY = e.clientY ? e.clientY - rect.top : rect.height / 2;

    const emojis = ['💖', '💕', '✨', '❤️', '🌸', '🥰'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const particle = {
      id: Date.now() + Math.random(),
      x: clickX,
      y: clickY,
      emoji: randomEmoji,
      driftX: (Math.random() - 0.5) * 80,
      driftY: - (50 + Math.random() * 60),
      scale: 0.8 + Math.random() * 0.6,
      rotation: (Math.random() - 0.5) * 40,
    };

    setParticles((prev) => [...prev.slice(-15), particle]);
  };

  // Kirim akumulasi rindu
  const handleSendBurst = () => {
    if (isInCooldown || isSending || isCelebrating) return;

    const countToSend = Math.max(tapCount, 1);
    setCelebrationData({
      count: countToSend,
      partnerName,
    });
    setIsCelebrating(true);
    playCelebrationFanfare();
    triggerHaptic(50);

    // Kirim ke handler WhatsApp
    if (onSend) {
      onSend(countToSend);
    }

    // Durasi dreamy celebration sebelum cooldown aktif
    celebrationTimerRef.current = setTimeout(() => {
      setIsCelebrating(false);
      setTapCount(0);
      if (onTapCountChange) onTapCountChange(0);
    }, 3800);
  };

  // Reset hitungan tap
  const handleResetCount = () => {
    setTapCount(0);
    if (onTapCountChange) onTapCountChange(0);
  };

  // Hitung lingkaran cooldown progress (stroke-dashoffset)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const cooldownPercent = (cooldownRemaining / 60) * 100;
  const strokeDashoffset = circumference - (cooldownPercent / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-sm mx-auto">
      {/* Dreamy Celebration Overlay */}
      {isCelebrating && celebrationData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/75 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="relative max-w-sm w-full p-6 rounded-3xl bg-white/[0.07] border border-pink-400/40 shadow-[0_0_80px_rgba(244,114,182,0.4)] text-center space-y-4">
            {/* Celebration Icon */}
            <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/50 animate-bounce">
              <Heart className="w-10 h-10 text-white fill-white" />
              <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-300 animate-spin" />
            </div>

            {/* Sweet & Funny Message */}
            <div className="space-y-1.5">
              <span className="inline-block px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-[11px] font-semibold border border-pink-500/30">
                ✨ Your Feelings Are Successfully Sent! ✨
              </span>
              <h3 className="text-lg font-bold text-white tracking-wide">
                Wow, you love {celebrationData.partnerName} so much! 🥺💖
              </h3>
              <p className="text-xs text-pink-200/90 leading-relaxed">
                Sinyal rindumu sebanyak{' '}
                <span className="font-bold text-amber-300 text-sm">
                  {celebrationData.count}x Ketukan
                </span>{' '}
                telah meluncur langsung ke WhatsApp {celebrationData.partnerName}!
              </p>
            </div>

            <p className="text-[11px] text-neutral-300 italic">
              "Semoga {celebrationData.partnerName} langsung senyum-senyum sendiri baca pesannya! 🥰"
            </p>

            <button
              type="button"
              onClick={() => {
                if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
                setIsCelebrating(false);
                setTapCount(0);
                if (onTapCountChange) onTapCountChange(0);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-semibold shadow-lg shadow-pink-500/30 active:scale-95 transition-all"
            >
              Lanjutkan Rasa Rindu 💕
            </button>
          </div>
        </div>
      )}

      {/* Affection Tier & Progress Bar (Hanya tampil jika bukan cooldown) */}
      {!isInCooldown && (
        <div className="w-full px-4 mb-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-pink-200 flex items-center gap-1.5">
              <span>{tier.emoji}</span>
              <span>{tapCount > 0 ? tier.label : 'Sentuh Tombol Rindu'}</span>
            </span>
            <span className="font-mono text-xs font-bold text-pink-300">
              {tapCount > 0 ? `${tapCount}x Taps (${tier.percent}%)` : 'Ready'}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 transition-all duration-300 shadow-[0_0_10px_rgba(244,114,182,0.6)]"
              style={{ width: `${tapCount === 0 ? 0 : tier.percent}%` }}
            />
          </div>

          <p className="text-[11px] text-center text-neutral-400 mt-1.5 italic">
            {tapCount === 0
              ? 'Spam pencet tombol hati untuk mengumpulkan energi rindu! ⚡'
              : tier.tagline}
          </p>
        </div>
      )}

      {/* Main Centerpiece: Giant Glowing Heart Button */}
      <div className="relative flex items-center justify-center my-3">
        {/* Glow halo atmosferik */}
        <div
          className={`absolute rounded-full transition-all duration-500 ${
            isInCooldown
              ? 'w-48 h-48 bg-purple-600/10 blur-2xl'
              : tapCount > 50
              ? 'w-60 h-60 bg-pink-500/40 blur-3xl animate-pulse'
              : 'w-52 h-52 bg-pink-500/25 blur-3xl animate-pulse'
          }`}
        />

        {/* Floating Flying Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute text-xl transition-all duration-1000 ease-out select-none"
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                transform: `translate(${p.driftX}px, ${p.driftY}px) scale(${p.scale}) rotate(${p.rotation}deg)`,
                opacity: 0,
              }}
            >
              {p.emoji}
            </span>
          ))}
        </div>

        {/* Cooldown State */}
        {isInCooldown ? (
          <div className="relative w-44 h-44 rounded-full flex flex-col items-center justify-center bg-black/40 border border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.2)]">
            <svg className="w-36 h-36 -rotate-90 transform">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="text-white/10"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="text-pink-500 transition-all duration-1000 ease-linear"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
              <span className="font-mono text-2xl font-bold text-white">
                {cooldownRemaining}s
              </span>
              <span className="text-[10px] uppercase font-semibold text-pink-300/80 tracking-wider mt-0.5">
                Cooldown
              </span>
            </div>
          </div>
        ) : (
          /* Active Tap Button */
          <button
            type="button"
            onClick={handleHeartTap}
            disabled={isSending}
            aria-label="Kirim sinyal rindu"
            style={{ touchAction: 'manipulation' }}
            className={`relative w-44 h-44 rounded-full flex flex-col items-center justify-center bg-gradient-to-b from-pink-500/25 via-rose-600/35 to-purple-800/40 border-2 border-pink-400/60 shadow-[0_0_50px_rgba(244,114,182,0.45)] backdrop-blur-md transition-all duration-150 active:scale-90 active:border-pink-300 ${
              isBouncing ? 'scale-105 border-pink-300 shadow-[0_0_60px_rgba(244,114,182,0.7)]' : 'hover:scale-105'
            }`}
          >
            {/* Live Floating Tap Counter Pill */}
            {tapCount > 0 && (
              <div className="absolute -top-3 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white font-bold text-xs shadow-lg shadow-pink-500/50 animate-bounce">
                +{tapCount} Taps!
              </div>
            )}

            <Heart
              className={`w-16 h-16 text-pink-300 fill-pink-400/60 transition-all duration-150 ${
                isBouncing ? 'scale-125 fill-pink-400 text-white' : 'animate-pulse'
              }`}
            />
            <span className="text-[11px] font-bold tracking-wider uppercase text-pink-100 mt-2">
              {tapCount > 0 ? `${tapCount}x Miss You` : 'I Miss You'}
            </span>
            <span className="text-[9px] text-pink-300/70 mt-0.5">
              {tapCount > 0 ? 'Spam lagi!' : 'Sentuh / Spam Klik'}
            </span>
          </button>
        )}
      </div>

      {/* Subtext Cooldown Status */}
      {isInCooldown && (
        <p className="text-xs text-pink-300/90 text-center max-w-xs mt-2 leading-relaxed">
          Sinyal rindu sedang meluncur ke {partnerName}... ({cooldownRemaining}s lagi sebelum bisa kirim kembali 💕)
        </p>
      )}

      {/* Action Buttons saat Tap > 0 */}
      {!isInCooldown && (
        <div className="w-full px-4 mt-3 space-y-2">
          {tapCount > 0 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetCount}
                title="Reset Hitungan"
                className="p-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] active:scale-95 text-neutral-300 border border-white/10 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleSendBurst}
                disabled={isSending}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 hover:from-pink-400 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-pink-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 animate-pulse"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Rasa Rindu Ini ({tapCount}x) 💌</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSendBurst}
              disabled={isSending}
              className="w-full py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] active:scale-98 border border-white/15 text-pink-200 text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5 text-pink-400" />
              <span>Kirim Sinyal Rindu Standar (1x) 💕</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
