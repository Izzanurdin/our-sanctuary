import { useState } from 'react';
import ModalWrapper from '../../common/ModalWrapper';
import { ShoppingBag, Sparkles, Heart, Trash2, Calendar, Quote } from 'lucide-react';
import { removeFromFlowerBasket } from '../../../services/gardenService';

export default function FlowerBasketModal({
  isOpen,
  onClose,
  basketItems = [],
  onBasketUpdated,
}) {
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleDelete = (id) => {
    removeFromFlowerBasket(id);
    setDeleteConfirmId(null);
    if (onBasketUpdated) {
      onBasketUpdated();
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Flower Basket 🧺"
    >
      <div className="space-y-4 py-1">
        {/* Header Ribbon / Subtitle */}
        <div className="flex items-center justify-between px-1 pb-2 border-b border-white/10 text-xs">
          <div className="flex items-center gap-1.5 text-amber-300 font-medium font-playfair">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Koleksi Bisikan & Surat Rahasia Kita</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-[11px] font-semibold">
            {basketItems.length} Tersimpan
          </span>
        </div>

        {/* Empty State */}
        {basketItems.length === 0 ? (
          <div className="text-center py-10 px-4 space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500/15 via-pink-500/15 to-purple-500/15 border border-amber-400/30 flex items-center justify-center shadow-[0_0_25px_rgba(255,215,0,0.15)]">
              <ShoppingBag className="w-8 h-8 text-amber-300" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-pink-100 font-cinzel">
                Keranjang Bungamu Masih Kosong
              </h3>
              <p className="text-xs text-neutral-400 font-playfair italic max-w-xs mx-auto leading-relaxed">
                Tahan sentuhan di taman untuk membisikkan rahasia ke bunga emas, lalu ketuk bunganya dan pilih &ldquo;Simpan di Dalam Hati&rdquo; untuk mengoleksi surat cinta abadi di sini ✨
              </p>
            </div>
          </div>
        ) : (
          /* List of Stored Secret Letters */
          <div className="max-h-[62vh] overflow-y-auto space-y-3.5 pr-1 custom-scrollbar">
            {basketItems.map((item) => {
              const planterName = item.plantedBy?.name || 'Pasanganmu';
              const roleTag =
                item.plantedBy?.role === 'boyfriend'
                  ? 'Boyfriend 💫'
                  : item.plantedBy?.role === 'girlfriend'
                  ? 'Girlfriend ❤️'
                  : 'Love ❤️';

              const formattedPlantedDate = item.plantedAt
                ? new Date(item.plantedAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Hari ini';

              const isConfirmingDelete = deleteConfirmId === item.id;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-black/45 border border-amber-400/25 hover:border-amber-400/40 shadow-lg space-y-3 transition-all relative overflow-hidden group"
                >
                  {/* Glowing subtle gradient accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                  {/* Top Header Card: Author Info & Delete Button */}
                  <div className="flex items-center justify-between text-xs relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                        {planterName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-pink-200">
                          {planterName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                          {roleTag}
                        </span>
                      </div>
                    </div>

                    {/* Delete / Confirm Button */}
                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-1.5 animate-in fade-in duration-200">
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="px-2 py-1 rounded-lg bg-rose-500/30 hover:bg-rose-500/50 border border-rose-400/50 text-[11px] text-rose-200 font-medium transition-all"
                        >
                          Lepas
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-[11px] text-neutral-300 transition-all"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(item.id)}
                        title="Lepaskan dari Keranjang"
                        className="opacity-60 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Message Body (Long Text / Poetic Display) */}
                  <div className="relative pl-3 border-l-2 border-amber-400/40 py-1">
                    <Quote className="w-3.5 h-3.5 text-amber-400/50 absolute -top-1 -left-1.5 opacity-60" />
                    <p className="font-playfair italic text-xs sm:text-sm text-amber-100 leading-relaxed whitespace-pre-wrap select-text">
                      &ldquo;{item.secretMessage}&rdquo;
                    </p>
                  </div>

                  {/* Card Footer: Timestamps */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Calendar className="w-3 h-3 text-pink-400/70" />
                      <span>Ditanam {formattedPlantedDate}</span>
                    </span>
                    <span className="text-[10px] text-amber-300/70 italic">
                      ✨ Tersimpan di hati
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Bottom Actions */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500/20 via-amber-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-white/15 text-xs font-semibold text-pink-200 active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            <span>Tutup Keranjang</span>
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
