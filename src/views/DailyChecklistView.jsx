import GradientBackground from '../components/common/GradientBackground';
import AppHeader from '../components/common/AppHeader';
import GlassCard from '../components/common/GlassCard';
import { CheckSquare2, Droplets, Utensils, ListTodo } from 'lucide-react';

export default function DailyChecklistView({ onBack, user }) {
  return (
    <GradientBackground>
      <AppHeader
        title="Daily Checklist"
        subtitle="Pemantau Rutinitas Harian & Kesehatan"
        onBack={onBack}
        rightAction={
          <div className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300">
            Fase 3
          </div>
        }
      />

      <div className="my-auto py-2 space-y-4">
        {/* Banner Info */}
        <GlassCard className="border-pink-500/30 bg-gradient-to-b from-white/[0.06] to-transparent">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-300">
              <CheckSquare2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-pink-100 flex items-center gap-1.5">
                Modul Rutinitas Harian
              </h3>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                Fitur ini akan segera diaktifkan di <span className="text-pink-300 font-medium">Fase 3</span> untuk mencatat asupan air, jadwal makan, dan tugas kuliah/kerja {user?.name || 'kamu'}.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Feature Preview Cards */}
        <div className="space-y-3">
          <GlassCard className="border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-pink-100">Water Tracker (2.000 ml)</h4>
                <p className="text-[11px] text-neutral-400">4 pos waktu: 08:30, 12:30, 16:30, 20:00</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-pink-100">Pola Makan 3x Sehari</h4>
                <p className="text-[11px] text-neutral-400">Sarapan Pagi, Makan Siang, dan Makan Malam</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300">
                <ListTodo className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-pink-100">Daftar Tugas Kustom</h4>
                <p className="text-[11px] text-neutral-400">Tugas Kuliah & Pekerjaan dengan strikethrough effect</p>
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
          Auto reset setiap 00:00 tengah malam
        </p>
      </footer>
    </GradientBackground>
  );
}
