import { useState } from 'react';
import GradientBackground from '../components/common/GradientBackground';
import GlassCard from '../components/common/GlassCard';
import AppHeader from '../components/common/AppHeader';
import UserAvatar from '../components/common/UserAvatar';
import BaliClock from '../components/features/BaliClock';
import { getRandomGreeting } from '../config/profiles';
import {
  CheckSquare2,
  Heart,
  LogOut,
  ArrowRight,
  CalendarHeart,
  Sparkles,
} from 'lucide-react';

export default function DashboardView({ user, onNavigate, onLogout }) {
  const [greeting, setGreeting] = useState(() => getRandomGreeting(user));

  const handleRerollGreeting = () => {
    setGreeting(getRandomGreeting(user));
  };

  const navItems = [
    {
      id: 'daily',
      title: 'Daily Checklist',
      subtitle: 'Target 2L Air, Jadwal Makan & Tugas Kuliah',
      icon: CheckSquare2,
      badge: 'Rutinitas',
      accentColor: 'text-pink-300',
      iconBg: 'bg-pink-500/20 border-pink-500/30',
      hoverBorder: 'hover:border-pink-500/50',
    },
    {
      id: 'lovelife',
      title: 'Love Life',
      subtitle: 'Date Deck, Shuffler Kencan & Memory Vault',
      icon: CalendarHeart,
      badge: 'Kencan & Foto',
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
  ];

  return (
    <GradientBackground>
      {/* Top Bar with User Info & Logout */}
      <AppHeader
        title="Our Private Space"
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
          {/* Animated Glowing Heart Orb */}
          <div className="relative mb-5 flex items-center justify-center">
            <div className="absolute w-28 h-28 rounded-full bg-pink-500/20 blur-2xl animate-pulse" />
            <div className="relative p-5 rounded-full bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-pink-500/30 shadow-[0_0_30px_rgba(244,114,182,0.25)] animate-soft-pulse">
              <Heart className="w-10 h-10 text-pink-400 fill-pink-500/30" />
            </div>
          </div>

          <h2
            onClick={handleRerollGreeting}
            title="Sentuh untuk acak panggilan sayang ✨"
            className="text-lg sm:text-xl font-bold text-pink-100 tracking-tight mb-1.5 px-3 cursor-pointer hover:text-pink-200 transition-colors inline-flex items-center justify-center gap-1.5 flex-wrap leading-snug select-none group"
          >
            <span>{greeting}</span>
            <Sparkles className="w-3.5 h-3.5 text-pink-400/60 group-hover:text-pink-300 group-hover:rotate-12 transition-all" />
          </h2>
          <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
            Tempat privat kita untuk saling menjaga kesehatan, merencanakan kencan impian, dan berbagi rindu.
          </p>

          {/* Bali Time Widget */}
          <BaliClock className="mt-3.5" />
        </div>

        {/* 3 Main Navigation Glass Cards */}
        <div className="space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <GlassCard
                key={item.id}
                onClick={() => onNavigate && onNavigate(item.id)}
                className={`group border-white/10 ${item.hoverBorder} transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`p-3 rounded-2xl ${item.iconBg} border shadow-[0_4px_16px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform duration-200`}
                    >
                      <Icon
                        className={`w-5 h-5 ${item.accentColor} ${
                          item.isPulse ? 'animate-pulse fill-pink-500/40' : ''
                        }`}
                      />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-pink-100 group-hover:text-pink-200">
                          {item.title}
                        </h3>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-pink-200/80 font-medium">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white/[0.03] text-neutral-500 group-hover:text-pink-300 group-hover:translate-x-1 transition-all duration-200">
                    <ArrowRight className="w-4 h-4" />
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
