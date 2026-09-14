import GlassCard from '../common/GlassCard';
import { Droplets, CheckCircle2, Circle } from 'lucide-react';
import { getRandomNickname } from '../../config/profiles';

const WATER_SLOTS = [
  { id: 0, time: '08:30', title: 'Pagi Hari', amount: '500 ml', target: '500 ml' },
  { id: 1, time: '12:30', title: 'Siang Hari', amount: '500 ml', target: '1.000 ml' },
  { id: 2, time: '16:30', title: 'Sore Hari', amount: '500 ml', target: '1.500 ml' },
  { id: 3, time: '20:00', title: 'Malam Hari', amount: '500 ml', target: '2.000 ml' },
];

export default function WaterTracker({
  water = [false, false, false, false],
  onToggleSlot,
  readOnly = false,
  profile,
  className = '',
}) {
  const completedCount = water.filter(Boolean).length;
  const currentMl = completedCount * 500;
  const percentage = Math.round((currentMl / 2000) * 100);
  const nickname = getRandomNickname(profile);

  return (
    <GlassCard className={`space-y-4 border-cyan-500/20 bg-gradient-to-b from-white/[0.04] to-transparent ${className}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] shrink-0">
            <Droplets className="w-5 h-5 animate-pulse" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-pink-100 flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span>Mimik</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono whitespace-nowrap">
                Target 2.000 ml
              </span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5 truncate">
              Jangan lupa mimik ya <span className="text-cyan-300 font-medium">{nickname}</span> ❤️
            </p>
          </div>
        </div>

        {/* Progress Percentage Badge */}
        <div className="text-right shrink-0 whitespace-nowrap pl-1">
          <span className="font-mono text-sm sm:text-base font-bold text-cyan-300 whitespace-nowrap">
            {currentMl} <span className="text-[11px] sm:text-xs font-normal text-neutral-400 whitespace-nowrap">/ 2.000 ml</span>
          </span>
          <p className="text-[10px] sm:text-[11px] text-cyan-200/80 font-medium whitespace-nowrap">
            {percentage}% Tercapai
          </p>
        </div>
      </div>

      {/* Dynamic Animated Progress Bar */}
      <div className="relative w-full h-2 rounded-full bg-white/[0.06] overflow-hidden border border-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* 4 Time Slots Grid */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {WATER_SLOTS.map((slot) => {
          const isDone = Boolean(water[slot.id]);
          return (
            <button
              key={slot.id}
              type="button"
              disabled={readOnly}
              onClick={() => onToggleSlot && onToggleSlot(slot.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex items-center justify-between select-none ${
                isDone
                  ? 'bg-cyan-500/15 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)] text-cyan-100'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.05] text-neutral-300'
              } ${readOnly ? 'cursor-default' : 'active:scale-98 cursor-pointer'}`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-semibold tracking-wider text-pink-100">
                    {slot.time}
                  </span>
                  <span className="text-[10px] text-neutral-400">({slot.amount})</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {slot.title}
                </p>
              </div>

              <div>
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
                ) : (
                  <Circle className="w-5 h-5 text-neutral-500 hover:text-neutral-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}
