import { useState } from 'react';
import ModalWrapper from '../../common/ModalWrapper';
import { Sparkles, Heart, ShoppingBag, Check } from 'lucide-react';
import { isInFlowerBasket, addToFlowerBasket } from '../../../services/gardenService';

export default function SecretWhisperModal({
  isOpen,
  onClose,
  flower,
  onBasketUpdated,
}) {
  const [justSaved, setJustSaved] = useState(false);

  const flowerId = flower?.id;
  const isSaved = (flowerId ? isInFlowerBasket(flowerId) : false) || justSaved;

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

  const handleSaveToBasket = () => {
    if (!flower) return;
    addToFlowerBasket(flower);
    setJustSaved(true);
    if (onBasketUpdated) {
      onBasketUpdated();
    }
    // Tutup modal secara anggun setelah 1.5 detik agar pengguna melihat feedback
    setTimeout(() => {
      setJustSaved(false);
      onClose();
    }, 1500);
  };

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

        {/* The Poetic Message Box (Nyaman untuk teks panjang / long-text) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-black/45 border border-amber-400/30 text-amber-100 shadow-inner max-h-64 overflow-y-auto custom-scrollbar">
          <p className="font-playfair italic text-base sm:text-lg leading-relaxed text-amber-200 select-text whitespace-pre-wrap">
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

        {/* Action Buttons */}
        <div className="pt-2">
          {justSaved ? (
            <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in zoom-in-95 duration-300">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Tersimpan di Flower Basket! 🧺✨</span>
            </div>
          ) : isSaved ? (
            <div className="space-y-2">
              <div className="py-2 px-3 rounded-xl bg-amber-500/15 border border-amber-400/30 text-xs text-amber-300 flex items-center justify-center gap-2">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>Sudah tersimpan di Flower Basket 🧺</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-medium text-pink-200 active:scale-95 transition-all"
              >
                Tutup
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSaveToBasket}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/30 via-pink-500/30 to-rose-500/30 hover:from-amber-500/40 hover:to-rose-500/40 border border-amber-400/50 text-xs font-semibold text-amber-200 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,215,0,0.2)] flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 text-pink-400 fill-pink-500" />
              <span>Simpan di Dalam Hati (Flower Basket) 🧺❤️</span>
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
}
