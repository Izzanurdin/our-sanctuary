import GlassCard from '../common/GlassCard';
import { Footprints, CheckCircle2, Circle, Flame, Calendar } from 'lucide-react';
import { isJoggingDayToday } from '../../services/checklistService';
import { getRandomNickname } from '../../config/profiles';

export default function JoggingTracker({
  jogging = false,
  onToggleJogging,
  readOnly = false,
  profile,
  className = '',
}) {
  const isScheduled = isJoggingDayToday();
  const nickname = getRandomNickname(profile);

  return (
    <GlassCard
      className={`space-y-3.5 border-emerald-500/20 bg-gradient-to-b from-white/[0.04] to-transparent ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Footprints className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-pink-100">
                Jogging 30–45 Menit
              </h3>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  isScheduled
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                    : 'bg-white/10 text-neutral-400'
                }`}
              >
                {isScheduled ? 'Jadwal Hari Ini 🏃' : 'Recovery Day'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Rutin tiap Selasa, Kamis, dan Minggu
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-emerald-300/90 font-medium">
          <Flame className="w-3.5 h-3.5 text-emerald-400" />
          <span>Cardio</span>
        </div>
      </div>

      {/* Interactive Checkbox Card */}
      <button
        type="button"
        disabled={readOnly}
        onClick={() => onToggleJogging && onToggleJogging()}
        className={`w-full p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between select-none ${
          jogging
            ? 'bg-emerald-500/15 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)] text-emerald-100'
            : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.05] text-neutral-300'
        } ${readOnly ? 'cursor-default' : 'active:scale-98 cursor-pointer'}`}
      >
        <div className="flex items-center gap-3">
          <div className="text-left">
            <h4 className="text-xs font-semibold text-pink-100 flex items-center gap-1.5">
              {jogging ? 'Jogging Selesai! 🏅' : 'Checklist Jogging Hari Ini'}
            </h4>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {jogging
                ? `Tubuh bugar, mood senang, mantap ${nickname}!`
                : isScheduled
                ? 'Luangkan 30–45 menit untuk lari santai bareng'
                : 'Hari ini jadwal istirahat, tapi boleh kalau mau bonus jog!'}
            </p>
          </div>
        </div>

        <div>
          {jogging ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
          ) : (
            <Circle className="w-5 h-5 text-neutral-500 hover:text-neutral-400" />
          )}
        </div>
      </button>

      {/* Schedule Footnote */}
      <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 pt-0.5">
        <Calendar className="w-3 h-3 text-neutral-400" />
        <span>Jadwal mingguan: Selasa, Kamis, Minggu (30–45 menit)</span>
      </div>
    </GlassCard>
  );
}
