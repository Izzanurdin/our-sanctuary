import ModalWrapper from '../../common/ModalWrapper';
import { Sparkles, Heart } from 'lucide-react';

export default function SecretWhisperModal({
  isOpen,
  onClose,
  flower,
}) {
  if (!flower) return null;

  const planterName = flower.plantedBy?.name || 'Pasanganmu';
  const roleTag = flower.plantedBy?.role === 'boyfriend' ? 'Boyfriend 💫' : 'Girlfriend ❤️';

  const formattedDate = flower.plantedAt
    ? new Date(flower.plantedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Hari ini';

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Bisikan Rahasia Dari Bunga"
    >
      <div className="text-center space-y-4 py-2">
        {/* Golden Flower Glow Centerpiece */}
        <div className="relative mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500/20 to-yellow-400/20 border border-amber-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.3)] animate-soft-pulse">
          <Sparkles className="w-8 h-8 text-amber-300" />
          <Heart className="absolute -bottom-1 -right-1 w-5 h-5 text-pink-400 fill-pink-500" />
        </div>

        {/* The Poetic Message Box */}
        <div className="p-4 rounded-2xl bg-black/40 border border-amber-400/30 text-amber-100 shadow-inner">
          <p className="font-playfair italic text-base sm:text-lg leading-relaxed text-amber-200">
            &ldquo;{flower.secretMessage}&rdquo;
          </p>
        </div>

        {/* Stamped Author Info */}
        <div className="text-xs text-neutral-400 space-y-1">
          <p className="flex items-center justify-center gap-1 text-pink-300 font-medium">
            <span>Dibisikkan oleh</span>
            <strong className="text-pink-100">{planterName}</strong>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
              {roleTag}
            </span>
          </p>
          <p className="text-[11px] text-neutral-500">
            Ditanam pada {formattedDate}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-pink-500/20 hover:from-amber-500/30 hover:to-pink-500/30 border border-amber-400/40 text-xs font-semibold text-amber-200 active:scale-95 transition-all mt-2"
        >
          Simpan di Dalam Hati ❤️
        </button>
      </div>
    </ModalWrapper>
  );
}
