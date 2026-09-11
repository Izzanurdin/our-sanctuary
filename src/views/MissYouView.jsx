import { useState, useEffect } from 'react';
import GradientBackground from '../components/common/GradientBackground';
import AppHeader from '../components/common/AppHeader';
import GlassCard from '../components/common/GlassCard';
import GlowingHeartButton from '../components/features/GlowingHeartButton';
import {
  Dices,
  Flame,
  CheckCircle2,
  AlertCircle,
  Bell,
  BellRing,
} from 'lucide-react';
import {
  MOOD_OPTIONS,
  generateMissYouMessage,
  getCooldownRemaining,
  setCooldownSeconds,
  getMissYouStats,
  logMissYouSignalToCloud,
  fetchMissYouStatsFromCloud,
  subscribeToMissYouRealtime,
  getAffectionTier,
  playCelebrationFanfare,
} from '../services/whatsapp';
import {
  showWebNotification,
  getNotificationPermission,
  requestNotificationPermission,
  isNotificationSupported,
  testNotification,
} from '../services/notificationService';
import { getRandomNickname, PROFILES } from '../config/profiles';

export default function MissYouView({ onBack, user }) {
  const [activeMood, setActiveMood] = useState('kangen');
  const [loveCount, setLoveCount] = useState(0);
  const [messageSeed, setMessageSeed] = useState(0);
  const [cooldown, setCooldown] = useState(getCooldownRemaining);
  const [stats, setStats] = useState(getMissYouStats);
  const [statusBanner, setStatusBanner] = useState(null);
  const [incomingSignal, setIncomingSignal] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(() => getNotificationPermission());



  // Tentukan profil pasangan
  const partnerRole = user?.role === 'boyfriend' ? 'girlfriend' : 'boyfriend';
  const partnerProfile = PROFILES.find((p) => p.role === partnerRole);
  const partnerName = partnerProfile?.name || (user?.name === 'Izza' ? 'Cahayu' : 'Izza');
  const partnerId = user?.id === 'user_sayang' ? 'user_izza' : 'user_sayang';
  const nickname = getRandomNickname(partnerProfile);

  // Ambil statistik cloud dan dengarkan sinyal rindu realtime
  useEffect(() => {
    let isMounted = true;

    // 1. Ambil agregasi statistik dari Supabase
    fetchMissYouStatsFromCloud().then((cloudStats) => {
      if (isMounted && cloudStats) {
        setStats(cloudStats);
      }
    });

    // 2. Berlangganan sinyal rindu realtime dari pasangan
    const channel = subscribeToMissYouRealtime((newLog) => {
      if (!isMounted) return;

      // Update statistik secara live
      fetchMissYouStatsFromCloud().then((s) => s && setStats(s));

      // Jika sinyal ini dikirim oleh pasangan untuk pengguna saat ini
      if (newLog.sender_id !== user?.id) {
        playCelebrationFanfare();

        // Tampilkan notifikasi pop-up HP / PC native
        showWebNotification({
          title: `💖 Sinyal Rindu dari ${partnerName}!`,
          body: `${partnerName} baru saja mengirim ${newLog.click_count || 1}x ketukan rindu (${newLog.milestone_text || 'Rindu Berat'})! 💕`,
          icon: '/favicon.svg',
          tag: 'miss-you-signal',
        });

        setIncomingSignal({
          senderName: partnerName,
          count: newLog.click_count || 1,
          milestone: newLog.milestone_text || 'Sinyal Rindu',
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        });
      }
    });

    return () => {
      isMounted = false;
      channel?.unsubscribe?.();
    };
  }, [user?.id, partnerName]);

  // Handler izin & tes notifikasi HP
  const handleEnableNotification = async () => {
    const granted = await requestNotificationPermission();
    const current = getNotificationPermission();
    setNotificationPermission(current);

    if (granted) {
      testNotification();
      setStatusBanner({
        type: 'success',
        text: '✨ Notifikasi HP berhasil diaktifkan! Cek getaran dan notifikasi tes yang baru saja muncul di layarmu.',
      });
    } else {
      setStatusBanner({
        type: 'warning',
        text: 'Izin notifikasi belum diaktifkan. Silakan izinkan di setelan browser atau ikon gembok di address bar.',
      });
    }
  };

  const handleTestNotification = async () => {
    const success = await testNotification();
    if (success) {
      setStatusBanner({
        type: 'success',
        text: 'Tes notifikasi terkirim! HP kamu bergetar dan notifikasi pop-up muncul 🎉',
      });
    } else {
      handleEnableNotification();
    }
  };


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

  // Handler pengiriman sinyal rindu murni via Web Push & Supabase Realtime
  const handleSendMissYou = async (finalCount) => {
    setIsSending(true);
    setStatusBanner(null);

    const tier = getAffectionTier(finalCount);

    try {
      // Simpan cooldown 60 detik
      setCooldownSeconds(60);
      setCooldown(60);

      // Simpan statistik rindu lokal & sinkronisasi ke Supabase Cloud
      // Ini otomatis memicu Web Notification pop-up & getaran di HP pasangan via Realtime
      await logMissYouSignalToCloud({
        senderId: user?.id || 'user_izza',
        recipientId: partnerId,
        clickCount: finalCount,
        milestoneText: tier.label,
        sentVia: 'web_push',
      });

      // Segarkan statistik live
      fetchMissYouStatsFromCloud().then((s) => s && setStats(s));

      setStatusBanner({
        type: 'success',
        text: `💖 Sinyal rindu ${finalCount}x (${tier.label}) berhasil meluncur langsung ke HP ${partnerName}! Layar HP ${partnerName} akan bergetar seketika ✨`,
      });
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

  return (
    <GradientBackground>
      <AppHeader
        title="I Miss You"
        subtitle="Kanal Afeksi & Rindu Instan"
        onBack={onBack}
        rightAction={
          isNotificationSupported() ? (
            <button
              type="button"
              onClick={notificationPermission === 'granted' ? handleTestNotification : handleEnableNotification}
              title={notificationPermission === 'granted' ? 'Notifikasi HP Aktif (Klik untuk Tes Getar)' : 'Klik untuk Aktifkan Notifikasi HP'}
              className={`p-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                notificationPermission === 'granted'
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-pink-500/15 hover:bg-pink-500/25 text-pink-200 border-pink-500/40 animate-pulse'
              }`}
            >
              {notificationPermission === 'granted' ? (
                <>
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline text-[11px]">Notif On</span>
                </>
              ) : (
                <>
                  <BellRing className="w-4 h-4 text-pink-300" />
                  <span className="hidden sm:inline text-[11px]">Aktifkan Notif</span>
                </>
              )}
            </button>
          ) : null
        }
      />


      <div className="my-auto w-full py-4 space-y-5">
        {/* Permission Banner if notifications are not yet enabled */}
        {isNotificationSupported() && notificationPermission !== 'granted' && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-rose-500/20 border border-pink-500/30 shadow-lg shadow-pink-500/10 flex items-center justify-between gap-3 animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-pink-500/30 text-pink-200 shrink-0">
                <BellRing className="w-4 h-4 text-pink-300 animate-bounce" />
              </div>
              <div>
                <p className="text-xs font-semibold text-pink-100">Aktifkan Notifikasi HP Langsung</p>
                <p className="text-[11px] text-pink-200/80 leading-tight">
                  HP kamu akan bergetar & memunculkan pop-up saat {partnerName} mengirim sinyal rindu!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleEnableNotification}
              className="py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 active:scale-95 text-white text-xs font-semibold shadow-md shadow-pink-500/25 transition-all shrink-0"
            >
              Aktifkan
            </button>
          </div>
        )}

        {/* Realtime Incoming Love Signal Alert from Partner */}
        {incomingSignal && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-500/25 via-purple-500/20 to-rose-500/25 border border-pink-500/40 shadow-[0_0_20px_rgba(244,114,182,0.25)] text-xs flex items-center justify-between gap-3 animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-pink-500/30 text-pink-200">
                <Flame className="w-5 h-5 text-pink-400 animate-bounce" />
              </div>
              <div>
                <p className="font-semibold text-pink-100 text-xs">
                  💖 Sinyal Rindu dari {incomingSignal.senderName}!
                </p>
                <p className="text-[11px] text-pink-200/80">
                  {incomingSignal.senderName} baru saja mengirim {incomingSignal.count}x ketukan rindu ({incomingSignal.milestone}) pada jam {incomingSignal.time}.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIncomingSignal(null)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-pink-200 text-xs shrink-0"
            >
              ✕
            </button>
          </div>
        )}

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

        {/* Responsive Grid: Left (Heart Stage) & Right (Message Preview + Stats) on Desktop PC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Mood Selector & Glowing Heart Centerpiece (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-5 flex flex-col items-center">
            {/* 1. Mood Selector Pills */}
            <div className="w-full space-y-1.5">
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

            {/* Glowing Heart Centerpiece Button */}
            <div className="w-full py-4 flex items-center justify-center">
              <GlowingHeartButton
                partnerName={partnerName}
                cooldownRemaining={cooldown}
                onSend={handleSendMissYou}
                onTapCountChange={setLoveCount}
                isSending={isSending}
              />
            </div>
          </div>

          {/* Right Column: Live Message Preview Card & Stats (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4 w-full">
            {/* 2. Dynamic Live Message Preview Card */}
            <GlassCard className="p-4 space-y-3 border-pink-500/20">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-pink-200 flex items-center gap-1">
                  <span>Ungkapan Rindu & Cinta:</span>
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
                  className="text-[11px] text-pink-300/80 hover:text-pink-200 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all"
                >
                  <Dices className="w-3 h-3 text-pink-400" />
                  <span>Acak Variasi</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-black/35 border border-white/10 text-xs sm:text-sm text-pink-100/90 leading-relaxed font-playfair whitespace-pre-line italic shadow-inner">
                &ldquo;{currentPreviewMessage}&rdquo;
              </div>

              <p className="text-[10px] text-neutral-400 text-right">
                Penerima:{' '}
                <span className="text-pink-300 font-semibold">{partnerName}</span>{' '}
                ({partnerRole === 'girlfriend' ? 'Girlfriend ❤️' : 'Boyfriend 💫'})
              </p>
            </GlassCard>

            {/* 3. Love Stats Card */}
            <GlassCard className="p-3.5 rounded-2xl border-white/10 text-center">
              <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">
                Statistik Sinyal Rindu Berdua
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="font-mono text-sm sm:text-base font-bold text-pink-300">
                    {stats.totalSignalsSent || 0}x
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    Terkirim
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="font-mono text-sm sm:text-base font-bold text-rose-300">
                    {stats.totalTapsRecorded || 0}x
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    Total Ketukan
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="font-mono text-sm sm:text-base font-bold text-amber-300">
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
      </div>

      {/* Footer */}
      <footer className="text-center pt-2 pb-2 text-[11px] text-neutral-500 select-none">
        <p className="flex items-center justify-center gap-1">
          Made from Love, with love, and for Love.
        </p>
        <p className="text-[10px] text-neutral-600 mt-0.5">
          &copy; 2026
        </p>
      </footer>
    </GradientBackground>
  );
}

