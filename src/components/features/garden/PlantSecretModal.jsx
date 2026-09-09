import { useState } from 'react';
import ModalWrapper from '../../common/ModalWrapper';
import { Sparkles, Send } from 'lucide-react';

export default function PlantSecretModal({
  isOpen,
  onClose,
  onSubmit,
}) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (message.trim() && onSubmit) {
      onSubmit(message.trim());
      setMessage('');
      onClose();
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Bisikkan Rahasia Cinta"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
          <div className="flex items-center gap-1.5 font-semibold text-amber-100 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tanam Bunga Emas Berbisik</span>
          </div>
          <p className="text-[11px] opacity-90">
            Pesan ini akan tersimpan rahasia di dalam kelopak bunga. Bunga akan berpendar emas dan membisikkan pesanmu saat ditiup angin atau disentuh oleh pasanganmu.
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-pink-200 mb-1.5">
            Bisikan Rahasiamu (Maks. 40 karakter):
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={40}
            placeholder="Bisikkan sesuatu yang manis..."
            autoFocus
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 focus:border-amber-400/50 text-xs text-white placeholder-neutral-500 outline-none transition-all font-playfair italic"
          />
          <div className="flex justify-between items-center text-[10px] text-neutral-400 mt-1 px-1">
            <span>Contoh: "Hatiku selalu mekar untukmu"</span>
            <span>{message.length}/40</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-neutral-300 transition-all"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={!message.trim()}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black text-xs font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Tanam Bunga Emas ✨</span>
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}
