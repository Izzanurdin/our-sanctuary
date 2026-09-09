import ModalWrapper from '../../common/ModalWrapper';
import { RotateCcw, Flower2 } from 'lucide-react';

export default function ResetGardenModal({
  isOpen,
  onClose,
  onConfirmReset,
}) {
  const handleConfirm = () => {
    if (onConfirmReset) {
      onConfirmReset();
    }
    onClose();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Tata Ulang Taman Abadi?"
    >
      <div className="text-center space-y-4 py-2">
        <div className="relative mx-auto w-14 h-14 rounded-full bg-rose-500/15 border border-rose-400/30 flex items-center justify-center text-rose-300">
          <Flower2 className="w-7 h-7 animate-spin" />
        </div>

        <div className="space-y-1.5 px-2">
          <h4 className="text-sm font-bold text-white font-cinzel tracking-wide">
            Kembalikan ke Halaman Awal?
          </h4>
          <p className="text-xs text-neutral-300 leading-relaxed font-playfair italic">
            Yakin ingin menata ulang taman cinta kita dari awal lagi sayang? Bunga-bunga Lily yang mekar akan kembali menjadi bibit baru, sementara 3 Gerbera utama akan tetap setia menjaga taman ini 🌸✨
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-neutral-300 active:scale-95 transition-all"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-rose-600/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ya, Tata Ulang</span>
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
