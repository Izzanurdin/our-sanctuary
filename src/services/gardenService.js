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

import { supabase, isSupabaseConfigured } from './supabaseClient';

const GARDEN_FLOWERS_KEY = 'ops_garden_flowers';
const GARDEN_AUDIO_KEY = 'ops_garden_audio_enabled';
const GARDEN_FLOWER_BASKET_KEY = 'ops_garden_flower_basket';

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

// Koleksi 3 Pilihan Jenis Bunga Abadi
export const FLOWER_TYPES = [
  {
    id: 'frangipani',
    name: 'Bunga Kamboja Emas',
    botanicalName: 'Golden Frangipani',
    icon: '🌼',
    quote: 'Wangi keabadian & kesetiaan cinta',
    description: 'Kelopak spiral beludru dengan gradasi kuning keemasan yang menenangkan jiwa.',
  },
  {
    id: 'blossom',
    name: 'Bunga Sakura Sutra',
    botanicalName: 'Silk Pink Blossom',
    icon: '🌸',
    quote: 'Kelembutan rasa & ketulusan hati',
    description: 'Kelopak tipis berlayer transparan menyerupai kain sutra yang mekar dengan keanggunan abadi.',
  },
  {
    id: 'lily',
    name: 'Bunga Lily Bintang',
    botanicalName: 'Realistic Starlight Lily',
    icon: '⚜️',
    quote: 'Cahaya anggun penyejuk jiwa',
    description: 'Bunga lily megah dengan lekukan kelopak alami, bintik frekles anggun, dan benang sari hidup.',
  },
];

// Profil Warna Kamboja (Frangipani)
export const FRANGIPANI_PROFILES = [
  {
    name: 'Golden Cream',
    petalBase: '#ffffff',
    petalMid: '#fffde7',
    petalTip: '#fff9c4',
    centerCore: '#ff6f00',
    centerGlow: '#ffb300',
    glow: 'rgba(255, 215, 0, 0.75)',
    outerGlow: 'rgba(255, 179, 0, 0.25)',
  },
  {
    name: 'Sunset Coral',
    petalBase: '#fff8e1',
    petalMid: '#ffe0b2',
    petalTip: '#ff8a65',
    centerCore: '#e64a19',
    centerGlow: '#ff7043',
    glow: 'rgba(255, 112, 67, 0.75)',
    outerGlow: 'rgba(230, 74, 25, 0.25)',
  },
  {
    name: 'Pink Blush Plumeria',
    petalBase: '#ffffff',
    petalMid: '#fce4ec',
    petalTip: '#f48fb1',
    centerCore: '#f57f17',
    centerGlow: '#fbc02d',
    glow: 'rgba(244, 143, 177, 0.75)',
    outerGlow: 'rgba(245, 127, 23, 0.25)',
  },
  {
    name: 'Pearl White',
    petalBase: '#ffffff',
    petalMid: '#f5f5f5',
    petalTip: '#e0f7fa',
    centerCore: '#fbc02d',
    centerGlow: '#fff176',
    glow: 'rgba(255, 255, 255, 0.8)',
    outerGlow: 'rgba(224, 247, 250, 0.3)',
  },
  {
    name: 'Ruby Bali Kamboja',
    petalBase: '#ffebee',
    petalMid: '#ef5350',
    petalTip: '#c62828',
    centerCore: '#ffd54f',
    centerGlow: '#ffca28',
    glow: 'rgba(239, 83, 80, 0.8)',
    outerGlow: 'rgba(198, 40, 40, 0.3)',
  },
];

// Profil Warna Sakura Sutra (Silk Blossom)
export const BLOSSOM_PROFILES = [
  {
    name: 'Pastel Sakura Pink',
    inner: '#ffe4e6',
    mid: '#f43f5e',
    outer: '#fda4af',
    core: '#881337',
    stamen: '#fb7185',
    glow: 'rgba(244, 63, 94, 0.75)',
    outerGlow: 'rgba(251, 113, 133, 0.25)',
  },
  {
    name: 'Lavender Mist',
    inner: '#f3e8ff',
    mid: '#a855f7',
    outer: '#d8b4fe',
    core: '#581c87',
    stamen: '#c084fc',
    glow: 'rgba(168, 85, 247, 0.75)',
    outerGlow: 'rgba(216, 180, 254, 0.25)',
  },
  {
    name: 'Peach Chiffon',
    inner: '#fff1f2',
    mid: '#fb923c',
    outer: '#fed7aa',
    core: '#9a3412',
    stamen: '#f97316',
    glow: 'rgba(251, 146, 60, 0.75)',
    outerGlow: 'rgba(254, 215, 170, 0.25)',
  },
  {
    name: 'Snow White Peony',
    inner: '#ffffff',
    mid: '#f1f5f9',
    outer: '#e2e8f0',
    core: '#eab308',
    stamen: '#fde047',
    glow: 'rgba(255, 255, 255, 0.8)',
    outerGlow: 'rgba(226, 232, 240, 0.3)',
  },
  {
    name: 'Sunset Rose Chiffon',
    inner: '#fef2f2',
    mid: '#e11d48',
    outer: '#f43f5e',
    core: '#4c0519',
    stamen: '#fda4af',
    glow: 'rgba(225, 29, 72, 0.8)',
    outerGlow: 'rgba(244, 63, 94, 0.3)',
  },
];

// 10 Profil warna Lily Mekar Realistis (Terinspirasi Foto Referensi Nyata)
export const LILY_PROFILES = [
  {
    name: 'Pure White Stargazer',
    throat: '#a8e6cf',
    inner: '#ffffff',
    mid: '#f8fafc',
    outer: '#f1f5f9',
    vein: '#dcfce7',
    speckles: '#65a30d',
    anthers: '#c2410c',
    glow: 'rgba(255, 255, 255, 0.85)',
    outerGlow: 'rgba(168, 230, 207, 0.3)',
  },
  {
    name: 'Velvet Crimson Red',
    throat: '#1c1917',
    inner: '#7f1d1d',
    mid: '#991b1b',
    outer: '#b91c1c',
    vein: '#450a0a',
    speckles: '#292524',
    anthers: '#f97316',
    glow: 'rgba(185, 28, 28, 0.85)',
    outerGlow: 'rgba(127, 29, 29, 0.35)',
  },
  {
    name: 'Sunset Peach Tiger',
    throat: '#fef08a',
    inner: '#ea580c',
    mid: '#f97316',
    outer: '#fdba74',
    vein: '#c2410c',
    speckles: '#7c2d12',
    anthers: '#7c2d12',
    glow: 'rgba(249, 115, 22, 0.85)',
    outerGlow: 'rgba(254, 240, 138, 0.3)',
  },
  {
    name: 'Blush Cream Orchid',
    throat: '#bbf7d0',
    inner: '#fdf4ff',
    mid: '#f5d0fe',
    outer: '#f0abfc',
    vein: '#c026d3',
    speckles: '#a21caf',
    anthers: '#b45309',
    glow: 'rgba(240, 171, 252, 0.8)',
    outerGlow: 'rgba(253, 244, 255, 0.25)',
  },
  {
    name: 'Royal Magenta Tiger',
    throat: '#84cc16',
    inner: '#831843',
    mid: '#be185d',
    outer: '#f43f5e',
    vein: '#500724',
    speckles: '#3b0764',
    anthers: '#eab308',
    glow: 'rgba(190, 24, 93, 0.85)',
    outerGlow: 'rgba(131, 24, 67, 0.35)',
  },
  {
    name: 'Midnight Lavender',
    throat: '#c7d2fe',
    inner: '#ede9fe',
    mid: '#c4b5fd',
    outer: '#8b5cf6',
    vein: '#5b21b6',
    speckles: '#4c1d95',
    anthers: '#d97706',
    glow: 'rgba(139, 92, 246, 0.8)',
    outerGlow: 'rgba(91, 33, 182, 0.3)',
  },
  {
    name: 'Peachy Sunrise',
    throat: '#fef9c3',
    inner: '#fed7aa',
    mid: '#fb923c',
    outer: '#f43f5e',
    vein: '#ea580c',
    speckles: '#9a3412',
    anthers: '#c2410c',
    glow: 'rgba(251, 146, 60, 0.8)',
    outerGlow: 'rgba(244, 63, 94, 0.25)',
  },
  {
    name: 'Starlight Pearl',
    throat: '#fef08a',
    inner: '#ffffff',
    mid: '#fff1f2',
    outer: '#fecdd3',
    vein: '#fb7185',
    speckles: '#e11d48',
    anthers: '#ea580c',
    glow: 'rgba(255, 255, 255, 0.85)',
    outerGlow: 'rgba(254, 205, 211, 0.3)',
  },
  {
    name: 'Golden Ray (Secret Golden Lily)',
    throat: '#fef08a',
    inner: '#fde047',
    mid: '#eab308',
    outer: '#ca8a04',
    vein: '#a16207',
    speckles: '#713f12',
    anthers: '#713f12',
    glow: 'rgba(250, 204, 21, 0.95)',
    outerGlow: 'rgba(234, 179, 8, 0.5)',
  },
  {
    name: 'Emerald Aurora Lily',
    throat: '#86efac',
    inner: '#f0fdf4',
    mid: '#bbf7d0',
    outer: '#4ade80',
    vein: '#15803d',
    speckles: '#14532d',
    anthers: '#d97706',
    glow: 'rgba(74, 222, 128, 0.8)',
    outerGlow: 'rgba(187, 247, 208, 0.25)',
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

// Mapper helper antar skema Postgres (snake_case) dan React state (camelCase)
function mapFlowerFromDb(dbRow) {
  return {
    id: dbRow.id,
    type: dbRow.type || 'lily',
    xPercent: parseFloat(dbRow.x_percent),
    yPercent: parseFloat(dbRow.y_percent),
    scale: parseFloat(dbRow.scale || 0.85),
    profileIndex: dbRow.profile_index ?? 0,
    secretMessage: dbRow.secret_message || '',
    plantedBy: typeof dbRow.planted_by === 'string' ? JSON.parse(dbRow.planted_by) : dbRow.planted_by,
    plantedAt: dbRow.planted_at || new Date().toISOString(),
  };
}

function mapFlowerToDb(flower) {
  return {
    id: flower.id,
    type: flower.type || 'lily',
    x_percent: flower.xPercent,
    y_percent: flower.yPercent,
    scale: flower.scale,
    profile_index: flower.profileIndex,
    secret_message: flower.secretMessage || null,
    planted_by: flower.plantedBy,
    planted_at: flower.plantedAt || new Date().toISOString(),
  };
}

/**
 * Mengambil daftar bunga Lily yang tersimpan di localStorage (sinkron lokal instan)
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
 * Mengambil daftar bunga dari Supabase Cloud (dengan fallback localStorage)
 */
export async function fetchGardenFlowersFromCloud() {
  if (!isSupabaseConfigured() || !supabase) {
    return getGardenFlowers();
  }

  try {
    const { data, error } = await supabase
      .from('garden_flowers')
      .select('*')
      .order('planted_at', { ascending: true });

    if (error) {
      console.warn('Supabase fetch flowers error, using local fallback:', error.message);
      return getGardenFlowers();
    }

    if (data && data.length > 0) {
      const mapped = data.map(mapFlowerFromDb);
      saveGardenFlowers(mapped);
      return mapped;
    }
  } catch (err) {
    console.error('Error fetching garden flowers from Supabase:', err);
  }

  return getGardenFlowers();
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
 * Menambahkan 1 bunga baru ke taman (Simpan ke localStorage & Sinkron ke Supabase)
 */
export function addGardenFlower(newFlower) {
  const current = getGardenFlowers();
  const updated = [...current, newFlower];
  saveGardenFlowers(updated);

  // Sinkronisasi asinkron ke Supabase Cloud
  if (isSupabaseConfigured() && supabase) {
    supabase
      .from('garden_flowers')
      .insert([mapFlowerToDb(newFlower)])
      .then(({ error }) => {
        if (error) console.error('Error syncing new flower to Supabase:', error.message);
      })
      .catch((err) => console.error('Network error syncing flower:', err));
  }

  return updated;
}

/**
 * Berlangganan (Subscribe) Realtime ke tabel bunga Supabase
 * Bunga yang ditanam pasangan di HP/laptop lain langsung mekar seketika!
 */
export function subscribeToGardenFlowers(onFlowerInserted) {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  try {
    const channel = supabase
      .channel('realtime:garden_flowers')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'garden_flowers' },
        (payload) => {
          if (payload?.new) {
            const mapped = mapFlowerFromDb(payload.new);
            onFlowerInserted(mapped);
          }
        }
      )
      .subscribe();

    return channel;
  } catch (err) {
    console.warn('Realtime subscription error:', err);
    return null;
  }
}

/**
 * Mereset taman (menghapus lily, mengembalikan starter flower)
 */
export function resetGardenFlowers() {
  saveGardenFlowers([]);

  if (isSupabaseConfigured() && supabase) {
    supabase
      .from('garden_flowers')
      .delete()
      .neq('id', 'flower_starter_welcome')
      .then(() => {})
      .catch((err) => console.error('Error resetting flowers in Supabase:', err));
  }

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
 * FLOWER BASKET (KERANJANG SURAT RAHASIA)
 * ==========================================
 */

/**
 * Mengambil daftar pesan rahasia yang disimpan di Flower Basket
 */
export function getFlowerBasket() {
  try {
    const saved = localStorage.getItem(GARDEN_FLOWER_BASKET_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error reading flower basket:', err);
  }
  return [];
}

/**
 * Mengambil daftar item Flower Basket dari Supabase Cloud
 */
export async function fetchFlowerBasketFromCloud() {
  if (!isSupabaseConfigured() || !supabase) {
    return getFlowerBasket();
  }

  try {
    const { data, error } = await supabase
      .from('flower_basket')
      .select('*')
      .order('saved_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch flower basket error, using local fallback:', error.message);
      return getFlowerBasket();
    }

    if (data) {
      const mapped = data.map((row) => ({
        id: row.id,
        flowerId: row.flower_id,
        secretMessage: row.secret_message,
        plantedBy: typeof row.planted_by === 'string' ? JSON.parse(row.planted_by) : row.planted_by,
        savedBy: row.saved_by,
        plantedAt: row.planted_at,
        savedAt: row.saved_at,
      }));
      saveFlowerBasket(mapped);
      return mapped;
    }
  } catch (err) {
    console.error('Error fetching flower basket from Supabase:', err);
  }

  return getFlowerBasket();
}

/**
 * Menyimpan seluruh daftar item Flower Basket ke localStorage
 */
export function saveFlowerBasket(items) {
  try {
    localStorage.setItem(GARDEN_FLOWER_BASKET_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving flower basket:', err);
  }
}

/**
 * Menambahkan pesan rahasia bunga ke Flower Basket (Lokal & Supabase Cloud)
 */
export function addToFlowerBasket(whisperItem) {
  const current = getFlowerBasket();
  const exists = current.some(
    (item) => item.flowerId === whisperItem.id || item.id === whisperItem.id || item.flowerId === whisperItem.flowerId
  );
  if (exists) {
    return current;
  }

  const newItem = {
    id: `basket_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    flowerId: whisperItem.flowerId || whisperItem.id,
    secretMessage: whisperItem.secretMessage,
    plantedBy: whisperItem.plantedBy || { name: 'Pasanganmu', role: 'partner' },
    plantedAt: whisperItem.plantedAt || new Date().toISOString(),
    savedAt: new Date().toISOString(),
  };

  const updated = [newItem, ...current];
  saveFlowerBasket(updated);

  // Simpan ke Supabase Cloud
  if (isSupabaseConfigured() && supabase) {
    supabase
      .from('flower_basket')
      .insert([
        {
          id: newItem.id,
          flower_id: newItem.flowerId,
          secret_message: newItem.secretMessage,
          planted_by: newItem.plantedBy,
          planted_at: newItem.plantedAt,
          saved_at: newItem.savedAt,
        },
      ])
      .then(({ error }) => {
        if (error) console.error('Error saving basket to Supabase:', error.message);
      })
      .catch((err) => console.error('Network error saving to flower basket:', err));
  }

  return updated;
}

/**
 * Menghapus 1 pesan dari Flower Basket (Lokal & Supabase Cloud)
 */
export function removeFromFlowerBasket(basketItemId) {
  const current = getFlowerBasket();
  const updated = current.filter(
    (item) => item.id !== basketItemId && item.flowerId !== basketItemId
  );
  saveFlowerBasket(updated);

  if (isSupabaseConfigured() && supabase) {
    supabase
      .from('flower_basket')
      .delete()
      .or(`id.eq.${basketItemId},flower_id.eq.${basketItemId}`)
      .then(() => {})
      .catch((err) => console.error('Error deleting from flower basket in Supabase:', err));
  }

  return updated;
}

/**
 * Mengecek apakah bunga rahasia sudah tersimpan di Flower Basket
 */
export function isInFlowerBasket(flowerId) {
  if (!flowerId) return false;
  const current = getFlowerBasket();
  return current.some((item) => item.flowerId === flowerId || item.id === flowerId);
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
