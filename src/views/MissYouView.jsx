import { useState, useEffect } from 'react';
import GradientBackground from '../components/common/GradientBackground';
import AppHeader from '../components/common/AppHeader';
import GlassCard from '../components/common/GlassCard';
import GlowingHeartButton from '../components/features/GlowingHeartButton';
import GatewaySettingsModal from '../components/features/GatewaySettingsModal';
import {
  Settings,
  Dices,
  Flame,
  CheckCircle2,
  AlertCircle,
  Radio,
} from 'lucide-react';
import {
  MOOD_OPTIONS,
  generateMissYouMessage,
  getGatewayConfig,
  sendWhatsAppMessage,
  getCooldownRemaining,
  setCooldownSeconds,
  getMissYouStats,
  recordMissYouStat,
} from '../services/whatsapp';
import { getRandomNickname, PROFILES } from '../config/profiles';

export default function MissYouView({ onBack, user }) {
  const [activeMood, setActiveMood] = useState('kangen');
  const [loveCount, setLoveCount] = useState(0);
  const [messageSeed, setMessageSeed] = useState(0);
  const [cooldown, setCooldown] = useState(getCooldownRemaining);
  const [stats, setStats] = useState(getMissYouStats);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [statusBanner, setStatusBanner] = useState(null);
  const [isSending, setIsSending] = useState(false);

  // Tentukan profil pasangan
  const partnerRole = user?.role === 'boyfriend' ? 'girlfriend' : 'boyfriend';
  const partnerProfile = PROFILES.find((p) => p.role === partnerRole);
  const partnerName = partnerProfile?.name || (user?.name === 'Izza' ? 'Cahayu' : 'Izza');
  const nickname = getRandomNickname(partnerProfile);

  // Cek cooldown setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getCooldownRemaining();
      setCooldown(remaining);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate draf pesan saat ini berdasarkan mood, nickname, dan live spam tap count
  const currentPreviewMessage = generateMissYouMessage({
    moodId: activeMood,
    partnerName,
    nickname,
    loveCount,
    seed: messageSeed,
  });

  const handleShuffleMessage = () => {
    setMessageSeed((prev) => prev + 1);
  };

  // Handler pengiriman sinyal rindu
  const handleSendMissYou = async (finalCount) => {
    setIsSending(true);
    setStatusBanner(null);

    const config = getGatewayConfig();
    const targetPhone =
      partnerRole === 'girlfriend'
        ? config.phoneCahayu || ''
        : config.phoneIzza || '';

    // Hitung final message untuk dikirim
    const messageToSend = generateMissYouMessage({
      moodId: activeMood,
      partnerName,
      nickname,
      loveCount: finalCount,
      seed: messageSeed,
    });

    try {
      if (!targetPhone) {
        // Jika nomor belum diatur, buka prompt setting
        setStatusBanner({
          type: 'warning',
          text: `Nomor WhatsApp ${partnerName} belum diisi di Pengaturan Gateway! Silakan klik ikon gear di pojok kanan atas 💕`,
        });
        setIsSettingsOpen(true);
        setIsSending(false);
        return;
      }

      const res = await sendWhatsAppMessage({
        targetPhone,
        message: messageToSend,
      });

      // Simpan cooldown 60 detik
      setCooldownSeconds(60);
      setCooldown(60);

      // Simpan statistik rindu
      const updatedStats = recordMissYouStat(finalCount);
      if (updatedStats) {
        setStats(updatedStats);
      }

      if (res.method === 'fonnte') {
        setStatusBanner({
          type: 'success',
          text: `Sinyal rindu ${finalCount}x berhasil meluncur otomatis via Fonnte Gateway ke WhatsApp ${partnerName}! 🟢`,
        });
      } else {
        setStatusBanner({
          type: 'info',
          text: `Membuka WhatsApp ke nomor ${partnerName} dengan draf ${finalCount}x rindu! 🟡`,
        });
      }
    } catch (err) {
      setStatusBanner({
        type: 'error',
        text: `Gagal mengirim sinyal rindu: ${err.message}`,
      });
    } finally {
      setIsSending(false);
      setLoveCount(0);
    }
  };

  const config = getGatewayConfig();
  const isFonnteActive = Boolean(config.fonnteToken?.trim());

  return (
    <GradientBackground>
      <AppHeader
        title="I Miss You"
        subtitle="Kanal Afeksi & Rindu Instan"
        onBack={onBack}
        rightAction={
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Pengaturan Gateway"
            className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] active:scale-95 text-pink-300 border border-white/10 transition-all flex items-center gap-1.5"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px] font-medium">Gateway</span>
          </button>
        }
      />

      <div className="space-y-4 max-w-md mx-auto pb-6">
        {/* Status Notification Banner */}
        {statusBanner && (
          <div
            className={`p-3 rounded-2xl border text-xs flex items-start gap-2 animate-in fade-in ${
              statusBanner.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
                : statusBanner.type === 'warning'
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-200'
                : statusBanner.type === 'info'
                ? 'bg-blue-500/15 border-blue-500/30 text-blue-200'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-200'
            }`}
          >
            {statusBanner.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-[11px] leading-relaxed">
              {statusBanner.text}
            </div>
          </div>
        )}

        {/* Gateway Connection Indicator Pill */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-[11px]">
          <span className="text-neutral-400 flex items-center gap-1.5">
            <Radio
              className={`w-3 h-3 ${
                isFonnteActive ? 'text-emerald-400 animate-pulse' : 'text-amber-400'
              }`}
            />
            {isFonnteActive ? 'Gateway Fonnte Siap' : 'Direct Link wa.me'}
          </span>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="text-pink-300/80 hover:text-pink-200 underline decoration-pink-500/30"
          >
            Ubah Pengaturan
          </button>
        </div>

        {/* 1. Mood Selector Pills */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider px-1">
            Pilih Suasana Rindumu:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {MOOD_OPTIONS.map((mood) => {
              const isSelected = activeMood === mood.id;
              return (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => setActiveMood(mood.id)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all flex items-center gap-2 text-left ${
                    isSelected
                      ? 'bg-pink-500/25 border-pink-400/80 text-white shadow-lg shadow-pink-500/20 scale-[1.02]'
                      : 'bg-white/[0.04] border-white/10 text-neutral-300 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  <span className="text-base">{mood.emoji}</span>
                  <span className="truncate">{mood.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Dynamic Live Message Preview Card */}
        <GlassCard className="p-3.5 space-y-2 border-pink-500/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-pink-200 flex items-center gap-1">
              <span>Draf Pesan WhatsApp:</span>
              {loveCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-pink-500/20 border border-amber-500/40 text-[10px] text-amber-300 font-bold animate-pulse">
                  <Flame className="w-2.5 h-2.5" />
                  {loveCount}x Taps!
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={handleShuffleMessage}
              className="text-[11px] text-pink-300/80 hover:text-pink-200 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all"
            >
              <Dices className="w-3 h-3 text-pink-400" />
              <span>Acak Variasi</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-xs text-neutral-200 leading-relaxed font-sans whitespace-pre-line italic">
            "{currentPreviewMessage}"
          </div>

          <p className="text-[10px] text-neutral-400 text-right">
            Penerima:{' '}
            <span className="text-pink-300 font-semibold">{partnerName}</span>{' '}
            ({partnerRole === 'girlfriend' ? 'Girlfriend ❤️' : 'Boyfriend 💫'})
          </p>
        </GlassCard>

        {/* 3. Centerpiece: Glowing Heart Button with Love Charge & Spam Counter */}
        <GlowingHeartButton
          partnerName={partnerName}
          cooldownRemaining={cooldown}
          onSend={handleSendMissYou}
          onTapCountChange={setLoveCount}
          isSending={isSending}
        />

        {/* 4. Love Stats Footer Card */}
        <div className="pt-2">
          <GlassCard className="p-3 rounded-2xl border-white/10 text-center">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Statistik Sinyal Rindu Berdua
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="font-mono text-sm font-bold text-pink-300">
                  {stats.totalSignalsSent || 0}x
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  Terkirim
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="font-mono text-sm font-bold text-rose-300">
                  {stats.totalTapsRecorded || 0}x
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  Total Ketukan
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="font-mono text-sm font-bold text-amber-300">
                  {stats.highestSpamRecord || 0}x
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  Rekor Spam
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Gateway Settings Modal */}
      <GatewaySettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={user}
      />
    </GradientBackground>
  );
}
