import { useState } from 'react';
import GradientBackground from '../components/common/GradientBackground';
import GlassCard from '../components/common/GlassCard';
import AppHeader from '../components/common/AppHeader';
import UserAvatar from '../components/common/UserAvatar';
import BaliClock from '../components/features/BaliClock';
import { getRandomGreeting, PROFILES } from '../config/profiles';
import { getDailyData, getCoupleHealthStatus } from '../services/checklistService';
import { getLoveLifeData } from '../services/loveLifeService';
import { getGardenFlowers } from '../services/gardenService';
import {
  CheckSquare2,
  Heart,
  LogOut,
  ArrowRight,
  CalendarHeart,
  Sparkles,
  Flame,
  Flower2,
} from 'lucide-react';

export default function DashboardView({ user, onNavigate, onLogout }) {
  const [greeting, setGreeting] = useState(() => getRandomGreeting(user));
  const [dailyData] = useState(() => getDailyData());
  const [loveLifeData] = useState(() => getLoveLifeData());
  const [gardenFlowers] = useState(() => getGardenFlowers());

  const handleRerollGreeting = () => {
    setGreeting(getRandomGreeting(user));
  };

  const coupleStatus = getCoupleHealthStatus(dailyData);
  const partnerId = user?.id === 'user_sayang' ? 'user_izza' : 'user_sayang';
  const partnerProfile = PROFILES.find((p) => p.id === partnerId);
  const partnerName = partnerProfile?.name || (user?.id === 'user_sayang' ? 'Izza' : 'Cahayu');

  const myProgress = user?.id === 'user_sayang' ? coupleStatus.sayangProgress : coupleStatus.izzaProgress;
  const partnerProgress = user?.id === 'user_sayang' ? coupleStatus.izzaProgress : coupleStatus.sayangProgress;

  const isCoupleHealthy = coupleStatus.isCoupleDone;
  const streakCount = coupleStatus.displayStreak;

  const checklistBadge = isCoupleHealthy
    ? '🔥 Streak Berdua Aktif'
    : myProgress.isFullyCompleted
    ? `Kamu 100% • Tunggu ${partnerName}`
    : partnerProgress.isFullyCompleted
    ? `${partnerName} 100% • Giliranmu!`
    : `${myProgress.completedItems}/${myProgress.totalItems} Kamu • ${partnerProgress.completedItems}/${partnerProgress.totalItems} ${partnerName}`;

  const scheduledDates = loveLifeData?.dates?.filter((d) => d.status === 'scheduled') || [];
  const completedDatesCount = loveLifeData?.dates?.filter((d) => d.status === 'completed')?.length || 8;

  const loveLifeBadge = scheduledDates.length > 0
    ? `🗓️ ${scheduledDates[0].title}`
    : `${completedDatesCount} Kencan Selesai ❤️`;

  const navItems = [
    {
      id: 'daily',
      title: 'Daily Checklist',
      subtitle: 'Target 2L Air, Jadwal Makan & Tugas Kuliah',
      icon: CheckSquare2,
      badge: checklistBadge,
      accentColor: 'text-pink-300',
      iconBg: 'bg-pink-500/20 border-pink-500/30',
      hoverBorder: 'hover:border-pink-500/50',
    },
    {
      id: 'lovelife',
      title: 'Love Life',
      subtitle: 'Date Deck, Shuffler Kencan & Memory Vault',
      icon: CalendarHeart,
      badge: loveLifeBadge,
      accentColor: 'text-rose-300',
      iconBg: 'bg-rose-500/20 border-rose-500/30',
      hoverBorder: 'hover:border-rose-500/50',
    },
    {
      id: 'missyou',
      title: 'I Miss You',
      subtitle: 'Kirim Tombol Rindu Instan ke WhatsApp',
      icon: Heart,
      badge: 'Afeksi Instan',
      accentColor: 'text-pink-400',
      iconBg: 'bg-gradient-to-r from-pink-500/30 to-rose-600/30 border-pink-500/40',
      hoverBorder: 'hover:border-pink-400/60',
      isPulse: true,
    },
    {
      id: 'garden',
      title: 'Unwithering Garden',
      subtitle: 'Taman Bunga Abadi, Bisikan Rahasia & Kunang-kunang',
      icon: Flower2,
      badge: `${gardenFlowers?.length || 0} Bunga Mekar 🌸`,
      accentColor: 'text-emerald-300',
      iconBg: 'bg-gradient-to-r from-emerald-500/30 to-teal-600/30 border-emerald-500/40',
      hoverBorder: 'hover:border-emerald-400/60',
    },
  ];

  return (
    <GradientBackground>
      {/* Top Bar with User Info & Logout */}
      <AppHeader
        title="Our Sanctuary"
        subtitle="Digital Love Journal & Daily Tracker"
        rightAction={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs text-pink-200">
              <UserAvatar profile={user} size="sm" />
              <span className="font-medium text-[11px]">{user?.name || 'Sayang'}</span>
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                title="Ganti Profil / Keluar"
                aria-label="Ganti Profil"
                className="p-1.5 rounded-full bg-white/[0.06] hover:bg-rose-500/20 hover:border-rose-500/30 border border-white/10 text-neutral-400 hover:text-rose-300 transition-all active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        }
      />

      {/* Main Section */}
      <div className="my-auto py-2 space-y-6">
        {/* Center Glowing Hero / Greeting */}
        <div className="flex flex-col items-center text-center py-4">
          {/* Animated Glowing Orb: Flame if Couple Health Completed, Heart if normal */}
          <div className="relative mb-5 flex items-center justify-center">
            {isCoupleHealthy ? (
              <>
                <div className="absolute w-32 h-32 rounded-full bg-orange-500/25 blur-3xl animate-pulse" />
                <div className="relative p-5 rounded-full bg-gradient-to-b from-orange-500/20 to-rose-600/20 border border-orange-400/50 shadow-[0_0_35px_rgba(249,115,22,0.4)] animate-soft-pulse">
                  <Flame className="w-10 h-10 text-orange-400 fill-orange-400/80 animate-bounce" />
                </div>
              </>
            ) : (
              <>
                <div className="absolute w-28 h-28 rounded-full bg-pink-500/20 blur-2xl animate-pulse" />
                <div className="relative p-5 rounded-full bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-pink-500/30 shadow-[0_0_30px_rgba(244,114,182,0.25)] animate-soft-pulse">
                  <Heart className="w-10 h-10 text-pink-400 fill-pink-500/30" />
                </div>
              </>
            )}
          </div>

          <h2
            onClick={handleRerollGreeting}
            title="Sentuh untuk acak panggilan sayang ✨"
            className="text-lg sm:text-xl font-bold text-pink-100 tracking-wider mb-1.5 px-3 cursor-pointer hover:text-pink-200 transition-colors inline-flex items-center justify-center gap-1.5 flex-wrap leading-snug select-none group font-cinzel"
          >
            <span>{greeting}</span>
            <Sparkles className="w-3.5 h-3.5 text-pink-400/60 group-hover:text-pink-300 group-hover:rotate-12 transition-all" />
          </h2>

          {isCoupleHealthy ? (
            <div className="my-1.5 px-3.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-xs text-orange-200 animate-in fade-in flex items-center gap-1.5 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="font-semibold">{streakCount > 0 ? `${streakCount} Hari Streak Berdua!` : 'Target Sehat Selesai!'}</span>
              <span className="text-[11px] text-orange-300/90">• Keren berdua, api cinta & sehat terus menyala! 🔥❤️</span>
            </div>
          ) : myProgress.isFullyCompleted ? (
            <div className="my-1.5 px-3.5 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-xs text-pink-200 animate-in fade-in flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
              <span>Target kamu tuntas! Tunggu {partnerName} untuk nyalakan streak ya ✨</span>
            </div>
          ) : partnerProgress.isFullyCompleted ? (
            <div className="my-1.5 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200 animate-in fade-in flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              <span>{partnerName} sudah 100%! Yuk selesaikan bagianmu 💪</span>
            </div>
          ) : (
            <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
              Tempat privat kita untuk saling menjaga kesehatan, merencanakan kencan impian, dan berbagi rindu.
            </p>
          )}

          {/* Bali Time Widget */}
          <BaliClock className="mt-3.5" />
        </div>

        {/* 4 Main Navigation Glass Cards (1 Col on Mobile, 2x2 Grid on PC) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <GlassCard
                key={item.id}
                onClick={() => onNavigate && onNavigate(item.id)}
                className={`group border-white/10 ${item.hoverBorder} transition-all duration-300 md:p-5 flex flex-col justify-center`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <div
                      className={`p-3 sm:p-3.5 rounded-2xl ${item.iconBg} border shadow-[0_4px_16px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform duration-200 flex-shrink-0`}
                    >
                      <Icon
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${item.accentColor} ${
                          item.isPulse ? 'animate-pulse fill-pink-500/40' : ''
                        }`}
                      />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-semibold text-pink-100 group-hover:text-pink-200 font-cinzel tracking-wider">
                          {item.title}
                        </h3>
                        <span className="text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-md bg-white/10 text-pink-200/80 font-medium">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1 sm:line-clamp-2">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] text-neutral-500 group-hover:text-pink-300 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-2">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center pt-4 pb-2 text-[11px] text-neutral-500 select-none">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart className="w-3 h-3 text-pink-400 fill-pink-400" /> for Sayang
        </p>
        <p className="text-[10px] text-neutral-600 mt-0.5">
          Target Rilis: 15 September 2026
        </p>
      </footer>
    </GradientBackground>
  );
}
