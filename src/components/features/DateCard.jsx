import {
  Calendar,
  MapPin,
  CheckCircle2,
  CalendarHeart,
  ExternalLink,
  Trash2,
  FolderHeart,
  Clock,
  Shirt,
  Sparkles,
  Camera,
} from 'lucide-react';
import {
  ENERGY_LEVELS,
  generateGoogleCalendarUrl,
  MAIN_GOOGLE_DRIVE_FOLDER,
} from '../../services/loveLifeService';

// Helper untuk memilih emoji stiker otomatis yang relevan dengan kencan
function getDateEmoji(title, category, energyKey) {
  const t = (title || '').toLowerCase();
  const c = (category || '').toLowerCase();

  if (t.includes('basket') || t.includes('sport')) return '🏀';
  if (t.includes('matcha') || t.includes('tea')) return '🍵';
  if (t.includes('gelato') || t.includes('ice cream')) return '🍨';
  if (t.includes('shop') || t.includes('belanja') || t.includes('mall') || t.includes('keramik')) return '🛍️';
  if (t.includes('trampoline') || t.includes('jump')) return '🤸';
  if (t.includes('bali') || t.includes('pkb') || t.includes('budaya') || t.includes('museum') || c.includes('culture')) return '🏛️';
  if (t.includes('study') || t.includes('nugas') || t.includes('buku') || c.includes('productive')) return '📚';
  if (t.includes('sunset') || t.includes('pantai') || t.includes('beach')) return '🌅';
  if (t.includes('yendeem') || t.includes('makan') || t.includes('kuliner') || t.includes('dinner') || c.includes('food')) return '🍽️';
  if (t.includes('coffee') || t.includes('kopi') || t.includes('cafe')) return '☕';
  if (t.includes('movie') || t.includes('bioskop') || t.includes('cinema')) return '🎬';
  if (t.includes('flower') || t.includes('bunga')) return '💐';

  if (energyKey === 'cozy') return '🛋️';
  if (energyKey === 'outdoor') return '🌿';
  if (energyKey === 'romantic') return '🥂';
  if (energyKey === 'casual') return '☕';
  return '💌';
}

// Helper untuk mengubah teks serba kapital (SHOPPING DATE) menjadi Title Case yang ramah dibaca
function toFriendlyTitle(title) {
  if (!title) return '';
  const trimmed = title.trim();
  // Jika teks serba kapital, ubah ke Title Case
  if (trimmed === trimmed.toUpperCase() && trimmed.length > 3) {
    return trimmed
      .toLowerCase()
      .split(' ')
      .map((word) => {
        if (!word) return '';
        if (word === 'pkb' || word === 'pkb:') return word.toUpperCase();
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }
  return trimmed;
}

// Preset gaya border & background glow sesuai mood energi
const MOOD_STYLES = {
  cozy: {
    cardBorder: 'border-amber-500/25 hover:border-amber-400/50',
    cardGlow: 'bg-gradient-to-br from-amber-500/[0.08] via-amber-500/[0.02] to-white/[0.02]',
    badge: 'bg-amber-500/15 text-amber-200 border-amber-500/30',
    iconBg: 'bg-amber-500/15 border-amber-500/30 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
  },
  casual: {
    cardBorder: 'border-teal-500/25 hover:border-teal-400/50',
    cardGlow: 'bg-gradient-to-br from-teal-500/[0.08] via-teal-500/[0.02] to-white/[0.02]',
    badge: 'bg-teal-500/15 text-teal-200 border-teal-500/30',
    iconBg: 'bg-teal-500/15 border-teal-500/30 text-teal-200 shadow-[0_0_15px_rgba(20,184,166,0.15)]',
  },
  outdoor: {
    cardBorder: 'border-emerald-500/25 hover:border-emerald-400/50',
    cardGlow: 'bg-gradient-to-br from-emerald-500/[0.08] via-emerald-500/[0.02] to-white/[0.02]',
    badge: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30',
    iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
  },
  romantic: {
    cardBorder: 'border-rose-500/25 hover:border-rose-400/50',
    cardGlow: 'bg-gradient-to-br from-rose-500/[0.08] via-rose-500/[0.02] to-white/[0.02]',
    badge: 'bg-rose-500/15 text-rose-200 border-rose-500/30',
    iconBg: 'bg-rose-500/15 border-rose-500/30 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.15)]',
  },
  default: {
    cardBorder: 'border-white/10 hover:border-pink-500/40',
    cardGlow: 'bg-white/[0.03]',
    badge: 'bg-white/[0.08] text-neutral-300 border-white/15',
    iconBg: 'bg-pink-500/15 border-pink-500/30 text-pink-200',
  },
};

export default function DateCard({
  date,
  onSchedule,
  onComplete,
  onDelete,
  onViewDrive,
}) {
  const energy =
    ENERGY_LEVELS.find((e) => e.id === date.energyKey) || {
      label: 'Casual & Chill',
      shortLabel: 'Casual',
      color: 'border-pink-500/30 text-pink-200 bg-pink-500/10',
    };

  const isCompleted = date.status === 'completed';
  const isScheduled = date.status === 'scheduled';
  const isWishlist = !isCompleted && !isScheduled;

  const moodStyle = MOOD_STYLES[date.energyKey] || MOOD_STYLES.default;
  const emoji = getDateEmoji(date.title, date.category, date.energyKey);
  const friendlyTitle = toFriendlyTitle(date.title);

  const handleOpenCalendar = (e) => {
    e.stopPropagation();
    const url = generateGoogleCalendarUrl({
      title: friendlyTitle,
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
    <div
      className={`group relative rounded-2xl border backdrop-blur-md transition-all duration-300 overflow-hidden p-4 sm:p-5 flex flex-col justify-between shadow-[0_8px_24px_rgba(0,0,0,0.35)] ${
        isCompleted
          ? 'border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.04] to-white/[0.01] hover:border-emerald-500/40 opacity-90 hover:opacity-100'
          : isScheduled
          ? 'border-pink-500/40 bg-gradient-to-b from-pink-500/[0.12] via-purple-500/[0.03] to-white/[0.02] shadow-[0_0_25px_rgba(244,114,182,0.15)]'
          : `${moodStyle.cardBorder} ${moodStyle.cardGlow}`
      }`}
    >
      <div className="space-y-3">
        {/* Top Header: Mood Badge & Status Tag */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${moodStyle.badge}`}
            >
              <span>{energy.icon || '✨'}</span>
              <span>{energy.shortLabel || energy.label}</span>
            </span>

            {date.category && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-neutral-300">
                {date.category}
              </span>
            )}
          </div>

          <div>
            {isCompleted ? (
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Selesai
              </span>
            ) : isScheduled ? (
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-pink-500/25 border border-pink-500/40 text-pink-200 flex items-center gap-1 shadow-sm">
                <Calendar className="w-3 h-3 text-pink-300 animate-pulse" />
                Terjadwal
              </span>
            ) : (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-neutral-400">
                Wishlist 📌
              </span>
            )}
          </div>
        </div>

        {/* Card Main: Title + Sticker Emoji */}
        <div className="flex items-start justify-between gap-3 pt-0.5">
          <div className="space-y-1 flex-1 min-w-0">
            {/* Title with modern sans typography, overriding Cinzel */}
            <h3 className="!font-sans font-bold text-base sm:text-lg text-white group-hover:text-pink-200 transition-colors tracking-tight leading-snug">
              {friendlyTitle}
            </h3>

            {/* Inline Metadata: Location & Dress Code */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-neutral-300 pt-0.5">
              {date.location && (
                <span className="flex items-center gap-1 text-neutral-300">
                  <MapPin className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                  <span className="truncate max-w-[180px] sm:max-w-[220px] text-neutral-200">
                    {date.location}
                  </span>
                  {date.gmapsUrl && (
                    <button
                      type="button"
                      onClick={handleOpenMaps}
                      title="Buka rute Maps"
                      className="text-[10px] text-pink-300 hover:text-pink-200 underline ml-0.5 flex items-center gap-0.5"
                    >
                      Maps <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  )}
                </span>
              )}

              {date.dressCode && (
                <span className="flex items-center gap-1 text-neutral-300">
                  <Shirt className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span className="text-pink-200/90 font-medium">
                    {date.dressCode}
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Visual Sticker Emoji */}
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 border transition-transform duration-300 group-hover:scale-110 select-none ${moodStyle.iconBg}`}
          >
            {emoji}
          </div>
        </div>

        {/* Scheduled Info Banner (if scheduled) */}
        {isScheduled && date.scheduledDate && (
          <div className="flex items-center gap-2 text-xs text-pink-200 font-medium bg-pink-500/15 border border-pink-500/30 px-3 py-1.5 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-pink-300 flex-shrink-0" />
            <span>
              {date.scheduledDate}
              {date.scheduledStartTime ? ` • ${date.scheduledStartTime} WITA` : ''}
            </span>
          </div>
        )}

        {/* Completed Info (if completed) */}
        {isCompleted && date.completedAt && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-300/90 font-medium bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Telah terlaksana: {date.completedAt}</span>
            {date.driveFolder && (
              <span className="text-neutral-400 font-normal">({date.driveFolder})</span>
            )}
          </div>
        )}

        {/* Notes / Quote Box */}
        {(date.notes || date.caption) && (
          <p className="text-xs text-neutral-300/90 leading-relaxed px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 italic">
            &ldquo;{date.notes || date.caption}&rdquo;
          </p>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
        {/* Left Actions (Delete, Drive) */}
        <div className="flex items-center gap-1.5">
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(date.id);
              }}
              title="Hapus kencan"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/15 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {(date.driveUrl || date.driveFolder || isCompleted) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onViewDrive) {
                  onViewDrive(date);
                } else {
                  const safeUrl =
                    !date.driveUrl ||
                    date.driveUrl.includes('1xG4Z-xUO0c1g49u') ||
                    date.driveUrl.includes('AlspXi')
                      ? MAIN_GOOGLE_DRIVE_FOLDER
                      : date.driveUrl;
                  window.open(safeUrl, '_blank', 'noopener,noreferrer');
                }
              }}
              title={
                date.driveFolder
                  ? `Buka foto kencan di Google Drive`
                  : 'Buka folder foto di Google Drive'
              }
              className="py-1 px-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[11px] text-neutral-300 hover:text-white border border-white/10 transition-all flex items-center gap-1"
            >
              <FolderHeart className="w-3 h-3 text-pink-400" />
              <span>Drive</span>
            </button>
          )}
        </div>

        {/* Right Primary Action */}
        <div className="flex items-center gap-2 ml-auto">
          {isWishlist && onSchedule && (
            <button
              type="button"
              onClick={() => onSchedule(date)}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
            >
              <CalendarHeart className="w-3.5 h-3.5 text-pink-200" />
              <span>Jadwalkan Kencan</span>
            </button>
          )}

          {isScheduled && (
            <>
              <button
                type="button"
                onClick={handleOpenCalendar}
                title="Buka atau sinkronkan ke Google Calendar"
                className="py-1.5 px-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-medium text-pink-200 active:scale-95 transition-all flex items-center gap-1"
              >
                <Calendar className="w-3.5 h-3.5 text-pink-300" />
                <span className="hidden sm:inline">Kalender</span>
              </button>

              {onComplete && (
                <button
                  type="button"
                  onClick={() => onComplete(date)}
                  className="py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5 text-white" />
                  <span>Abadikan Kenangan</span>
                </button>
              )}
            </>
          )}

          {isCompleted && onComplete && (
            <button
              type="button"
              onClick={() => onComplete(date)}
              title="Edit Polaroid kenangan ini"
              className="py-1 px-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-neutral-300 hover:text-white transition-all flex items-center gap-1"
            >
              <Camera className="w-3 h-3 text-pink-400" />
              <span>Lihat Polaroid</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
