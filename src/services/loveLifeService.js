/**
 * Layanan Data Love Life Engine (Local-First)
 *
 * Mengelola katalog ide kencan (Wishlist, Terjadwal, Selesai),
 * album kenangan Polaroid (Memory Vault), dan pembuatan link otomatis Google Calendar.
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEY = 'ops_lovelife_data';

export const MAIN_GOOGLE_DRIVE_FOLDER =
  'https://drive.google.com/drive/folders/1xG4Z-xUO0z1g49oTqUmMhSYPtAfapXii?usp=drive_link';

export const GDRIVE_WEBHOOK_URL = import.meta.env.VITE_GDRIVE_WEBHOOK_URL?.trim();

// Pilihan Preset Energy Levels
export const ENERGY_LEVELS = [
  {
    id: 'all',
    label: 'Semua Mood',
    icon: '✨',
    color: 'border-pink-500/30 text-pink-200 bg-pink-500/10',
  },
  {
    id: 'cozy',
    label: '🛋️ Low Energy / Cozy',
    shortLabel: 'Cozy / Santai',
    icon: '🛋️',
    color: 'border-amber-500/30 text-amber-200 bg-amber-500/10',
  },
  {
    id: 'casual',
    label: '☕ Casual & Chill',
    shortLabel: 'Casual & Chill',
    icon: '☕',
    color: 'border-teal-500/30 text-teal-200 bg-teal-500/10',
  },
  {
    id: 'outdoor',
    label: '🌿 Outdoor & Fun',
    shortLabel: 'Outdoor & Fun',
    icon: '🌿',
    color: 'border-emerald-500/30 text-emerald-200 bg-emerald-500/10',
  },
  {
    id: 'romantic',
    label: '🥂 Romantic & Special',
    shortLabel: 'Romantic',
    icon: '🥂',
    color: 'border-rose-500/30 text-rose-200 bg-rose-500/10',
  },
];

// Pilihan Preset Dress Code
export const DRESS_CODE_PRESETS = [
  '👗 Smart Casual / Rapi Manis',
  '👔 Elegant / Dress-up Formal',
  '👕 Comfy Casual / Santai Nyaman',
  '🌊 Sunset / Beach Wear',
  '🎨 Earth Tone / Senada',
  '🤍 Monochrome / Black & White',
  '🏃 Sporty / Active Wear',
];

// Data awal default (11 Kencan Nyata dari Google Drive bertanda SELESAI + 4 Wishlist Kencan)
const INITIAL_DATES = [
  {
    id: 'date_1_matcha',
    title: 'Matcha Date',
    location: 'Matcha Bar',
    gmapsUrl: '',
    energyKey: 'casual',
    category: 'Food & Drinks',
    status: 'completed',
    completedAt: '2026-07-21',
    driveFolder: '1. Matcha & Flowers! :33',
    driveUrl: 'https://drive.google.com/drive/folders/1V5eJAV_QtEAod8TVty8p5yBGLk4ZIQFO',
    notes: 'Matcha & flowers date yang manis :33',
    dressCode: 'Comfy Casual',
    caption: 'Matcha enak dan bunga cantik buat kamu yang paling manis :33 🍵💐',
    photoUrl: '',
    capturedBy: 'user_izza',
    createdBy: 'user_izza',
  },
  {
    id: 'date_2_basketball',
    title: 'Basketball',
    location: 'Barty',
    gmapsUrl: '',
    energyKey: 'outdoor',
    category: 'Sports & Play',
    status: 'completed',
    completedAt: '2026-07-21',
    driveFolder: '2. Basketball :O',
    driveUrl: 'https://drive.google.com/drive/folders/1Pv9L5L2SJSlTagj64riKqkfdjUh9m7_T',
    notes: 'Main basket seru bareng di Barty :O',
    dressCode: 'Sporty / Active Wear',
    caption: 'Keringetan bareng main basket di Barty, kamu jago banget nge-shoot bola! 🏀✨',
    photoUrl: '',
    capturedBy: 'user_izza',
    createdBy: 'user_izza',
  },
  {
    id: 'date_3_study',
    title: 'Study Date',
    location: 'Kopken',
    gmapsUrl: '',
    energyKey: 'cozy',
    category: 'Productive / Cafe',
    status: 'completed',
    completedAt: '2026-07-21',
    driveFolder: '3. :Cafie',
    driveUrl: 'https://drive.google.com/drive/folders/1M6TGKs4AMB3KGM7aC3QHM2BKKxqQWOI7',
    notes: 'Nugas & ngobrol santai berdua di Kopken',
    dressCode: 'Comfy Casual',
    caption: 'Nemenin kamu nugas sambil ngopi, suasana tenang dan selalu nyaman kalau bareng kamu ☕📖',
    photoUrl: '',
    capturedBy: 'user_sayang',
    createdBy: 'user_sayang',
  },
  {
    id: 'date_4_gelato',
    title: 'Gelato',
    location: "Gusto's Gelato",
    gmapsUrl: '',
    energyKey: 'casual',
    category: 'Food & Drinks',
    status: 'completed',
    completedAt: '2026-07-21',
    driveFolder: '4. Geyato',
    driveUrl: 'https://drive.google.com/drive/folders/1D6MrUNgdmT4TN4vxUgUyCKuT0VqZRMt7',
    notes: 'Nyobain varian gelato favorit di Gusto Gelato',
    dressCode: 'Casual Santai',
    caption: 'Manisnya gelato Gusto ga ada apa-apanya dibanding senyum manis kamu hari itu 🍨❤️',
    photoUrl: '',
    capturedBy: 'user_sayang',
    createdBy: 'user_sayang',
  },
  {
    id: 'date_5_mall',
    title: 'Mall Date',
    location: 'Living World',
    gmapsUrl: '',
    energyKey: 'casual',
    category: 'Shopping & Chill',
    status: 'completed',
    completedAt: '2026-07-21',
    driveFolder: '5. Malu D:ong',
    driveUrl: 'https://drive.google.com/drive/folders/1c_KKcEvh_VL_m7RQXET8WdkfB6Pidc0n',
    notes: 'Jalan-jalan, belanja, & hunting kuliner di Living World',
    dressCode: 'Smart Casual / Rapi Manis',
    caption: 'Keliling Living World gandengan tangan sambil nyari makan dan ngobrol seru 🛍️🍽️',
    photoUrl: '',
    capturedBy: 'user_izza',
    createdBy: 'user_izza',
  },
  {
    id: 'date_6_yendeem',
    title: 'Yendeem',
    location: 'Yendeem',
    gmapsUrl: '',
    energyKey: 'casual',
    category: 'Food & Drinks',
    status: 'completed',
    completedAt: '2026-07-22',
    driveFolder: '6. Yendeem',
    driveUrl: 'https://drive.google.com/drive/folders/1VUWm9SnR2ywcGm9MCfpQkews63FTDQU3',
    notes: 'Kencan kuliner santai dan seru bareng di Yendeem',
    dressCode: 'Comfy Casual',
    caption: 'Momen kulineran santai dan hangat berdua di Yendeem 🥢🍲❤️',
    photoUrl: '',
    capturedBy: 'user_sayang',
    createdBy: 'user_sayang',
  },
  {
    id: 'date_7_pkb',
    title: 'PKB : Pekan Kebudayaan Bali',
    location: 'Art Center Denpasar',
    gmapsUrl: '',
    energyKey: 'outdoor',
    category: 'Culture & Arts',
    status: 'completed',
    completedAt: '2026-07-22',
    driveFolder: '7. Pekabeh',
    driveUrl: 'https://drive.google.com/drive/folders/1wwSDOvjYSkWZrsHrkrXoJ-_ZlACHbz_u',
    notes: 'Keliling pameran seni & festival budaya bareng',
    dressCode: 'Batik / Semi Formal',
    caption: 'Jalan santai liat karya seni & pertunjukan budaya di Pekan Kebudayaan Bali 🎭✨',
    photoUrl: '',
    capturedBy: 'user_izza',
    createdBy: 'user_izza',
  },
  {
    id: 'date_8_trampoline',
    title: 'Trampoline Date',
    location: 'Aero X Space',
    gmapsUrl: '',
    energyKey: 'outdoor',
    category: 'Adventure & Play',
    status: 'completed',
    completedAt: '2026-07-22',
    driveFolder: '9. Aero X Space',
    driveUrl: 'https://drive.google.com/drive/folders/1VRCjxLpnkyfCocE53SkddLKYyql9hcHX',
    notes: 'Lompat-lompat seru di Aero X Space',
    dressCode: 'Sporty / Active Wear',
    caption: 'Tertawa lepas lompat-lompat di trampolin Aero X Space, energi kita tumpah ruah! 🤸‍♀️⚡',
    photoUrl: '',
    capturedBy: 'user_sayang',
    createdBy: 'user_sayang',
  },
  {
    id: 'date_9_jimbaran',
    title: 'Jimbaran & Banyoo',
    location: 'Pantai Jimbaran & Banyoo',
    gmapsUrl: '',
    energyKey: 'romantic',
    category: 'Beach & Sunset',
    status: 'completed',
    completedAt: '2026-07-22',
    driveFolder: '10. Jimbaran && Banyoo!!',
    driveUrl: 'https://drive.google.com/drive/folders/1BccOXee6NYJoxxHH3PPN_9QINObat_mF',
    notes: 'Menikmati sunset romantis di tepi pantai Jimbaran dan serunya Banyoo',
    dressCode: 'Sunset / Beach Wear',
    caption: 'Deburan ombak pantai Jimbaran, sunset jingga, dan momen magis di Banyoo berdua bersamamu 🌅🌊❤️',
    photoUrl: '',
    capturedBy: 'user_izza',
    createdBy: 'user_izza',
  },
  {
    id: 'date_10_kencan_lewe',
    title: 'Kencan Lewe',
    location: 'Lewe',
    gmapsUrl: '',
    energyKey: 'cozy',
    category: 'Night Ride / Cozy',
    status: 'completed',
    completedAt: '2026-07-22',
    driveFolder: '11. Kencan Lewe :O',
    driveUrl: 'https://drive.google.com/drive/folders/1WAMCW3SdbcpfLurh7NulHSayg2hGJNst',
    notes: 'Kencan santai Lewe berdua :O',
    dressCode: 'Comfy Casual',
    caption: 'Kencan manis dan hangat berdua tanpa beban, penuh tawa dan kebahagiaan 🌙✨',
    photoUrl: '',
    capturedBy: 'user_sayang',
    createdBy: 'user_sayang',
  },
  {
    id: 'date_11_concert',
    title: 'Concert Date : Nadin & Baskara',
    location: 'Kebun Raya Bedugul',
    gmapsUrl: '',
    energyKey: 'romantic',
    category: 'Music & Concert',
    status: 'completed',
    completedAt: '2026-07-26',
    driveFolder: '12. Konser!!',
    driveUrl: 'https://drive.google.com/drive/folders/1Afhqd6Z02kOOP9wsr8_FzJ0h_a7nOuc8',
    notes: 'Nonton penampilan Nadin Amizah & Hindia/Baskara di sejuknya alam Bedugul',
    dressCode: 'Warm Outer & Earth Tone',
    caption: 'Momen magis nyanyi bareng lagu Nadin & Baskara di tengah dingin dan kabut Bedugul, salah satu kencan terbaik kita 🌲🎶❤️',
    photoUrl: '',
    capturedBy: 'user_sayang',
    createdBy: 'user_sayang',
  },
  // 4 Ide Wishlist Awal
  {
    id: 'date_wish_1',
    title: 'Sunset Picnic di Pantai',
    location: 'Pantai Melasti / Pantai Nyang-Nyang',
    gmapsUrl: '',
    energyKey: 'outdoor',
    category: 'Nature & Romantic',
    status: 'wishlist',
    notes: 'Bawa tikar piknik, buah segar, minuman dingin, dan kamera polaroid!',
    dressCode: 'Sunset / Beach Wear',
    caption: '',
    photoUrl: '',
    driveFolder: '',
    driveUrl: '',
    createdBy: 'user_izza',
  },
  {
    id: 'date_wish_2',
    title: 'Midnight Car Talk & Ice Cream Drive-thru',
    location: 'Keliling Kota & Drive-thru',
    gmapsUrl: '',
    energyKey: 'cozy',
    category: 'Night Ride',
    status: 'wishlist',
    notes: 'Beli es krim favorit, putar playlist Spotify kita, ngobrol deep talk sampai malam.',
    dressCode: 'Comfy Casual / Santai',
    caption: '',
    photoUrl: '',
    driveFolder: '',
    driveUrl: '',
    createdBy: 'user_sayang',
  },
  {
    id: 'date_wish_3',
    title: 'Masak Pasta & Baking Cookies Bareng',
    location: 'Dapur Rumah',
    gmapsUrl: '',
    energyKey: 'cozy',
    category: 'Cooking & Home',
    status: 'wishlist',
    notes: 'Bikin creamy pasta carbonara & cookies cokelat hangat, sambil setel lagu jazz.',
    dressCode: 'Kaos Santai & Celemek',
    caption: '',
    photoUrl: '',
    driveFolder: '',
    driveUrl: '',
    createdBy: 'user_sayang',
  },
  {
    id: 'date_wish_4',
    title: 'Romantic Rooftop Dinner & City Lights',
    location: 'Rooftop Resto',
    gmapsUrl: '',
    energyKey: 'romantic',
    category: 'Fine Dining',
    status: 'wishlist',
    notes: 'Dress up cantik & ganteng, makan malam romantis sambil liat gemerlap lampu kota.',
    dressCode: 'Elegant / Dress-up Formal',
    caption: '',
    photoUrl: '',
    driveFolder: '',
    driveUrl: '',
    createdBy: 'user_izza',
  },
];

// Helper: Konversi baris DB (snake_case) ke format objek frontend (camelCase)
export function mapDbToDatePlan(row) {
  return {
    id: row.id,
    title: row.title || '',
    location: row.location || '',
    gmapsUrl: row.gmaps_url || '',
    energyKey: row.energy_key || 'casual',
    category: row.category || 'Food & Drinks',
    dressCode: row.dress_code || '',
    status: row.status || 'wishlist',
    scheduledDate: row.scheduled_date || '',
    scheduledStartTime: row.scheduled_start_time || '16:00',
    scheduledEndTime: row.scheduled_end_time || '19:00',
    completedAt: row.completed_at || '',
    notes: row.notes || '',
    caption: row.caption || '',
    photoUrl: row.photo_url || '',
    driveFolder: row.drive_folder || '',
    driveUrl: row.drive_url || (row.drive_folder ? MAIN_GOOGLE_DRIVE_FOLDER : ''),
    capturedBy: row.captured_by || 'user_sayang',
    createdBy: row.created_by || 'user_izza',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

// Helper: Konversi objek frontend (camelCase) ke baris DB (snake_case)
export function mapDatePlanToDb(d) {
  return {
    id: d.id,
    title: d.title,
    location: d.location || null,
    gmaps_url: d.gmapsUrl || null,
    energy_key: d.energyKey || 'casual',
    category: d.category || 'Food & Drinks',
    dress_code: d.dressCode || null,
    status: d.status || 'wishlist',
    scheduled_date: d.scheduledDate || null,
    scheduled_start_time: d.scheduledStartTime || '16:00',
    scheduled_end_time: d.scheduledEndTime || '19:00',
    completed_at: d.completedAt || null,
    notes: d.notes || null,
    caption: d.caption || null,
    photo_url: d.photoUrl || null,
    drive_folder: d.driveFolder || null,
    drive_url: d.driveUrl || null,
    captured_by: d.capturedBy || null,
    created_by: d.createdBy || null,
    updated_at: new Date().toISOString(),
  };
}

// Ambil seluruh data Love Life dari cache localStorage (Synchronous untuk render awal instan)
export function getLoveLifeData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = {
        dates: INITIAL_DATES,
        lastUpdated: new Date().toISOString(),
      };
      saveLoveLifeData(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.dates || parsed.dates.length === 0) {
      parsed.dates = INITIAL_DATES;
      saveLoveLifeData(parsed);
    } else if (parsed.dates.length < 15) {
      // Migrasikan otomatis cache lama yang baru memiliki 8 atau 12 item
      const existingIds = new Set(parsed.dates.map((d) => d.id));
      const missing = INITIAL_DATES.filter((d) => !existingIds.has(d.id));
      if (missing.length > 0) {
        parsed.dates = [...parsed.dates, ...missing];
        saveLoveLifeData(parsed);
      }
    }
    return parsed;
  } catch (err) {
    console.error('Error loading Love Life data:', err);
    return { dates: INITIAL_DATES, lastUpdated: new Date().toISOString() };
  }
}

// Simpan data Love Life ke cache localStorage
export function saveLoveLifeData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving Love Life data:', err);
  }
}

// Mengambil data kencan langsung dari Supabase Cloud (dengan fallback localStorage)
export async function fetchLoveLifeData() {
  if (!isSupabaseConfigured() || !supabase) {
    return getLoveLifeData();
  }

  try {
    const { data, error } = await supabase
      .from('date_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch date_plans error, using local fallback:', error.message);
      return getLoveLifeData();
    }

    if (data && data.length > 0) {
      const normalizedDates = data.map(mapDbToDatePlan);
      const payload = {
        dates: normalizedDates,
        lastUpdated: new Date().toISOString(),
      };
      saveLoveLifeData(payload);
      return payload;
    }

    return getLoveLifeData();
  } catch (err) {
    console.error('Error fetching date plans from Supabase:', err);
    return getLoveLifeData();
  }
}

// Berlangganan (Subscribe) Realtime ke tabel date_plans Supabase
export function subscribeToLoveLifeRealtime(onSync) {
  if (!isSupabaseConfigured() || !supabase) {
    return () => {};
  }

  try {
    const channel = supabase
      .channel('public:date_plans')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'date_plans' },
        async () => {
          const refreshed = await fetchLoveLifeData();
          if (onSync) onSync(refreshed);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.error('Error subscribing to date_plans realtime:', err);
    return () => {};
  }
}

// Membuat subfolder baru di Google Drive melalui Webhook Google Apps Script
export async function createGoogleDriveFolder(folderName) {
  if (!GDRIVE_WEBHOOK_URL) {
    console.warn('VITE_GDRIVE_WEBHOOK_URL belum disetel di .env');
    return null;
  }

  try {
    const response = await fetch(GDRIVE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ folderName }),
    });
    const result = await response.json();
    if (result.success) {
      return {
        id: result.folderId,
        url: result.folderUrl,
        name: result.folderName,
      };
    }
    console.warn('Google Apps Script response unhandled:', result);
    return null;
  } catch (err) {
    console.error('Error creating Google Drive folder via Webhook:', err);
    return null;
  }
}

// Tambah ide kencan baru ke wishlist (Otomatis buat folder di Google Drive jika webhook aktif)
export async function addDateIdea({
  title,
  location = '',
  gmapsUrl = '',
  energyKey = 'casual',
  category = 'Food & Drinks',
  notes = '',
  dressCode = '',
  createdBy = 'user_izza',
}) {
  const data = getLoveLifeData();

  // Hitung nomor urut folder berikutnya secara otomatis (1, 2, ... 12 -> 13)
  let nextNumber = 13;
  try {
    const existingNumbers = (data.dates || [])
      .map((d) => {
        const match = (d.driveFolder || d.title || '').match(/^(\d+)\./);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n) => !isNaN(n) && n > 0);
    if (existingNumbers.length > 0) {
      nextNumber = Math.max(...existingNumbers) + 1;
    }
  } catch (e) {
    console.warn('Could not parse next folder number, using fallback:', e);
  }

  const suggestedFolderName = `${nextNumber}. ${title}`;

  // Buat folder Google Drive secara otomatis via Webhook jika URL tersedia
  let driveInfo = null;
  if (GDRIVE_WEBHOOK_URL) {
    driveInfo = await createGoogleDriveFolder(suggestedFolderName);
  }

  const newDate = {
    id: `date_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title,
    location,
    gmapsUrl,
    energyKey,
    category,
    status: 'wishlist',
    notes,
    dressCode,
    createdBy,
    createdAt: new Date().toISOString(),
    scheduledDate: '',
    scheduledStartTime: '16:00',
    scheduledEndTime: '19:00',
    caption: '',
    photoUrl: '',
    driveFolder: driveInfo ? driveInfo.name : suggestedFolderName,
    driveUrl: driveInfo ? driveInfo.url : MAIN_GOOGLE_DRIVE_FOLDER,
    completedAt: '',
    capturedBy: '',
  };

  data.dates = [newDate, ...data.dates];
  saveLoveLifeData(data);

  // Sinkronisasi ke Supabase jika terhubung
  if (isSupabaseConfigured() && supabase) {
    supabase
      .from('date_plans')
      .insert([mapDatePlanToDb(newDate)])
      .then(({ error }) => {
        if (error) console.error('Error syncing date plan to Supabase:', error.message);
      })
      .catch((err) => console.error('Network error syncing date plan:', err));
  }

  return data;
}

// Kunci jadwal kencan (Update status ke 'scheduled')
export function scheduleDate(dateId, { date, startTime = '16:00', endTime = '19:00', location, gmapsUrl, dressCode, notes }) {
  const data = getLoveLifeData();
  let updatedItem = null;

  data.dates = data.dates.map((d) => {
    if (d.id === dateId) {
      updatedItem = {
        ...d,
        status: 'scheduled',
        scheduledDate: date,
        scheduledStartTime: startTime,
        scheduledEndTime: endTime,
        location: location || d.location,
        gmapsUrl: gmapsUrl || d.gmapsUrl,
        dressCode: dressCode || d.dressCode,
        notes: notes || d.notes,
        scheduledAt: new Date().toISOString(),
      };
      return updatedItem;
    }
    return d;
  });

  saveLoveLifeData(data);

  // Sinkronisasi ke Supabase
  if (isSupabaseConfigured() && supabase && updatedItem) {
    supabase
      .from('date_plans')
      .update({
        status: 'scheduled',
        scheduled_date: updatedItem.scheduledDate,
        scheduled_start_time: updatedItem.scheduledStartTime,
        scheduled_end_time: updatedItem.scheduledEndTime,
        location: updatedItem.location,
        gmaps_url: updatedItem.gmapsUrl,
        dress_code: updatedItem.dressCode,
        notes: updatedItem.notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', dateId)
      .then(({ error }) => {
        if (error) console.error('Error syncing schedule to Supabase:', error.message);
      })
      .catch((err) => console.error('Network error syncing schedule:', err));
  }

  return data;
}

// Tandai kencan selesai & abadikan ke Memory Vault
export function completeDateWithMemory(
  dateId,
  { caption = '', photoUrl = '', driveFolder = '', driveUrl = '', completedAt = '', capturedBy = 'user_sayang' }
) {
  const data = getLoveLifeData();
  let updatedItem = null;

  data.dates = data.dates.map((d) => {
    if (d.id === dateId) {
      updatedItem = {
        ...d,
        status: 'completed',
        completedAt: completedAt || d.scheduledDate || new Date().toISOString().split('T')[0],
        caption: caption || d.caption,
        photoUrl: photoUrl || d.photoUrl,
        driveFolder: driveFolder || d.driveFolder,
        driveUrl: driveUrl || d.driveUrl || (driveFolder ? MAIN_GOOGLE_DRIVE_FOLDER : ''),
        capturedBy,
      };
      return updatedItem;
    }
    return d;
  });

  saveLoveLifeData(data);

  // Sinkronisasi ke Supabase
  if (isSupabaseConfigured() && supabase && updatedItem) {
    supabase
      .from('date_plans')
      .update({
        status: 'completed',
        completed_at: updatedItem.completedAt,
        caption: updatedItem.caption,
        photo_url: updatedItem.photoUrl,
        drive_folder: updatedItem.driveFolder,
        drive_url: updatedItem.driveUrl,
        captured_by: updatedItem.capturedBy,
        updated_at: new Date().toISOString(),
      })
      .eq('id', dateId)
      .then(({ error }) => {
        if (error) console.error('Error syncing completed date to Supabase:', error.message);
      })
      .catch((err) => console.error('Network error syncing completed date:', err));
  }

  return data;
}

// Tambah memori langsung ke Memory Vault (misal dari potret Unwithering Garden)
export function addDirectMemory({
  title = 'Potret Taman Bunga Abadi',
  caption = '',
  photoUrl = '',
  location = 'Unwithering Garden',
  capturedBy = 'user_sayang',
}) {
  const data = getLoveLifeData();
  const newMemory = {
    id: `memory_${Date.now()}`,
    title,
    location,
    gmapsUrl: '',
    energyKey: 'romantic',
    category: 'Memory & Love',
    status: 'completed',
    completedAt: new Date().toISOString().split('T')[0],
    driveFolder: 'Unwithering Garden',
    driveUrl: MAIN_GOOGLE_DRIVE_FOLDER,
    notes: 'Potret pemandangan bunga abadi mekar di Our Sanctuary',
    dressCode: '',
    caption,
    photoUrl,
    capturedBy,
    createdBy: capturedBy,
    createdAt: new Date().toISOString(),
  };

  data.dates = [newMemory, ...data.dates];
  saveLoveLifeData(data);

  // Sinkronisasi ke Supabase (tabel memories & date_plans)
  if (isSupabaseConfigured() && supabase) {
    supabase
      .from('date_plans')
      .insert([mapDatePlanToDb(newMemory)])
      .then(({ error }) => {
        if (error) console.error('Error syncing direct memory to date_plans:', error.message);
      })
      .catch((err) => console.error('Network error syncing direct memory:', err));

    supabase
      .from('memories')
      .insert([
        {
          title: newMemory.title,
          caption: newMemory.caption,
          photo_url: newMemory.photoUrl,
          event_date: newMemory.completedAt,
          is_favorite: true,
          tags: ['garden', 'unwithering'],
          created_by: capturedBy,
        },
      ])
      .then(({ error }) => {
        if (error) console.error('Error syncing memory to Supabase:', error.message);
      })
      .catch((err) => console.error('Network error syncing memory:', err));
  }

  return newMemory;
}

// Hapus kencan
export function deleteDate(dateId) {
  const data = getLoveLifeData();
  data.dates = data.dates.filter((d) => d.id !== dateId);
  saveLoveLifeData(data);

  // Sinkronisasi hapus ke Supabase
  if (isSupabaseConfigured() && supabase) {
    supabase
      .from('date_plans')
      .delete()
      .eq('id', dateId)
      .then(({ error }) => {
        if (error) console.error('Error deleting date plan from Supabase:', error.message);
      })
      .catch((err) => console.error('Network error deleting date plan:', err));
  }

  return data;
}

/**
 * Generate Google Calendar Web Intent URL
 * Otomatis mengisi Judul, Jam, Lokasi, Dress Code, dan mengundang email bersama/pasangan.
 */
export function generateGoogleCalendarUrl({
  title,
  date,
  startTime = '16:00',
  endTime = '19:00',
  location = '',
  gmapsUrl = '',
  dressCode = '',
  notes = '',
  guestEmail = '',
}) {
  const cleanDate = (date || new Date().toISOString().split('T')[0]).replace(/-/g, '');
  const cleanStart = (startTime || '16:00').replace(/:/g, '') + '00';
  const cleanEnd = (endTime || '19:00').replace(/:/g, '') + '00';
  const datesParam = `${cleanDate}T${cleanStart}/${cleanDate}T${cleanEnd}`;

  const descriptionLines = [
    `✨ Private Date: ${title}`,
    dressCode ? `👗 Dress Code: ${dressCode}` : '',
    location ? `📍 Lokasi: ${location}` : '',
    gmapsUrl ? `🗺️ Maps Link: ${gmapsUrl}` : '',
    notes ? `📝 Catatan: ${notes}` : '',
    '',
    'Reminder: H-1 Bersiap kencan manis kita! ❤️',
    'Created with ❤️ from Our Sanctuary',
  ].filter(Boolean).join('\n');

  const fullLocation = gmapsUrl ? `${location} (${gmapsUrl})` : location;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `[Our Date] ${title} ❤️`,
    dates: datesParam,
    details: descriptionLines,
    location: fullLocation,
  });

  if (guestEmail) {
    params.append('add', guestEmail);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
