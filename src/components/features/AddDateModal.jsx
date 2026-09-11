import { useState } from 'react';
import ModalWrapper from '../common/ModalWrapper';
import { Sparkles, MapPin, Tag, FolderHeart } from 'lucide-react';
import { ENERGY_LEVELS, DRESS_CODE_PRESETS } from '../../services/loveLifeService';

export default function AddDateModal({ isOpen, onClose, onAddDate, user }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [gmapsUrl, setGmapsUrl] = useState('');
  const [energyKey, setEnergyKey] = useState('casual');
  const [category, setCategory] = useState('Food & Drinks');
  const [dressCode, setDressCode] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const CATEGORIES = [
    'Food & Drinks',
    'Outdoor & Nature',
    'Movie & Series',
    'Culture & Arts',
    'Sports & Play',
    'Night Ride',
    'Staycation',
    'Other',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddDate({
        title: title.trim(),
        location: location.trim(),
        gmapsUrl: gmapsUrl.trim(),
        energyKey,
        category,
        dressCode: dressCode.trim(),
        notes: notes.trim(),
        createdBy: user?.id || 'user_izza',
      });

      // Reset form
      setTitle('');
      setLocation('');
      setGmapsUrl('');
      setEnergyKey('casual');
      setCategory('Food & Drinks');
      setDressCode('');
      setNotes('');
      onClose();
    } catch (err) {
      console.error('Error submitting date idea:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Ide Kencan Impian Baru ✨"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-pink-200 mb-1">
            Judul / Nama Kencan:
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Sunset Picnic di Pantai / Pottery Class"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-xs text-white placeholder-neutral-500 outline-none"
          />
        </div>

        {/* Location & Maps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-pink-200 mb-1">
              <MapPin className="w-3.5 h-3.5 text-pink-400" />
              Lokasi Kencan:
            </label>
            <input
              type="text"
              placeholder="Nama tempat / area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-xs text-white placeholder-neutral-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-pink-200 mb-1">
              Kategori Aktivitas:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#1f1624] border border-white/10 focus:border-pink-500/50 text-xs text-pink-100 outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Energy Level Selection */}
        <div>
          <label className="flex items-center gap-1 text-xs font-medium text-pink-200 mb-1.5">
            <Tag className="w-3.5 h-3.5 text-pink-400" />
            Pilih Suasana / Energy Level:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ENERGY_LEVELS.filter((e) => e.id !== 'all').map((level) => {
              const isSelected = energyKey === level.id;
              return (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setEnergyKey(level.id)}
                  className={`p-2 rounded-xl border text-xs text-left transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-pink-500/20 border-pink-400 text-pink-100 shadow-[0_0_10px_rgba(244,114,182,0.25)] font-semibold'
                      : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className="text-base">{level.icon}</span>
                  <span className="truncate">{level.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dress Code Idea (Optional) */}
        <div>
          <label className="block text-xs font-medium text-pink-200 mb-1">
            Ide Dress Code (Opsional):
          </label>
          <input
            type="text"
            list="dress_presets"
            placeholder="Contoh: Smart Casual / Kaos Putih Senada"
            value={dressCode}
            onChange={(e) => setDressCode(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-xs text-white placeholder-neutral-500 outline-none"
          />
          <datalist id="dress_presets">
            {DRESS_CODE_PRESETS.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-pink-200 mb-1">
            Catatan / Ekspektasi Kencan:
          </label>
          <textarea
            rows={2}
            placeholder="Apa yang mau dilakukan, rekomendasi menu, dll..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-xs text-white placeholder-neutral-500 outline-none resize-none"
          />
        </div>

        {/* Google Drive Automation Info Banner */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs text-pink-200">
          <FolderHeart className="w-4 h-4 text-pink-400 flex-shrink-0" />
          <span>Folder Google Drive untuk kencan ini akan otomatis dibuatkan di folder bersama kalian! 📸</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-white/10 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-neutral-300 transition-all disabled:opacity-50"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-pink-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block animate-spin mr-1">⏳</span>
                <span>Membuat Folder Drive & Menyimpan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-pink-200" />
                Simpan ke Wishlist Kencan ❤️
              </>
            )}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}
