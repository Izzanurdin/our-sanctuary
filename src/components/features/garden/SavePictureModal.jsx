import { useState } from 'react';
import ModalWrapper from '../../common/ModalWrapper';
import { Download, Camera, CheckCircle2, Sparkles } from 'lucide-react';
import { addDirectMemory } from '../../../services/loveLifeService';

export default function SavePictureModal({
  isOpen,
  onClose,
  imageDataUrl,
  user,
  flowersCount = 0,
}) {
  const [caption, setCaption] = useState(
    'Bunga abadi kita yang mekar indah di langit malam aurora 🌸✨'
  );
  const [savedVaultToast, setSavedVaultToast] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  // Unduh gambar ke penyimpanan perangkat
  const handleDownload = () => {
    if (!imageDataUrl) return;
    const link = document.createElement('a');
    link.download = `Our-Unwithering-Garden-${new Date().toISOString().split('T')[0]}.png`;
    link.href = imageDataUrl;
    link.click();
  };

  // Simpan ke album polaroid Memory Vault
  const handleSaveToMemoryVault = () => {
    if (!imageDataUrl || isSaving) return;
    setIsSaving(true);
    try {
      addDirectMemory({
        title: `Potret Taman Abadi (${flowersCount} Bunga)`,
        caption: caption.trim(),
        photoUrl: imageDataUrl,
        location: 'Unwithering Garden',
        capturedBy: user?.id || 'user_sayang',
      });
      setSavedVaultToast('Potret taman berhasil diabadikan ke Memory Vault! 📸💕');
      setTimeout(() => {
        setIsSaving(false);
        setSavedVaultToast('');
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error saving to vault:', err);
      setIsSaving(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Abadikan Potret Taman Abadi"
    >
      <div className="space-y-4">
        {/* Preview Potret */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/60 border border-white/15 shadow-lg flex items-center justify-center">
          {imageDataUrl ? (
            <img
              src={imageDataUrl}
              alt="Potret Taman Abadi"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-neutral-400">Memuat potret...</span>
          )}
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-pink-200 border border-white/10 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>{flowersCount} Bunga Mekar</span>
          </div>
        </div>

        {/* Input Caption Polaroid */}
        <div>
          <label className="block text-xs font-medium text-pink-200 mb-1">
            Catatan Kenangan (Untuk Polaroid di Memory Vault):
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Tulis pesan manis untuk foto ini..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 focus:border-pink-500/50 text-xs text-white placeholder-neutral-500 outline-none font-playfair italic"
          />
        </div>

        {/* Toast Notifikasi */}
        {savedVaultToast && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-200 flex items-center justify-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{savedVaultToast}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 text-neutral-200 text-xs font-semibold border border-white/10 transition-all flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4 text-pink-300" />
            <span>Unduh File PNG</span>
          </button>

          <button
            type="button"
            onClick={handleSaveToMemoryVault}
            disabled={isSaving}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-pink-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
            <span>Abadikan ke Memory Vault 📸</span>
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
