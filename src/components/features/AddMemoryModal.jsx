import { useState } from 'react';
import ModalWrapper from '../common/ModalWrapper';
import { Camera, Heart, Image, FolderHeart, Calendar, MapPin, Sparkles } from 'lucide-react';

export default function AddMemoryModal({
  isOpen,
  onClose,
  completedDates = [],
  initialDate = null,
  onSaveMemory,
  user,
}) {
  const [selectedDateId, setSelectedDateId] = useState(initialDate?.id || '');
  const [customTitle, setCustomTitle] = useState(initialDate?.title || '');
  const [location, setLocation] = useState(initialDate?.location || '');
  const [completedAt, setCompletedAt] = useState(
    initialDate?.completedAt || initialDate?.scheduledDate || new Date().toISOString().split('T')[0]
  );
  const [driveFolder, setDriveFolder] = useState(initialDate?.driveFolder || '');
  const [caption, setCaption] = useState(initialDate?.caption || '');
  const [photoUrl, setPhotoUrl] = useState('');
  const [capturedBy, setCapturedBy] = useState(user?.id || 'user_sayang');

  const handleDateSelectChange = (e) => {
    const id = e.target.value;
    setSelectedDateId(id);
    const found = completedDates.find((d) => d.id === id);
    if (found) {
      setCustomTitle(found.title);
      setLocation(found.location || '');
      setCompletedAt(found.completedAt || found.scheduledDate || new Date().toISOString().split('T')[0]);
      setDriveFolder(found.driveFolder || '');
      setCaption(found.caption || '');
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Baca dan kompres gambar sederhana dengan canvas
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scale = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
        setPhotoUrl(compressedBase64);
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const title = customTitle.trim() || 'Kenangan Indah Kita';

    onSaveMemory(selectedDateId, {
      title,
      location,
      completedAt,
      driveFolder,
      caption: caption.trim(),
      photoUrl,
      capturedBy,
    });

    onClose();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Abadikan Momen ke Memory Vault 📸"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pilih Kencan Terkait */}
        {completedDates.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-pink-200 mb-1">
              Pilih dari Kencan yang Selesai:
            </label>
            <select
              value={selectedDateId}
              onChange={handleDateSelectChange}
              className="w-full px-3 py-2 rounded-xl bg-[#1f1624] border border-white/10 focus:border-pink-500/50 text-xs text-pink-100 outline-none"
            >
              <option value="">-- Kencan Kustom Baru --</option>
              {completedDates.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.location || 'Lokasi'})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-pink-200 mb-1">
            Judul Momen / Kencan:
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Sunset di Pantai Melasti"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-xs text-white placeholder-neutral-500 outline-none"
          />
        </div>

        {/* Date & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-pink-200 mb-1">
              <Calendar className="w-3.5 h-3.5 text-pink-400" />
              Tanggal Momen:
            </label>
            <input
              type="date"
              required
              value={completedAt}
              onChange={(e) => setCompletedAt(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-pink-200 mb-1">
              <MapPin className="w-3.5 h-3.5 text-pink-400" />
              Lokasi:
            </label>
            <input
              type="text"
              placeholder="Nama tempat / kota"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-xs text-white placeholder-neutral-500 outline-none"
            />
          </div>
        </div>

        {/* Photo Upload Area */}
        <div>
          <label className="flex items-center gap-1 text-xs font-medium text-pink-200 mb-1.5">
            <Camera className="w-3.5 h-3.5 text-pink-400" />
            Upload Foto Polaroid (Langsung Tampil di Website):
          </label>

          {photoUrl ? (
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-pink-500/40 group">
              <img
                src={photoUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setPhotoUrl('')}
                className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/80 text-xs text-rose-300 backdrop-blur-md transition-all"
              >
                Ganti Foto
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-5 rounded-xl border border-dashed border-pink-500/30 hover:border-pink-400/60 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-all">
              <Image className="w-7 h-7 text-pink-400 mb-1.5" />
              <span className="text-xs text-pink-200 font-medium">
                Pilih Foto Polaroid dari Galeri HP / Laptop
              </span>
              <span className="text-[10px] text-neutral-400 mt-0.5">
                Foto dikompresi otomatis & tersimpan aman di browser
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Folder Drive Name */}
        <div>
          <label className="flex items-center gap-1 text-xs font-medium text-pink-200 mb-1">
            <FolderHeart className="w-3.5 h-3.5 text-pink-400" />
            Nama Folder Google Drive (Opsional):
          </label>
          <input
            type="text"
            placeholder="Contoh: 1. Matcha & Flowers! :33"
            value={driveFolder}
            onChange={(e) => setDriveFolder(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-xs text-white placeholder-neutral-500 outline-none"
          />
        </div>

        {/* Caption */}
        <div>
          <label className="flex items-center gap-1 text-xs font-medium text-pink-200 mb-1">
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            Pesan Cinta / Kesan Kencan Manis:
          </label>
          <textarea
            rows={2}
            required
            placeholder="Tuliskan momen lucu, kata-kata manis, atau hal berkesan hari ini..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-xs text-white placeholder-neutral-500 outline-none resize-none"
          />
        </div>

        {/* Diabadikan oleh */}
        <div>
          <label className="flex items-center gap-1 text-xs font-medium text-pink-200 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            Diabadikan oleh:
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCapturedBy('user_izza')}
              className={`flex-1 py-1.5 px-3 rounded-xl border text-xs transition-all ${
                capturedBy === 'user_izza'
                  ? 'bg-rose-500/20 border-rose-400 text-pink-100 font-semibold shadow-sm'
                  : 'bg-white/[0.03] border-white/10 text-neutral-400'
              }`}
            >
              Izza 💫
            </button>
            <button
              type="button"
              onClick={() => setCapturedBy('user_sayang')}
              className={`flex-1 py-1.5 px-3 rounded-xl border text-xs transition-all ${
                capturedBy === 'user_sayang'
                  ? 'bg-pink-500/20 border-pink-400 text-pink-100 font-semibold shadow-sm'
                  : 'bg-white/[0.03] border-white/10 text-neutral-400'
              }`}
            >
              Cahayu ❤️
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-white/10 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-neutral-300 transition-all"
          >
            Batal
          </button>

          <button
            type="submit"
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-pink-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Camera className="w-4 h-4 text-pink-200" />
            Simpan Polaroid Kenangan ❤️
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}
