import React from 'react';
import GradientBackground from './components/common/GradientBackground';
import GlassCard from './components/common/GlassCard';
import { Heart, Sparkles } from 'lucide-react';

export default function App() {
  return (
    <GradientBackground>
      <header className="text-center pt-8">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-pink-500/10 border border-pink-500/20 mb-4 animate-pulse">
          <Sparkles className="w-6 h-6 text-pink-300" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-pink-100">
          Our Private Space
        </h1>
        <p className="text-xs text-pink-200/60 mt-1">
          Digital Love Journal & Daily Tracker
        </p>
      </header>

      <section className="my-auto space-y-4">
        <GlassCard className="text-center py-6 border-pink-500/20">
          <p className="text-sm text-neutral-300">
            Fondasi layout & tema <span className="text-pink-400 font-medium">Dark Romantic</span> aktif.
          </p>
        </GlassCard>
      </section>

      <footer className="text-center pb-4 text-[11px] text-neutral-500 flex items-center justify-center gap-1">
        Made with <Heart className="w-3 h-3 text-pink-400 fill-pink-400" /> for Sayang
      </footer>
    </GradientBackground>
  );
}