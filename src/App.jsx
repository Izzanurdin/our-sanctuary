import React, { useState } from 'react';
import GradientBackground from './components/common/GradientBackground';
import GlassCard from './components/common/GlassCard';
import AppHeader from './components/common/AppHeader';
import ModalWrapper from './components/common/ModalWrapper';
import {
  Sparkles,
  Heart,
  CheckCircle2,
  Layers,
  ArrowRight,
  Eye,
  ShieldCheck,
} from 'lucide-react';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backNotif, setBackNotif] = useState('');

  const handleBack = () => {
    setBackNotif('Tombol kembali AppHeader berfungsi!');
    setTimeout(() => setBackNotif(''), 2500);
  };

  return (
    <GradientBackground>
      {/* 1. AppHeader Component */}
      <div>
        <AppHeader
          title="Our Private Space"
          subtitle="Digital Love Journal & Daily Tracker"
          onBack={handleBack}
          rightAction={
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-[11px] font-medium text-pink-300">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
              Fase 1 Aktif
            </div>
          }
        />

        {backNotif && (
          <div className="mb-4 py-2 px-3 rounded-xl bg-pink-500/20 border border-pink-500/40 text-xs text-pink-200 text-center animate-in fade-in slide-in-from-top-2">
            {backNotif}
          </div>
        )}
      </div>

      {/* 2. Main Showcase Section */}
      <section className="space-y-4 my-auto py-2">
        {/* Banner Status Fase 1 */}
        <GlassCard className="border-pink-500/30 bg-gradient-to-b from-white/[0.06] to-transparent">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-pink-100 flex items-center gap-2">
                Fase 1 (Fondasi & Layout) Selesai
              </h2>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                Seluruh fondasi arsitektur, tema <span className="text-pink-300 font-medium">Dark Romantic</span>, dan komponen bersama (<span className="text-neutral-100">common</span>) telah selesai diimplementasikan.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
            {[
              { name: 'GradientBackground.jsx', desc: 'Latar gelap + ambient glow orbs' },
              { name: 'GlassCard.jsx', desc: 'Kontainer kaca transparan & border' },
              { name: 'AppHeader.jsx', desc: 'Bar navigasi atas, judul & tombol back' },
              { name: 'ModalWrapper.jsx', desc: 'Pop-up dialog kaca & backdrop blur' },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-neutral-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                  <code className="text-pink-200/90 font-mono text-[11px]">{item.name}</code>
                </span>
                <span className="text-[11px] text-neutral-400">{item.desc}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Interactive Modal Test */}
        <GlassCard
          onClick={() => setIsModalOpen(true)}
          className="border-white/15 hover:border-pink-500/40 group cursor-pointer transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-pink-300 group-hover:scale-110 group-hover:bg-pink-500/20 transition-all duration-300">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-pink-100 group-hover:text-pink-200">
                  Uji Komponen ModalWrapper
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Klik untuk melihat efek pop-up dialog kaca
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-pink-400/60 group-hover:text-pink-300 group-hover:translate-x-1 transition-all" />
          </div>
        </GlassCard>

        {/* Teaser Fase 2 */}
        <GlassCard className="border-pink-500/15 bg-white/[0.02]">
          <div className="flex items-center gap-2.5 mb-1.5 text-xs font-medium text-pink-300">
            <ShieldCheck className="w-4 h-4 text-pink-400" />
            Langkah Selanjutnya: Fase 2
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Menghubungkan <span className="text-neutral-200">PinPad.jsx</span>, pemilih profil (<span className="text-neutral-200">Izza / Sayang</span>), dan beranda sapaan minimalis di <span className="text-neutral-200">DashboardView</span>.
          </p>
        </GlassCard>
      </section>

      {/* 3. Footer */}
      <footer className="text-center pt-4 pb-2 text-[11px] text-neutral-500 select-none">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart className="w-3 h-3 text-pink-400 fill-pink-400" /> for Sayang
        </p>
        <p className="text-[10px] text-neutral-600 mt-0.5">
          Target Rilis: 15 September 2026
        </p>
      </footer>

      {/* 4. ModalWrapper Demonstration */}
      <ModalWrapper
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Pratinjau Komponen Modal"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs text-pink-200">
            <div className="flex items-center gap-2 font-medium mb-1 text-pink-300">
              <Sparkles className="w-4 h-4" />
              Siap untuk Fase 3 & Fase 4
            </div>
            Modal dialog ini siap menjadi wadah formulir input:
            <ul className="list-disc list-inside mt-1.5 space-y-0.5 text-neutral-300 text-[11px]">
              <li><code className="text-pink-200">AddTaskModal.jsx</code> (Tugas Kuliah & Kerja)</li>
              <li><code className="text-pink-200">AddDateModal.jsx</code> (Ide Kencan Baru)</li>
            </ul>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            Mendukung penutupan dengan tombol <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-white/10 text-pink-200 border border-white/10">Esc</kbd>, klik area gelap di luar kotak, atau tombol silang di kanan atas.
          </p>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-pink-500/25 active:scale-98 transition-all"
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>
      </ModalWrapper>
    </GradientBackground>
  );
}