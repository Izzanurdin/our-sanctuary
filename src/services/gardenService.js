/**
 * Garden Service: Unwithering Garden (Taman Bunga Abadi)
 *
 * Mengelola:
 * - Katalog profil warna Gerbera & Lily
 * - Penyimpanan bunga abadi di localStorage (ops_garden_flowers)
 * - Koordinat persentase (xPercent, yPercent) untuk responsive multi-device
 * - Synthesizer audio Web Audio API (Denting Harpa, Angin Malam, Petikan Rahasia Emas)
 * - Audio toggle preference (ops_garden_audio_enabled)
 */

const GARDEN_FLOWERS_KEY = 'ops_garden_flowers';
const GARDEN_AUDIO_KEY = 'ops_garden_audio_enabled';

// Profil warna 3 Gerbera Penjaga Taman (Puncak, Kiri Bawah, Kanan Bawah)
export const GERBERA_PROFILES = [
  {
    id: 'gerbera_red',
    name: 'Crimson Rose',
    main: '#ff4757',
    dark: '#8b0000',
    light: '#ff7f50',
    glow: 'rgba(255, 71, 87, 0.8)',
    outerGlow: 'rgba(255, 0, 0, 0.2)',
  },
  {
    id: 'gerbera_white',
    name: 'Starlight Pearl',
    main: '#ffffff',
    dark: '#a0a0a0',
    light: '#e0f7fa',
    glow: 'rgba(255, 255, 255, 0.6)',
    outerGlow: 'rgba(200, 230, 255, 0.3)',
  },
  {
    id: 'gerbera_yellow',
    name: 'Sunlight Amber',
    main: '#ffdc1e',
    dark: '#b8860b',
    light: '#fff9c4',
    glow: 'rgba(255, 220, 30, 0.7)',
    outerGlow: 'rgba(255, 215, 0, 0.2)',
  },
];

// Koordinat tetap 3 Gerbera Penjaga (% dari lebar & tinggi layar)
export const PERMANENT_GERBERAS = [
  { id: 'perm_gerbera_top', profileIndex: 0, xPercent: 50, yPercent: 15 },
  { id: 'perm_gerbera_left', profileIndex: 1, xPercent: 15, yPercent: 82 },
  { id: 'perm_gerbera_right', profileIndex: 2, xPercent: 85, yPercent: 82 },
];

// 10 Profil warna Lily Mekar yang memikat
export const LILY_PROFILES = [
  {
    name: 'Soft Cherry Blossom',
    inner: '#ffebee',
    outer: '#fce4ec',
    vein: '#f06292',
    glow: 'rgba(255, 235, 238, 0.7)',
    outerGlow: 'rgba(240, 98, 146, 0.2)',
  },
  {
    name: 'Neon Magenta',
    inner: '#ff1744',
    outer: '#f50057',
    vein: '#880e4f',
    glow: 'rgba(255, 23, 68, 0.8)',
    outerGlow: 'rgba(245, 0, 87, 0.3)',
  },
  {
    name: 'Starlight White',
    inner: '#ffffff',
    outer: '#fff5f8',
    vein: '#ff80ab',
    glow: 'rgba(255, 255, 255, 0.6)',
    outerGlow: 'rgba(255, 128, 171, 0.2)',
  },
  {
    name: 'Peachy Pink',
    inner: '#f06292',
    outer: '#ff8a80',
    vein: '#c2185b',
    glow: 'rgba(240, 98, 146, 0.7)',
    outerGlow: 'rgba(255, 138, 128, 0.2)',
  },
  {
    name: 'Deep Orchid',
    inner: '#ad1457',
    outer: '#d81b60',
    vein: '#4a148c',
    glow: 'rgba(216, 27, 96, 0.8)',
    outerGlow: 'rgba(74, 20, 140, 0.2)',
  },
  {
    name: 'Tiger Lily',
    inner: '#ff5722',
    outer: '#ffcc80',
    vein: '#b71c1c',
    glow: 'rgba(255, 87, 34, 0.7)',
    outerGlow: 'rgba(255, 152, 0, 0.2)',
  },
  {
    name: 'Midnight Violet',
    inner: '#673ab7',
    outer: '#d1c4e9',
    vein: '#311b92',
    glow: 'rgba(103, 58, 183, 0.8)',
    outerGlow: 'rgba(49, 27, 146, 0.25)',
  },
  {
    name: 'Starry Blue',
    inner: '#03a9f4',
    outer: '#e1f5fe',
    vein: '#01579b',
    glow: 'rgba(3, 169, 244, 0.75)',
    outerGlow: 'rgba(1, 87, 155, 0.25)',
  },
  {
    name: 'Golden Ray',
    inner: '#ffc107',
    outer: '#fffde7',
    vein: '#e65100',
    glow: 'rgba(255, 193, 7, 0.8)',
    outerGlow: 'rgba(230, 81, 0, 0.2)',
  },
  {
    name: 'Petal of Eternal Love',
    inner: '#f06292',
    outer: '#ffffff',
    vein: '#ad1457',
    glow: 'rgba(240, 98, 146, 0.65)',
    outerGlow: 'rgba(255, 255, 255, 0.25)',
  },
];

// Bunga sambutan awal yang romantis
const INITIAL_STARTER_FLOWERS = [
  {
    id: 'flower_starter_welcome',
    type: 'lily',
    xPercent: 50,
    yPercent: 52,
    scale: 0.95,
    profileIndex: 8, // Golden Ray
    secretMessage: 'Selamat datang di taman abadi kita, sayangku... Mekarlah selamanya ❤️',
    plantedBy: { id: 'user_izza', name: 'Izza', role: 'boyfriend' },
    plantedAt: new Date().toISOString(),
  },
];

/**
 * Mengambil daftar bunga Lily yang tersimpan di localStorage
 */
export function getGardenFlowers() {
  try {
    const saved = localStorage.getItem(GARDEN_FLOWERS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error reading garden flowers:', err);
  }
  return INITIAL_STARTER_FLOWERS;
}

/**
 * Menyimpan daftar bunga ke localStorage
 */
export function saveGardenFlowers(flowers) {
  try {
    localStorage.setItem(GARDEN_FLOWERS_KEY, JSON.stringify(flowers));
  } catch (err) {
    console.error('Error saving garden flowers:', err);
  }
}

/**
 * Menambahkan 1 bunga baru ke taman
 */
export function addGardenFlower(newFlower) {
  const current = getGardenFlowers();
  const updated = [...current, newFlower];
  saveGardenFlowers(updated);
  return updated;
}

/**
 * Mereset taman (menghapus lily, mengembalikan starter flower)
 */
export function resetGardenFlowers() {
  saveGardenFlowers([]);
  return [];
}

/**
 * Menghitung statistik taman abadi
 */
export function getGardenStats() {
  const flowers = getGardenFlowers();
  const secretCount = flowers.filter((f) => Boolean(f.secretMessage)).length;
  const izzaCount = flowers.filter((f) => f.plantedBy?.id === 'user_izza').length;
  const cahayuCount = flowers.filter((f) => f.plantedBy?.id === 'user_sayang').length;

  return {
    totalPlanted: flowers.length,
    secretCount,
    izzaCount,
    cahayuCount,
  };
}

/**
 * ==========================================
 * AUDIO SYNTHESIS VIA WEB AUDIO API
 * ==========================================
 */
let audioContextInstance = null;

function getAudioCtx() {
  if (typeof window === 'undefined') return null;
  if (!audioContextInstance) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      audioContextInstance = new AudioCtx();
    }
  }
  if (audioContextInstance && audioContextInstance.state === 'suspended') {
    audioContextInstance.resume();
  }
  return audioContextInstance;
}

export function isGardenAudioEnabled() {
  try {
    const saved = localStorage.getItem(GARDEN_AUDIO_KEY);
    return saved !== null ? JSON.parse(saved) : true;
  } catch {
    return true;
  }
}

export function setGardenAudioEnabled(enabled) {
  try {
    localStorage.setItem(GARDEN_AUDIO_KEY, JSON.stringify(enabled));
  } catch (err) {
    console.error('Error saving audio state:', err);
  }
}

/**
 * Petikan Harpa Lembut saat Bunga Mekar (G4 - B4 - D5 - G5)
 */
export function playBloomChime() {
  if (!isGardenAudioEnabled()) return;
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;

    // 4 Nada harpa arpeggio
    const chord = [392.0, 493.88, 587.33, 783.99]; // G4, B4, D5, G5
    const now = ctx.currentTime;

    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = now + idx * 0.06;
      const duration = 0.8;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (err) {
    console.debug('Bloom chime sound note:', err);
  }
}

/**
 * Suara Berpendar Emas saat Membuka Pesan Rahasia
 */
export function playSecretFoundSound() {
  if (!isGardenAudioEnabled()) return;
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;

    const notes = [554.37, 659.25, 830.61, 1108.73]; // C#5, E5, G#5, C#6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = now + idx * 0.07;
      const duration = 1.1;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.15, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (err) {
    console.debug('Secret sound note:', err);
  }
}

/**
 * Desir Semilir Angin Halus saat Mengusap Layar
 */
let lastWindTime = 0;
export function playWindBreezeSound() {
  if (!isGardenAudioEnabled()) return;
  const now = Date.now();
  // Throttle agar hembusan angin tidak berisik
  if (now - lastWindTime < 400) return;
  lastWindTime = now;

  try {
    const ctx = getAudioCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (err) {
    console.debug('Wind sound note:', err);
  }
}
