import GlassCard from '../common/GlassCard';
import { Utensils, CheckCircle2, Circle, Sunrise, Sun, Moon } from 'lucide-react';
import { getRandomNickname } from '../../config/profiles';

const MEAL_ITEMS = [
  {
    key: 'breakfast',
    title: 'Sarapan Pagi',
    subtitle: 'Energi awal untuk memulai hari',
    icon: Sunrise,
    timeRange: '07:00 - 10:00',
    color: 'text-amber-300',
    borderDone: 'border-amber-500/40 bg-amber-500/15',
  },
  {
    key: 'lunch',
    title: 'Makan Siang',
    subtitle: 'Recharge tenaga di sela aktivitas',
    icon: Sun,
    timeRange: '12:00 - 14:00',
    color: 'text-orange-300',
    borderDone: 'border-orange-500/40 bg-orange-500/15',
  },
  {
    key: 'dinner',
    title: 'Makan Malam',
    subtitle: 'Makan malam santai & penutup hari',
    icon: Moon,
    timeRange: '18:30 - 21:00',
    color: 'text-rose-300',
    borderDone: 'border-rose-500/40 bg-rose-500/15',
  },
];

export default function MealTracker({
  meals = { breakfast: false, lunch: false, dinner: false },
  onToggleMeal,
  readOnly = false,
  profile,
  className = '',
}) {
  const completedCount = Object.values(meals).filter(Boolean).length;
  const nickname = getRandomNickname(profile);

  return (
    <GlassCard className={`space-y-3.5 border-amber-500/20 bg-gradient-to-b from-white/[0.04] to-transparent ${className}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0">
            <Utensils className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-pink-100 flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span>Mamam</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono whitespace-nowrap">
                3x Sehari
              </span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5 truncate">
              Jangan lupa disuapin yampie nya ya <span className="text-amber-300 font-medium">{nickname}</span> ❤️
            </p>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="text-right shrink-0 whitespace-nowrap pl-1">
          <span className="font-mono text-sm sm:text-base font-bold text-amber-300 whitespace-nowrap">
            {completedCount} <span className="text-[11px] sm:text-xs font-normal text-neutral-400 whitespace-nowrap">/ 3 Selesai</span>
          </span>
        </div>
      </div>

      {/* 3 Meals List */}
      <div className="space-y-2 pt-1">
        {MEAL_ITEMS.map((item) => {
          const isDone = Boolean(meals[item.key]);
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              disabled={readOnly}
              onClick={() => onToggleMeal && onToggleMeal(item.key)}
              className={`w-full p-3 rounded-xl border text-left transition-all duration-200 flex items-center justify-between select-none ${
                isDone
                  ? `${item.borderDone} shadow-[0_0_12px_rgba(245,158,11,0.15)] text-pink-100`
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.05] text-neutral-300'
              } ${readOnly ? 'cursor-default' : 'active:scale-98 cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg bg-white/[0.04] border border-white/10 ${
                    isDone ? item.color : 'text-neutral-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-pink-100">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {item.timeRange}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <div>
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-amber-400 fill-amber-400/20" />
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
