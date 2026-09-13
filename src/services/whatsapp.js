/**
 * WhatsApp Gateway & Affection Service
 *
 * Fitur:
 * - Manajemen Konfigurasi Fonnte API Token & Nomor WhatsApp Izza & Cahayu
 * - Smart Fallback: Fonnte API (Background) -> wa.me direct link
 * - Love Charge / Spam Tap Affection Mode:
 *   - Akumulasi hitungan rindu (loveCount)
 *   - Affection Tiers (Percikan Rindu -> I Love You 3000 Level)
 *   - Dynamic WhatsApp message template injection
 * - Web Audio API Synthesizer:
 *   - playLoveTapSound(tapIndex): Ascending crystalline ping on each tap
 *   - playCelebrationFanfare(): Magical 4-note romantic chord arpeggio
 * - Haptic feedback support
 * - Cooldown & Love Stats tracker in localStorage
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';

const GATEWAY_CONFIG_KEY = 'ops_gateway_config';
const MISS_YOU_STATS_KEY = 'ops_miss_you_stats';
const COOLDOWN_KEY = 'ops_miss_you_cooldown';

export const MOOD_OPTIONS = [
  {
    id: 'kangen',
    label: 'Lagi Kangen Banget',
    shortLabel: 'Kangen Banget',
    emoji: '💖',
    accentColor: 'pink',
    badgeClass: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
  },
  {
    id: 'peluk',
    label: 'Pengen Peyuk Erat',
    shortLabel: 'Pengen Peyuk',
    emoji: '🫂',
    accentColor: 'purple',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  },
  {
    id: 'kepikiran',
    label: 'Lagi Kepikiran Sayang',
    shortLabel: 'Kepikiran Sayang',
    emoji: '✨',
    accentColor: 'amber',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  {
    id: 'manis',
    label: 'Pesan Cinta Manis',
    shortLabel: 'Pesan Cinta',
    emoji: '💌',
    accentColor: 'rose',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  },
];

// Inisialisasi konfigurasi gateway
export function getGatewayConfig() {
  try {
    const saved = localStorage.getItem(GATEWAY_CONFIG_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error('Error reading gateway config:', err);
  }
  return {
    fonnteToken: '',
    phoneIzza: '',
    phoneCahayu: '',
  };
}

export function saveGatewayConfig(config) {
  try {
    localStorage.setItem(GATEWAY_CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving gateway config:', err);
  }
}

// Inisialisasi statistik rindu & rekor spam
export function getMissYouStats() {
  try {
    const saved = localStorage.getItem(MISS_YOU_STATS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error('Error reading miss you stats:', err);
  }
  return {
    totalSignalsSent: 0,
    totalTapsRecorded: 0,
    highestSpamRecord: 0,
    lastSentTimestamp: null,
  };
}

export function recordMissYouStat(tapCount) {
  try {
    const current = getMissYouStats();
    const updated = {
      totalSignalsSent: (current.totalSignalsSent || 0) + 1,
      totalTapsRecorded: (current.totalTapsRecorded || 0) + tapCount,
      highestSpamRecord: Math.max(current.highestSpamRecord || 0, tapCount),
      lastSentTimestamp: new Date().toISOString(),
    };
    localStorage.setItem(MISS_YOU_STATS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error recording miss you stat:', err);
    return null;
  }
}

/**
 * Catat sinyal rindu ke Supabase Cloud (tabel miss_you_logs)
 */
export async function logMissYouSignalToCloud({
  senderId = 'user_izza',
  recipientId = 'user_sayang',
  clickCount = 1,
  milestoneText = 'Percikan Rindu',
  sentVia = 'wa_gateway',
}) {
  // Catat ke localStorage terlebih dahulu untuk update instan
  recordMissYouStat(clickCount);

  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  try {
    const payload = {
      sender_id: senderId,
      recipient_id: recipientId,
      click_count: clickCount,
      milestone_text: milestoneText,
      sent_via: sentVia,
      sent_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('miss_you_logs')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Error saving miss_you_log to Supabase:', error.message);
      return null;
    }

    return data?.[0] || null;
  } catch (err) {
    console.error('Network error logging miss you signal:', err);
    return null;
  }
}

/**
 * Ambil agregasi statistik rindu dari Cloud Supabase
 */
export async function fetchMissYouStatsFromCloud() {
  const localStats = getMissYouStats();
  if (!isSupabaseConfigured() || !supabase) {
    return localStats;
  }

  try {
    const { data: logs, error } = await supabase
      .from('miss_you_logs')
      .select('*')
      .order('sent_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch miss_you_logs error, using local fallback:', error.message);
      return localStats;
    }

    if (logs) {
      const totalSignalsSent = logs.length;
      const totalTapsRecorded = logs.reduce((acc, r) => acc + (r.click_count || 1), 0);
      const cloudHighest = logs.reduce((max, r) => Math.max(max, r.click_count || 1), 0);
      const highestSpamRecord = Math.max(cloudHighest, localStats.highestSpamRecord || 0);
      const lastSentTimestamp = logs[0]?.sent_at || localStats.lastSentTimestamp;

      const merged = {
        totalSignalsSent: Math.max(totalSignalsSent, localStats.totalSignalsSent || 0),
        totalTapsRecorded: Math.max(totalTapsRecorded, localStats.totalTapsRecorded || 0),
        highestSpamRecord,
        lastSentTimestamp,
        recentLogs: logs.slice(0, 5),
      };

      localStorage.setItem(MISS_YOU_STATS_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.error('Error fetching miss you stats from Supabase:', err);
  }

  return localStats;
}

let missYouChannel = null;
const missYouCallbacks = new Set();

/**
 * Berlangganan (Subscribe) Realtime ke event kiriman sinyal rindu pasangan
 */
export function subscribeToMissYouRealtime(onSignalReceived) {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  if (onSignalReceived) {
    missYouCallbacks.add(onSignalReceived);
  }

  try {
    if (!missYouChannel) {
      missYouChannel = supabase
        .channel('realtime:miss_you_logs')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'miss_you_logs' },
          (payload) => {
            if (payload?.new) {
              // Perbarui cache lokal
              fetchMissYouStatsFromCloud();
              missYouCallbacks.forEach((cb) => {
                try {
                  cb(payload.new);
                } catch (err) {
                  console.error('Error executing miss_you callback:', err);
                }
              });
            }
          }
        )
        .subscribe((status, err) => {
          if (err) {
            console.warn('Realtime miss_you_logs subscription error:', err);
          }
        });
    }

    return {
      unsubscribe: () => {
        if (onSignalReceived) {
          missYouCallbacks.delete(onSignalReceived);
        }
        if (missYouCallbacks.size === 0 && missYouChannel) {
          supabase.removeChannel(missYouChannel);
          missYouChannel = null;
        }
      },
    };
  } catch (err) {
    console.warn('Realtime miss_you_logs subscription setup error:', err);
    return null;
  }
}

// Manajemen Cooldown (60 detik)
export function getCooldownRemaining() {
  try {
    const expiresAt = localStorage.getItem(COOLDOWN_KEY);
    if (!expiresAt) return 0;
    const remainingMs = parseInt(expiresAt, 10) - Date.now();
    if (remainingMs <= 0) {
      localStorage.removeItem(COOLDOWN_KEY);
      return 0;
    }
    return Math.ceil(remainingMs / 1000);
  } catch {
    return 0;
  }
}

export function setCooldownSeconds(seconds = 60) {
  try {
    const expiresAt = Date.now() + seconds * 1000;
    localStorage.setItem(COOLDOWN_KEY, expiresAt.toString());
  } catch (err) {
    console.error('Error setting cooldown:', err);
  }
}

/**
 * Menghitung Level Tier Rindu berdasarkan jumlah ketukan spam
 */
export function getAffectionTier(count = 1) {
  if (count <= 9) {
    return {
      tier: 1,
      label: 'Percikan Rindu',
      emoji: '🌸',
      color: 'text-pink-300',
      tagline: 'Awal rindu yang manis',
      percent: Math.min(Math.round((count / 10) * 20), 20),
    };
  }
  if (count <= 29) {
    return {
      tier: 2,
      label: 'Kangen Banget!',
      emoji: '💕',
      color: 'text-rose-300',
      tagline: 'Hati mulai berdegup kencang',
      percent: Math.min(20 + Math.round(((count - 10) / 20) * 30), 50),
    };
  }
  if (count <= 74) {
    return {
      tier: 3,
      label: 'Kangen Maksimal!',
      emoji: '✨',
      color: 'text-amber-300',
      tagline: 'Rasa rindu berkobar tak tertahan',
      percent: Math.min(50 + Math.round(((count - 30) / 45) * 30), 80),
    };
  }
  if (count <= 149) {
    return {
      tier: 4,
      label: 'Overcharged Love!',
      emoji: '🔥💖',
      color: 'text-pink-400',
      tagline: 'Level cinta membara di atas rata-rata!',
      percent: Math.min(80 + Math.round(((count - 75) / 75) * 19), 99),
    };
  }
  return {
    tier: 5,
    label: 'I Love You 3000 Level!',
    emoji: '🌌👑',
    color: 'text-fuchsia-300',
    tagline: 'Rasa rindu lintas semesta tanpa batas!',
    percent: 100,
  };
}

/**
 * Generate Draf Pesan Romantis WhatsApp
 * Menggabungkan Mood + Panggilan Sayang Dinamis + Jumlah Ketukan Spam (loveCount)
 */
export function generateMissYouMessage({
  moodId = 'kangen',
  partnerName = 'Sayang',
  nickname = 'Sayangku',
  loveCount = 1,
  seed = 0,
}) {
  const mood = MOOD_OPTIONS.find((m) => m.id === moodId) || MOOD_OPTIONS[0];
  const nameLabel = partnerName ? `${partnerName} ${nickname}` : nickname;

  // Variasi jika ditekan 1x (normal tap)
  const singleTapTemplates = {
    kangen: [
      `Hai ${nameLabel}! ❤️ Aku cuma mau bilang kalau saat ini aku lagi kangen banget sama sayang. Semoga hari sayang menyenangkan ya! 🥰`,
      `Haloo ${nameLabel}! Hatiku tiba-tiba rindu banget sama senyuman sayang. Jaga kesehatan yaa sayangku! 💕`,
      `Hai ${nameLabel}... Lagi apa sekarang? Aku di sini kepikiran sayang terus dan kangen berat! 🥺❤️`,
      `Rindu berat sama ${nameLabel}! Detik demi detik rasanya pengen cepet ketemu sayang terus 🥰❤️`,
    ],
    peluk: [
      `Hai ${nameLabel}... Hari ini rasanya pengen banget meyuk sayang erat-erat 🫂 Hangatnya sayang selalu jadi tempat ternyaman buat aku. Sampai ketemu nanti ya sayangku! ❤️`,
      `Kirim peyukan virtual paling erat buat ${nameLabel} tersayang! 🫂💕 Semoga peyukan ini bisa bikin sayang ngerasa nyaman dan disayang selalu.`,
      `Kangen dipeyuk dan meyuk ${nameLabel}... Pengen peyuk sayang erat-erat sekarang juga! 🫂✨`,
    ],
    kepikiran: [
      `Lagi di tengah aktivitas, tapi kepalaku isinya cuma sayang, ${nameLabel}! ✨ Semoga semua urusan sayang hari ini lancar ya sayangku!`,
      `Bintang-bintang di langit kalah terang sama senyuman sayang di ingatanku hari ini, ${nameLabel} ✨ Kepikiran sayang terus nih! 🥰`,
      `Lagi fokus apapun hari ini, bayangan manis ${nameLabel} selalu mampir di ingatan... Kepalaku isinya cuma mikirin sayangku! 💕✨`,
    ],
    manis: [
      `Cuma mau ngingetin ${nameLabel}: sayang itu anugerah terindah yang selalu aku syukuri setiap hari. Sayang banget sama sayangku! 💌❤️`,
      `Pesan cinta kilat buat ${nameLabel}: Terima kasih ya sudah jadi pasangan terbaik dan selalu bikin hari-hariku bahagia! Sayang selalu ya sayangku! 💌✨`,
      `Buat ${nameLabel} tercinta: Cintaku ke sayang selalu bertambah setiap harinya. Makasih udah hadir di hidupku ya sayangku! 💖💌`,
    ],
  };

  // Variasi jika dispam (loveCount > 1)
  if (loveCount > 1) {
    if (loveCount >= 100) {
      return `[${mood.emoji} ${mood.label}]\n` +
        `"Cinta Sayang 3000 kali lipat, ${nameLabel}! ❤️"\n\n` +
        `Barusan aku spam tombol rindu di Our Sanctuary sebanyak ${loveCount}x TAPS (100% OVERCHARGED! 🌌👑) tanpa henti!\n` +
        `Sinyal rinduku sudah sampai level kosmik khusus buat sayang, tolong peyuk aku secepatnya ya sayangku! 🥰✨\n\n` +
        `— Dikirim dengan penuh cinta dari Our Sanctuary`;
    }

    const spamTemplates = [
      `[${mood.emoji} ${mood.label}]\n` +
        `"Rindu sayang ${loveCount} kali lipat hari ini, ${nameLabel}! 🥰"\n\n` +
        `Barusan aku memompa tombol rindu di Our Sanctuary sebanyak ${loveCount}x khusus buat sayang! Tolong luangkan waktu peyuk aku ya sayangku! 🥺💖\n\n` +
        `— Dikirim dengan penuh cinta dari Our Sanctuary`,

      `[${mood.emoji} ${mood.label}]\n` +
        `"Tingkat Rinduku ke Sayang: ${loveCount}x Taps! 💕"\n\n` +
        `Hai ${nameLabel}, jariku nggak bisa berhenti mencet tombol rindu tadi (total ${loveCount}x ketukan!). Itu bukti kalau aku bener-bener kangen berat sama sayang sekarang! ❤️\n\n` +
        `— Dikirim dengan penuh cinta dari Our Sanctuary`,
    ];

    return spamTemplates[seed % spamTemplates.length];
  }

  // Ambil draf single tap sesuai mood
  const templates = singleTapTemplates[moodId] || singleTapTemplates.kangen;
  const picked = templates[seed % templates.length];
  return `[${mood.emoji} ${mood.label}]\n${picked}\n\n— Dikirim via Our Sanctuary`;
}

/**
 * Sintesis Audio Chime via Web Audio API (Zero File Assets)
 */
let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Nada denting kristal pada setiap ketukan spam
 * Pitch naik perlahan seiring bertambahnya loveCount
 */
export function playLoveTapSound(tapIndex = 1) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Frekuensi dasar 520Hz (C5), naik perlahan setiap ketukan hingga max 1100Hz
    const pitchOffset = Math.min((tapIndex % 50) * 12, 580);
    const freq = 520 + pitchOffset;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (err) {
    console.debug('Audio tap sound note:', err);
  }
}

/**
 * Akor romantis kristal (Fanfare Selebrasi: C5 - E5 - G5 - C6)
 */
export function playCelebrationFanfare() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = now + idx * 0.08;
      const duration = 1.0;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (err) {
    console.debug('Audio fanfare note:', err);
  }
}

/**
 * Haptic feedback getaran HP
 */
export function triggerHaptic(duration = 15) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(duration);
    } catch {
      // Ignore vibration error on unsupported devices
    }
  }
}

/**
 * Pengiriman Pesan WhatsApp (Fonnte API -> wa.me Fallback)
 */
export async function sendWhatsAppMessage({ targetPhone, message }) {
  if (!targetPhone) {
    throw new Error('Nomor WhatsApp tujuan belum ditentukan.');
  }

  // Bersihkan format nomor agar berupa angka saja (628...)
  let cleanPhone = targetPhone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith('62')) {
    cleanPhone = '62' + cleanPhone;
  }

  const config = getGatewayConfig();
  const token = config.fonnteToken?.trim();

  // 1. Coba kirim via Fonnte API jika token tersedia
  if (token) {
    try {
      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target: cleanPhone,
          message: message,
        }),
      });

      const data = await response.json();
      if (data.status === true || data.status === 'true') {
        return {
          success: true,
          method: 'fonnte',
          message: 'Pesan berhasil terkirim otomatis di latar belakang via Fonnte Gateway!',
        };
      }
      console.warn('Fonnte API respon non-success, fallback ke wa.me:', data);
    } catch (apiErr) {
      console.warn('Gagal menghubungi Fonnte API, beralih ke fallback wa.me:', apiErr);
    }
  }

  // 2. Smart Fallback: Langsung buka direct WhatsApp link (wa.me)
  const encodedText = encodeURIComponent(message);
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  if (typeof window !== 'undefined') {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }

  return {
    success: true,
    method: 'wame',
    message: 'Membuka WhatsApp untuk mengirim pesan...',
  };
}
