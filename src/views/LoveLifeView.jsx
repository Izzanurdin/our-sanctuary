import GradientBackground from '../components/common/GradientBackground';
import AppHeader from '../components/common/AppHeader';
import GlassCard from '../components/common/GlassCard';
import { CalendarHeart, Shuffle, Image } from 'lucide-react';

export default function LoveLifeView({ onBack, user }) {
  return (
    <GradientBackground>
      <AppHeader
        title="Love Life"
        subtitle="Date Deck & Memory Vault"
        onBack={onBack}
        rightAction={
          <div className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300">
            Fase 4
          </div>
        }
      />

      <div className="my-auto py-2 space-y-4">
        {/* Banner Info */}
        <GlassCard className="border-rose-500/30 bg-gradient-to-b from-white/[0.06] to-transparent">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300">
              <CalendarHeart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-pink-100 flex items-center gap-1.5">
                Kencan & Memori Bersama
              </h3>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                Modul ini akan diaktifkan di <span className="text-rose-300 font-medium">Fase 4</span>. Berisi pengacak ide kencan instan berdasarkan level energi dan album polaroid kenangan manis {user?.name || 'kita'}.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Feature Preview Cards */}
        <div className="space-y-3">
          <GlassCard className="border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-300">
                <Shuffle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-pink-100">Date Deck & Shuffler</h4>
                <p className="text-[11px] text-neutral-400">Pilih kencan acak (Low Energy, Outdoor, Romantic)</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300">
                <CalendarHeart className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-pink-100">Google Calendar Intent</h4>
                <p className="text-[11px] text-neutral-400">Jadwalkan kencan langsung ke kalender HP</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300">
                <Image className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-pink-100">Memory Vault (Polaroid)</h4>
                <p className="text-[11px] text-neutral-400">Galeri foto kencan via Google Drive & catatan kenangan</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] active:scale-98 border border-white/10 text-xs font-medium text-pink-200 transition-all text-center"
        >
          Kembali ke Dashboard
        </button>
      </div>

      <footer className="text-center pt-4 pb-2 text-[11px] text-neutral-500 select-none">
        <p className="flex items-center justify-center gap-1">
          Special memories made for two
        </p>
      </footer>
    </GradientBackground>
  );
}
