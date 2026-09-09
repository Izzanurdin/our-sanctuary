import GlassCard from '../common/GlassCard';
import { Flame, Trophy, Bell, Sparkles } from 'lucide-react';
import { getRandomNickname } from '../../config/profiles';

export default function HealthStreakBanner({
  streakCount = 0,
  isCoupleCompleted = false,
  myProgress = { percent: 0, isFullyCompleted: false, completedItems: 0, totalItems: 7 },
  partnerProgress = { percent: 0, isFullyCompleted: false, completedItems: 0, totalItems: 7 },
  user,
  partner,
  onOpenReminder,
  className = '',
}) {
  const partnerNickname = getRandomNickname(partner) || partner?.name || 'Pasangan';

  return (
    <GlassCard
      className={`relative overflow-hidden transition-all duration-300 ${
        isCoupleCompleted
          ? 'border-orange-500/40 bg-gradient-to-r from-orange-500/15 via-pink-500/10 to-rose-500/15 shadow-[0_0_25px_rgba(249,115,22,0.25)]'
          : 'border-pink-500/20 bg-gradient-to-b from-white/[0.04] to-transparent'
      } ${className}`}
    >
      {/* Background ambient glow if completed */}
      {isCoupleCompleted && (
        <div className="pointer-events-none absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-orange-500/20 blur-2xl animate-pulse" />
      )}

      <div className="space-y-3">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Fiery Flame Orb */}
            <div
              className={`p-3 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                isCoupleCompleted
                  ? 'bg-gradient-to-br from-orange-500/30 to-rose-600/30 border-orange-400/50 shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-105'
                  : 'bg-white/[0.05] border-white/10 text-neutral-400'
              }`}
            >
              <Flame
                className={`w-6 h-6 transition-all duration-300 ${
                  isCoupleCompleted
                    ? 'text-orange-400 fill-orange-400/80 animate-bounce'
                    : 'text-neutral-400'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-pink-100 flex items-center gap-1.5">
                  {streakCount > 0 ? (
                    <>
                      <span className="text-orange-300 font-mono text-base">{streakCount} Hari</span> Streak Berdua!
                    </>
                  ) : (
                    'Health Streak Berdua'
                  )}
                </h3>

                {isCoupleCompleted ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-200 font-medium flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-amber-300" />
                    Keduanya Tuntas
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-pink-200 font-medium">
                    Kolaborasi Sehat
                  </span>
                )}
              </div>

              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                {isCoupleCompleted ? (
                  'Luar biasa! Kalian berdua berhasil menyelesaikan target hidup sehat hari ini bersama! ❤️🏆'
                ) : myProgress.isFullyCompleted ? (
                  `Target kamu tuntas! Tunggu ${partnerNickname} menyelesaikan targetnya ya agar streak berdua menyala!`
                ) : partnerProgress.isFullyCompleted ? (
                  `${partnerNickname} sudah 100% selesai lho! Yuk selesaikan bagianmu agar streak kita menyala! 💕`
                ) : (
                  `Yuk saling semangati! Kamu dan ${partnerNickname} harus sama-sama menyelesaikan target sehat hari ini agar streak bertambah!`
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Both Partners Status Pills & Reminder Action */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
          {/* Progress Indicators */}
          <div className="flex items-center gap-2">
            {/* Kamu */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-medium ${
                myProgress.isFullyCompleted
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-white/[0.04] border-white/10 text-neutral-300'
              }`}
            >
              <span>Kamu ({user?.name}):</span>
              <span className="font-bold">{myProgress.percent}%</span>
              {myProgress.isFullyCompleted && '✓'}
            </div>

            {/* Pasangan */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-medium ${
                partnerProgress.isFullyCompleted
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-white/[0.04] border-white/10 text-neutral-300'
              }`}
            >
              <span>{partner?.name}:</span>
              <span className="font-bold">{partnerProgress.percent}%</span>
              {partnerProgress.isFullyCompleted && '✓'}
            </div>
          </div>

          {/* Reminder Button (if partner is not completed yet) */}
          {!partnerProgress.isFullyCompleted && onOpenReminder && (
            <button
              type="button"
              onClick={onOpenReminder}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-pink-500/20 to-rose-500/20 hover:from-pink-500/30 hover:to-rose-500/30 border border-pink-500/40 text-xs font-semibold text-pink-200 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm ml-auto"
            >
              <Bell className="w-3.5 h-3.5 text-pink-300 animate-wiggle" />
              Ingatkan {partner?.name}
            </button>
          )}

          {isCoupleCompleted && (
            <div className="flex items-center gap-1 text-xs text-orange-300 font-medium ml-auto">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Streak Bersama Aktif!</span>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
