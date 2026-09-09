/**
 * Layanan Data Love Life Engine (Local-First)
 *
 * Mengelola katalog ide kencan (Wishlist, Terjadwal, Selesai),
 * album kenangan Polaroid (Memory Vault), dan pembuatan link otomatis Google Calendar.
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEY = 'ops_lovelife_data';

export const MAIN_GOOGLE_DRIVE_FOLDER =
  'https://drive.google.com/drive/folders/1xG4Z-xUO0c1g49uTqUmMihSYPtAlspXi?hl=ID';

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

// Data awal default (8 Kencan Nyata dari Google Drive bertanda SELESAI + 4 Wishlist)
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
    driveUrl: MAIN_GOOGLE_DRIVE_FOLDER,
    notes: 'Matcha & flowers date yang manis :33',
    dressCode: 'Comfy Casual',
    caption: 'Matcha enak dan bunga cantik buat kamu yang paling manis :33 🍵💐',
    photoUrl: '',
    capturedBy: 'user_izza',
  },
  {
    id: 'date_2_study',
    title: 'Study Date',
    location: 'Kopken',
    gmapsUrl: '',
    energyKey: 'cozy',
    category: 'Productive / Cafe',
    status: 'completed',
    completedAt: '2026-07-21',
    driveFolder: '3. :Cafie',
    driveUrl: MAIN_GOOGLE_DRIVE_FOLDER,
    notes: 'Nugas & ngobrol santai berdua di Kopken',
    dressCode: 'Comfy Casual',
    caption: 'Nemenin kamu nugas sambil ngopi, suasana tenang dan selalu nyaman kalau bareng kamu ☕📖',
    photoUrl: '',
    capturedBy: 'user_sayang',
  },
  {
    id: 'date_3_basketball',
    title: 'Basketball',
    location: 'Barty',
    gmapsUrl: '',
    energyKey: 'outdoor',
    category: 'Sports & Play',
    status: 'completed',
    completedAt: '2026-07-21',
    driveFolder: '2. Basketball :O',
    driveUrl: MAIN_GOOGLE_DRIVE_FOLDER,
    notes: 'Main basket seru bareng di Barty :O',
    dressCode: 'Sporty / Active Wear',
    caption: 'Keringetan bareng main basket di Barty, kamu jago banget nge-shoot bola! 🏀✨',
    photoUrl: '',
    capturedBy: 'user_izza',
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
    driveUrl: MAIN_GOOGLE_DRIVE_FOLDER,
    notes: 'Nyobain varian gelato favorit di Gusto Gelato',
    dressCode: 'Casual Santai',
    caption: 'Manisnya gelato Gusto ga ada apa-apanya dibanding senyum manis kamu hari itu 🍨❤️',
    photoUrl: '',
    capturedBy: 'user_sayang',
  },
  {
    id: 'date_5_pkb',
    title: 'PKB : Pekan Kebudayaan Bali',
    location: 'Art Center Denpasar',
    gmapsUrl: '',
    energyKey: 'outdoor',
    category: 'Culture & Arts',
    status: 'completed',
    completedAt: '2026-07-22',
    driveFolder: '7. Pekabeh',
    driveUrl: MAIN_GOOGLE_DRIVE_FOLDER,
    notes: 'Keliling pameran seni & festival budaya bareng',
    dressCode: 'Batik / Semi Formal',
    caption: 'Jalan santai liat karya seni & pertunjukan budaya di Pekan Kebudayaan Bali 🎭✨',
    photoUrl: '',
    capturedBy: 'user_izza',
  },
  {
    id: 'date_6_trampoline',
    title: 'Trampoline Date',
    location: 'Aero X Space',
    gmapsUrl: '',
    energyKey: 'outdoor',
    category: 'Adventure & Play',
    status: 'completed',
    completedAt: '2026-07-22',
    driveFolder: '9. Aero X Space',
    driveUrl: MAIN_GOOGLE_DRIVE_FOLDER,
    notes: 'Lompat-lompat seru di Aero X Space',
    dressCode: 'Sporty / Active Wear',
    caption: 'Tertawa lepas lompat-lompat di trampolin Aero X Space, energi kita tumpah ruah! 🤸‍♀️⚡',
    photoUrl: '',
    capturedBy: 'user_sayang',
  },
  {
    id: 'date_7_mall',
    title: 'Mall Date',
    location: 'Living World',
    gmapsUrl: '',
    energyKey: 'casual',
    category: 'Shopping & Chill',
    status: 'completed',
    completedAt: '2026-07-22',
    driveFolder: '5. Malu D;ong',
    driveUrl: MAIN_GOOGLE_DRIVE_FOLDER,
    notes: 'Jalan-jalan, belanja, & hunting kuliner di Living World',
    dressCode: 'Smart Casual / Rapi Manis',
    caption: 'Keliling Living World gandengan tangan sambil nyari makan dan ngobrol seru 🛍️🍽️',
    photoUrl: '',
    capturedBy: 'user_izza',
  },
  {
    id: 'date_8_concert',
    title: 'Concert Date : Nadin & Baskara',
    location: 'Kebun Raya Bedugul',
    gmapsUrl: '',
    energyKey: 'romantic',
    category: 'Music & Concert',
    status: 'completed',
    completedAt: '2026-07-26',
    driveFolder: '12. Konser!!',
    driveUrl: MAIN_GOOGLE_DRIVE_FOLDER,
    notes: 'Nonton penampilan Nadin Amizah & Hindia/Baskara di sejuknya alam Bedugul',
    dressCode: 'Warm Outer & Earth Tone',
    caption: 'Momen magis nyanyi bareng lagu Nadin & Baskara di tengah dingin dan kabut Bedugul, salah satu kencan terbaik kita 🌲🎶❤️',
    photoUrl: '',
    capturedBy: 'user_sayang',
  },
  // 4 Ide Wishlist Baru untuk Di-shuffle & Dijadwalkan
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
  },
];

// Ambil seluruh data Love Life dari localStorage
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
    }
    return parsed;
  } catch (err) {
    console.error('Error loading Love Life data:', err);
    return { dates: INITIAL_DATES, lastUpdated: new Date().toISOString() };
  }
}

// Simpan data Love Life ke localStorage
export function saveLoveLifeData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving Love Life data:', err);
  }
}

// Tambah ide kencan baru ke wishlist
export function addDateIdea({
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
  const newDate = {
    id: `date_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title,
    location,
    gmapsUrl,
    energyKey,
    category,
    status: 'wishlist', // Default selalu wishlist
    notes,
    dressCode,
    createdBy,
    createdAt: new Date().toISOString(),
    scheduledDate: '',
    scheduledTime: '',
    caption: '',
    photoUrl: '',
  };

  data.dates = [newDate, ...data.dates];
  saveLoveLifeData(data);

  // Sinkronisasi ke Supabase jika terhubung
  if (isSupabaseConfigured() && supabase) {
    supabase
      .from('date_plans')
      .insert([
        {
          title: newDate.title,
          description: newDate.notes,
          location: newDate.location,
          status: newDate.status,
          created_by: newDate.createdBy,
        },
      ])
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
  data.dates = data.dates.map((d) => {
    if (d.id === dateId) {
      return {
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
    }
    return d;
  });

  saveLoveLifeData(data);
  return data;
}

// Tandai kencan selesai & abadikan ke Memory Vault
export function completeDateWithMemory(dateId, { caption = '', photoUrl = '', driveFolder = '', capturedBy = 'user_sayang' }) {
  const data = getLoveLifeData();
  data.dates = data.dates.map((d) => {
    if (d.id === dateId) {
      return {
        ...d,
        status: 'completed',
        completedAt: d.scheduledDate || new Date().toISOString().split('T')[0],
        caption: caption || d.caption,
        photoUrl: photoUrl || d.photoUrl,
        driveFolder: driveFolder || d.driveFolder,
        capturedBy,
      };
    }
    return d;
  });

  saveLoveLifeData(data);
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
    notes: 'Potret pemandangan bunga abadi mekar di Our Private Space',
    dressCode: '',
    caption,
    photoUrl,
    capturedBy,
  };
  data.dates = [newMemory, ...data.dates];
  saveLoveLifeData(data);

  // Sinkronisasi ke Supabase jika terhubung
  if (isSupabaseConfigured() && supabase) {
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
    'Created with ❤️ from Our Private Space',
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
