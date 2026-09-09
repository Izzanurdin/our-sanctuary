import GlassCard from '../common/GlassCard';
import { Flame, Sparkles, Trophy } from 'lucide-react';
import { getRandomNickname } from '../../config/profiles';

export default function HealthStreakBanner({
  streakCount = 0,
  isCompletedToday = false,
  progressPercent = 0,
  profile,
  className = '',
}) {
  const nickname = getRandomNickname(profile);
  return (
    <GlassCard
      className={`relative overflow-hidden transition-all duration-300 ${
        isCompletedToday
          ? 'border-orange-500/40 bg-gradient-to-r from-orange-500/15 via-pink-500/10 to-rose-500/15 shadow-[0_0_25px_rgba(249,115,22,0.2)]'
          : 'border-pink-500/20 bg-gradient-to-b from-white/[0.04] to-transparent'
      } ${className}`}
    >
      {/* Background ambient glow if completed */}
      {isCompletedToday && (
        <div className="pointer-events-none absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-orange-500/20 blur-2xl animate-pulse" />
      )}

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Glowing Flame Icon */}
          <div
            className={`p-3 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
              isCompletedToday
                ? 'bg-gradient-to-br from-orange-500/30 to-rose-600/30 border-orange-400/50 shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-105'
                : 'bg-white/[0.05] border-white/10 text-neutral-400'
            }`}
          >
            <Flame
              className={`w-6 h-6 transition-all duration-300 ${
                isCompletedToday
                  ? 'text-orange-400 fill-orange-400/80 animate-bounce'
                  : 'text-neutral-400'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-pink-100 flex items-center gap-1.5">
                {streakCount > 0 ? (
                  <>
                    <span className="text-orange-300 font-mono text-base">{streakCount} Hari</span> Streak Sehat!
                  </>
                ) : (
                  'Mulai Health Streak Hari Ini'
                )}
              </h3>
              {isCompletedToday ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-200 font-medium flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-300" />
                  Target Selesai
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono">
                  {progressPercent}%
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
              {isCompletedToday
                ? `Keren banget ${nickname}, konsisten hidup sehat bareng terus ya! ❤️`
                : 'Selesaikan minum 2L air & makan 3x hari ini untuk menyalakan api konsistensi!'}
            </p>
          </div>
        </div>

        {isCompletedToday && (
          <div className="hidden sm:flex p-2 rounded-xl bg-orange-500/10 text-orange-300">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
        )}
      </div>
    </GlassCard>
  );
}
