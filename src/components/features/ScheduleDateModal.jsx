import { useState } from 'react';
import ModalWrapper from '../common/ModalWrapper';
import {
  Calendar,
  Clock,
  MapPin,
  Shirt,
  Sparkles,
  ExternalLink,
  Mail,
} from 'lucide-react';
import {
  DRESS_CODE_PRESETS,
  generateGoogleCalendarUrl,
} from '../../services/loveLifeService';

export default function ScheduleDateModal({
  isOpen,
  onClose,
  date,
  onConfirmSchedule,
}) {
  const [scheduledDate, setScheduledDate] = useState(() => {
    // Default: besok atau tanggal hari ini
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('19:30');
  const [location, setLocation] = useState(date?.location || '');
  const [gmapsUrl, setGmapsUrl] = useState(date?.gmapsUrl || '');
  const [dressCode, setDressCode] = useState(date?.dressCode || '👗 Smart Casual / Rapi Manis');
  const [customDressCode, setCustomDressCode] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [notes, setNotes] = useState(date?.notes || '');

  if (!date) return null;

  const handleSelectPresetDressCode = (preset) => {
    setDressCode(preset);
    setCustomDressCode('');
  };

  const finalDressCode = customDressCode.trim() || dressCode;

  const handleSubmit = (e) => {
    e.preventDefault();

    const scheduleDetails = {
      date: scheduledDate,
      startTime,
      endTime,
      location,
      gmapsUrl,
      dressCode: finalDressCode,
      notes,
    };

    // 1. Simpan ke database lokal
    onConfirmSchedule(date.id, scheduleDetails);

    // 2. Generate Google Calendar URL & langsung buka tanpa download file
    const calUrl = generateGoogleCalendarUrl({
      title: date.title,
      date: scheduledDate,
      startTime,
      endTime,
      location,
      gmapsUrl,
      dressCode: finalDressCode,
      notes,
      guestEmail,
    });

    window.open(calUrl, '_blank');
    onClose();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={`Jadwalkan Kencan: ${date.title}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date & Time Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Tanggal */}
          <div>
            <label className="block text-xs font-medium text-pink-200 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-pink-400" />
              Tanggal Kencan:
            </label>
            <input
              type="date"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-xs text-white outline-none"
            />
          </div>

          {/* Jam */}
          <div>
            <label className="block text-xs font-medium text-pink-200 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-pink-400" />
              Jam (Mulai - Selesai):
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-xs text-white outline-none"
              />
              <span className="text-neutral-400 text-xs">-</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Location & Maps Link */}
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-pink-200 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-pink-400" />
              Nama Lokasi Kencan:
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Cafe Senja / Living World / Pantai Melasti"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-xs text-white placeholder-neutral-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-pink-200 mb-1 flex items-center gap-1">
              <ExternalLink className="w-3.5 h-3.5 text-pink-400" />
              Link Google Maps (Opsional):
            </label>
            <input
              type="url"
              placeholder="Paste link Google Maps (https://maps.app.goo.gl/...)"
              value={gmapsUrl}
              onChange={(e) => setGmapsUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-xs text-white placeholder-neutral-500 outline-none"
            />
          </div>
        </div>

        {/* Dress Code Section */}
        <div>
          <label className="block text-xs font-medium text-pink-200 mb-1.5 flex items-center gap-1">
            <Shirt className="w-3.5 h-3.5 text-rose-400" />
            Pilihan Dress Code:
          </label>

          {/* Quick Preset Pills */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {DRESS_CODE_PRESETS.map((preset) => {
              const isSelected = dressCode === preset && !customDressCode;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSelectPresetDressCode(preset)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-pink-500/30 border-pink-400 text-pink-100 shadow-[0_0_10px_rgba(244,114,182,0.3)]'
                      : 'bg-white/[0.04] border-white/10 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {preset}
                </button>
              );
            })}
          </div>

          {/* Custom Dress Code Input */}
          <input
            type="text"
            placeholder="Atau ketik dress code khusus (contoh: Atasan putih senada + sneakers)"
            value={customDressCode}
            onChange={(e) => setCustomDressCode(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-xs text-white placeholder-neutral-500 outline-none"
          />
        </div>

        {/* Shared Email / Guest Input */}
        <div>
          <label className="block text-xs font-medium text-pink-200 mb-1 flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-pink-400" />
            Email Kalender Bersama / Email Pasangan (Opsional):
          </label>
          <input
            type="email"
            placeholder="emailbersama@gmail.com (otomatis terundang ke kalender)"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-xs text-white placeholder-neutral-500 outline-none"
          />
          <p className="text-[10px] text-neutral-400 mt-1">
            Notifikasi pengingat H-1 akan otomatis disetel oleh Google Calendar!
          </p>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-pink-200 mb-1">
            Catatan Tambahan:
          </label>
          <textarea
            rows={2}
            placeholder="Catatan persiapan, hal yang ingin dibeli, dll..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 text-xs text-white placeholder-neutral-500 outline-none resize-none"
          />
        </div>

        {/* Action Button */}
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
            <Sparkles className="w-4 h-4 text-pink-200 animate-pulse" />
            Kunci & Buka Google Calendar ✨
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}
