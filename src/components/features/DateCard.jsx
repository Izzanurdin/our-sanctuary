import GlassCard from '../common/GlassCard';
import {
  Calendar,
  MapPin,
  Sparkles,
  CheckCircle2,
  CalendarHeart,
  ExternalLink,
  Trash2,
  FolderHeart,
  Clock,
  Shirt,
} from 'lucide-react';
import { ENERGY_LEVELS, generateGoogleCalendarUrl } from '../../services/loveLifeService';

export default function DateCard({
  date,
  onSchedule,
  onComplete,
  onDelete,
  onViewDrive,
}) {
  const energy =
    ENERGY_LEVELS.find((e) => e.id === date.energyKey) || {
      label: 'Casual',
      shortLabel: 'Casual',
      color: 'border-pink-500/30 text-pink-200 bg-pink-500/10',
    };

  const isCompleted = date.status === 'completed';
  const isScheduled = date.status === 'scheduled';

  const handleOpenCalendar = (e) => {
    e.stopPropagation();
    const url = generateGoogleCalendarUrl({
      title: date.title,
      date: date.scheduledDate,
      startTime: date.scheduledStartTime,
      endTime: date.scheduledEndTime,
      location: date.location,
      gmapsUrl: date.gmapsUrl,
      dressCode: date.dressCode,
      notes: date.notes,
    });
    window.open(url, '_blank');
  };

  const handleOpenMaps = (e) => {
    e.stopPropagation();
    if (date.gmapsUrl) {
      window.open(date.gmapsUrl, '_blank');
    } else if (date.location) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          date.location
        )}`,
        '_blank'
      );
    }
  };

  return (
    <GlassCard
      className={`group transition-all duration-300 relative overflow-hidden ${
        isCompleted
          ? 'border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent'
          : isScheduled
          ? 'border-pink-500/40 bg-gradient-to-b from-pink-500/15 via-transparent to-transparent shadow-[0_0_20px_rgba(244,114,182,0.15)]'
          : 'border-white/10 hover:border-pink-500/40'
      }`}
    >
      <div className="space-y-3">
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Energy Level Badge */}
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${energy.color}`}
            >
              {energy.label}
            </span>

            {/* Category Tag */}
            {date.category && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-neutral-300">
                {date.category}
              </span>
            )}
          </div>

          {/* Status Badge */}
          <div>
            {isCompleted ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Selesai
              </span>
            ) : isScheduled ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-500/25 border border-pink-500/40 text-pink-200 flex items-center gap-1 animate-pulse">
                <Calendar className="w-3 h-3 text-pink-300" />
                Terjadwal
              </span>
            ) : (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-neutral-400">
                Wishlist 📌
              </span>
            )}
          </div>
        </div>

        {/* Date Title & Notes */}
        <div>
          <h3 className="text-sm sm:text-base font-bold text-pink-100 group-hover:text-pink-200 transition-colors">
            {date.title}
          </h3>

          {date.notes && (
            <p className="text-xs text-neutral-300 mt-1 leading-relaxed line-clamp-2">
              {date.notes}
            </p>
          )}
        </div>

        {/* Location & Dress Code Info */}
        <div className="space-y-1 pt-1 text-xs text-neutral-300">
          {date.location && (
            <div className="flex items-center gap-1.5 text-neutral-300">
              <MapPin className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
              <span className="truncate">{date.location}</span>
              {(date.gmapsUrl || isScheduled) && (
                <button
                  type="button"
                  onClick={handleOpenMaps}
                  title="Lihat rute Google Maps"
                  className="text-[10px] text-pink-300 hover:text-pink-200 underline ml-1 flex items-center gap-0.5 flex-shrink-0"
                >
                  Maps <ExternalLink className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          )}

          {date.dressCode && (
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Shirt className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              <span className="text-[11px] text-neutral-300">
                Dress Code: <strong className="text-pink-200">{date.dressCode}</strong>
              </span>
            </div>
          )}

          {isScheduled && date.scheduledDate && (
            <div className="flex items-center gap-1.5 text-pink-300 pt-0.5">
              <Clock className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
              <span className="text-[11px] font-medium font-mono">
                {date.scheduledDate}{' '}
                {date.scheduledStartTime ? `• ${date.scheduledStartTime} WITA` : ''}
              </span>
            </div>
          )}

          {isCompleted && date.completedAt && (
            <div className="flex items-center gap-1.5 text-emerald-400/90 text-[11px]">
              <Sparkles className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              <span>Selesai: {date.completedAt}</span>
              {date.driveFolder && (
                <span className="text-neutral-400">({date.driveFolder})</span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(date.id);
                }}
                title="Hapus kencan"
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 border border-white/5 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {date.driveFolder && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onViewDrive) onViewDrive(date);
                }}
                className="py-1 px-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[11px] text-neutral-300 hover:text-white border border-white/10 transition-all flex items-center gap-1"
              >
                <FolderHeart className="w-3 h-3 text-pink-400" />
                Drive
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {/* If Wishlist: Button to Schedule */}
            {!isCompleted && !isScheduled && onSchedule && (
              <button
                type="button"
                onClick={() => onSchedule(date)}
                className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-pink-500/20 to-rose-500/20 hover:from-pink-500/30 hover:to-rose-500/30 border border-pink-500/40 text-xs font-semibold text-pink-100 shadow-sm active:scale-95 transition-all flex items-center gap-1"
              >
                <CalendarHeart className="w-3.5 h-3.5 text-pink-300" />
                Jadwalkan Kencan
              </button>
            )}

            {/* If Scheduled: Quick Google Calendar & Mark Complete */}
            {isScheduled && (
              <>
                <button
                  type="button"
                  onClick={handleOpenCalendar}
                  title="Buka atau cek di Google Calendar"
                  className="py-1 px-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-[11px] font-medium text-pink-200 active:scale-95 transition-all flex items-center gap-1"
                >
                  <Calendar className="w-3 h-3 text-pink-300" />
                  Kalender
                </button>

                {onComplete && (
                  <button
                    type="button"
                    onClick={() => onComplete(date)}
                    className="py-1 px-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-[11px] font-semibold text-emerald-200 active:scale-95 transition-all flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Selesai
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
