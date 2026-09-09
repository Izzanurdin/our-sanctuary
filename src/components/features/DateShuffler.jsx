import { useState, useEffect } from 'react';
import ModalWrapper from '../common/ModalWrapper';
import {
  Shuffle,
  Sparkles,
  CalendarHeart,
  RotateCcw,
  MapPin,
} from 'lucide-react';
import { ENERGY_LEVELS } from '../../services/loveLifeService';

export default function DateShuffler({
  isOpen,
  onClose,
  dates = [],
  onSchedulePickedDate,
}) {
  const [selectedEnergy, setSelectedEnergy] = useState('all');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [displayIndex, setDisplayIndex] = useState(0);

  // Pool of candidate dates (hanya yang statusnya 'wishlist' atau semua kecuali yang sudah 'completed')
  // Tapi jika semua completed, boleh acak semua kencan!
  const availableDates = dates.filter((d) => {
    const matchesEnergy =
      selectedEnergy === 'all' || d.energyKey === selectedEnergy;
    return matchesEnergy;
  });

  const pool =
    availableDates.length > 0
      ? availableDates
      : dates.length > 0
      ? dates
      : [];

  useEffect(() => {
    let interval;
    if (isSpinning && pool.length > 1) {
      interval = setInterval(() => {
        setDisplayIndex((prev) => (prev + 1) % pool.length);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isSpinning, pool.length]);

  const handleStartSpin = () => {
    if (pool.length === 0) return;
    setIsSpinning(true);
    setSelectedDate(null);

    // Roulette spin selama 1.6 detik
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setSelectedDate(pool[randomIndex]);
      setIsSpinning(false);
    }, 1600);
  };

  const handleClose = () => {
    setIsSpinning(false);
    setSelectedDate(null);
    onClose();
  };

  const currentPreviewDate = isSpinning
    ? pool[displayIndex] || pool[0]
    : selectedDate;

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      title="Date Shuffler: Pengacak Kencan Romantis"
    >
      <div className="space-y-4 text-center">
        {/* Mood / Energy Selector */}
        <div>
          <p className="text-xs text-neutral-300 mb-2">
            Pilih suasana hati atau mood kencan kalian hari ini:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {ENERGY_LEVELS.map((energy) => {
              const isSelected = selectedEnergy === energy.id;
              return (
                <button
                  key={energy.id}
                  type="button"
                  onClick={() => {
                    setSelectedEnergy(energy.id);
                    setSelectedDate(null);
                  }}
                  className={`text-xs px-3.5 py-2 rounded-xl border transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-pink-500/30 border-pink-400 text-pink-100 shadow-[0_0_12px_rgba(244,114,182,0.3)] font-semibold'
                      : 'bg-white/[0.04] border-white/10 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {energy.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Shuffler Machine Arena */}
        <div className="relative py-6 px-4 rounded-2xl bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent border border-pink-500/20 overflow-hidden min-h-[190px] flex flex-col items-center justify-center">
          {/* Glowing Aura */}
          <div className="absolute w-40 h-40 rounded-full bg-pink-500/15 blur-3xl animate-pulse" />

          {currentPreviewDate ? (
            <div
              className={`relative z-10 w-full max-w-sm p-4 rounded-xl border transition-all duration-300 ${
                isSpinning
                  ? 'border-pink-500/60 bg-pink-500/10 scale-95 blur-[0.5px]'
                  : 'border-pink-400/50 bg-gradient-to-b from-pink-500/20 to-rose-600/20 shadow-[0_0_25px_rgba(244,114,182,0.3)] scale-100 animate-in zoom-in-95'
              }`}
            >
              {!isSpinning && (
                <div className="text-[10px] uppercase font-bold tracking-widest text-pink-300 mb-1 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                  Kencan Terpilih Untuk Kita!
                </div>
              )}

              <h4 className="text-base sm:text-lg font-bold text-pink-100">
                {currentPreviewDate.title}
              </h4>

              {currentPreviewDate.location && (
                <p className="text-xs text-pink-200/90 mt-1 flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3 text-pink-400" />
                  {currentPreviewDate.location}
                </p>
              )}

              {currentPreviewDate.notes && !isSpinning && (
                <p className="text-xs text-neutral-300 mt-2 italic line-clamp-2">
                  &ldquo;{currentPreviewDate.notes}&rdquo;
                </p>
              )}
            </div>
          ) : (
            <div className="relative z-10 text-center space-y-2">
              <div className="p-3.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 w-14 h-14 mx-auto flex items-center justify-center">
                <Shuffle className="w-6 h-6 animate-soft-pulse" />
              </div>
              <p className="text-xs text-neutral-400 max-w-xs">
                Bingung mau kencan apa? Tekan tombol di bawah untuk mengocok ide kencan impian!
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          {!selectedDate ? (
            <button
              type="button"
              onClick={handleStartSpin}
              disabled={isSpinning || pool.length === 0}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-pink-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Shuffle
                className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`}
              />
              {isSpinning ? 'Mengocok Ide Kencan...' : 'Kocok Kencan Kita! 🎲'}
            </button>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  if (onSchedulePickedDate) {
                    onSchedulePickedDate(selectedDate);
                  }
                  handleClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-pink-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <CalendarHeart className="w-4 h-4" />
                Kunci & Jadwalkan Kencan Ini! ✨
              </button>

              <button
                type="button"
                onClick={handleStartSpin}
                className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-neutral-300 transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Kocok Ulang Lagi
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
}
