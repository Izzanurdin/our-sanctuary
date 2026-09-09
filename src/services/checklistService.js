/**
 * Layanan Data Daily Checklist & Health Tracker (Local-First)
 *
 * Mengelola status konsumsi air, jadwal makan, jadwal jogging, tugas kustom,
 * serta penghitungan Health Streak dengan acuan waktu Bali (WITA / Asia/Makassar).
 */

const STORAGE_KEY = 'ops_daily_data';

// Dapatkan tanggal hari ini dalam format YYYY-MM-DD berdasarkan waktu Bali
export function getBaliDateString() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Makassar',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;
  return `${year}-${month}-${day}`;
}

// Cek apakah hari ini adalah hari jogging (Selasa = 2, Kamis = 4, Minggu = 0)
export function isJoggingDayToday() {
  const dayName = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Makassar',
    weekday: 'short',
  }).format(new Date());

  // Sun, Tue, Thu
  return ['Sun', 'Tue', 'Thu'].includes(dayName);
}

// Inisialisasi struktur checklist kosong untuk profil
function createInitialUserChecklist() {
  return {
    water: [false, false, false, false], // 08:30, 12:30, 16:30, 20:00 (500ml per slot)
    meals: {
      breakfast: false,
      lunch: false,
      dinner: false,
    },
    jogging: false,
  };
}

// Data awal default
function getInitialData(currentDate) {
  return {
    date: currentDate,
    user_sayang: createInitialUserChecklist(),
    user_izza: createInitialUserChecklist(),
    streak: {
      count: 0,
      lastCompletedDate: null,
    },
    tasks: [
      {
        id: 'task_default_1',
        title: 'Cek jadwal kuliah & materi minggu ini',
        category: 'Kuliah',
        deadline: '20:00',
        notes: 'Review modul terbaru di portal kampus',
        isCompleted: false,
        createdBy: 'user_sayang',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task_default_2',
        title: 'Review checklist kerja & persiapan besok',
        category: 'Kerja',
        deadline: '17:30',
        notes: 'Pastikan file kerjaan rapi',
        isCompleted: false,
        createdBy: 'user_izza',
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

// Ambil data dari localStorage & lakukan auto-reset 00:00 jika tanggal berubah
export function getDailyData() {
  const currentDate = getBaliDateString();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const init = getInitialData(currentDate);
      saveDailyData(init);
      return init;
    }

    const data = JSON.parse(raw);

    // Jika tanggal berbeda (sudah lewat 00:00 tengah malam waktu Bali)
    if (data.date !== currentDate) {
      // Periksa apakah kemarin sudah lengkap untuk update streak (KEDUANYA HARUS LENGKAP)
      const wasYesterdayCompleted =
        isUserHealthCompleted('user_sayang', data) &&
        isUserHealthCompleted('user_izza', data);

      let newStreakCount = data.streak?.count || 0;
      if (wasYesterdayCompleted) {
        newStreakCount += 1;
      } else {
        // Jika kemarin terlewat oleh salah satu, streak mulai lagi dari 0
        if (data.streak?.lastCompletedDate && data.streak.lastCompletedDate !== currentDate) {
          newStreakCount = 0;
        }
      }

      const refreshedData = {
        ...data,
        date: currentDate,
        // Reset centang air, makan, dan jogging untuk hari baru
        user_sayang: createInitialUserChecklist(),
        user_izza: createInitialUserChecklist(),
        streak: {
          count: newStreakCount,
          lastCompletedDate: wasYesterdayCompleted ? data.date : data.streak?.lastCompletedDate || null,
        },
        // Tugas kuliah/kerja TETAP DIPERTAHANKAN (hanya yang belum selesai)
        tasks: data.tasks || [],
      };

      saveDailyData(refreshedData);
      return refreshedData;
    }

    // Pastikan struktur user_sayang dan user_izza lengkap jika data lama ada yang null
    if (!data.user_sayang) data.user_sayang = createInitialUserChecklist();
    if (!data.user_izza) data.user_izza = createInitialUserChecklist();
    if (!data.tasks) data.tasks = [];
    if (!data.streak) data.streak = { count: 0, lastCompletedDate: null };

    return data;
  } catch (err) {
    console.error('Error loading daily data:', err);
    return getInitialData(currentDate);
  }
}

// Simpan data ke localStorage
export function saveDailyData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving daily data:', err);
  }
}

// Cek apakah target kesehatan harian (air + makan + jogging jika ada jadwal) terpenuhi 100%
export function isUserHealthCompleted(userId, data) {
  const userChecklist = data?.[userId];
  if (!userChecklist) return false;

  const waterDone = userChecklist.water?.every(Boolean);
  const mealsDone =
    userChecklist.meals?.breakfast &&
    userChecklist.meals?.lunch &&
    userChecklist.meals?.dinner;

  const joggingScheduled = isJoggingDayToday();
  const joggingDone = joggingScheduled ? Boolean(userChecklist.jogging) : true;

  return Boolean(waterDone && mealsDone && joggingDone);
}

// Cek apakah KEDUANYA (Izza dan Cahayu) sudah selesai hari ini
export function isCoupleHealthCompleted(data) {
  return (
    isUserHealthCompleted('user_sayang', data) &&
    isUserHealthCompleted('user_izza', data)
  );
}

// Ambil status progres lengkap kesehatan berdua (Couple Streak Info)
export function getCoupleHealthStatus(data) {
  const sayangProgress = getHealthProgress('user_sayang', data);
  const izzaProgress = getHealthProgress('user_izza', data);
  const isCoupleDone = sayangProgress.isFullyCompleted && izzaProgress.isFullyCompleted;

  let displayStreak = data?.streak?.count || 0;
  // Jika hari ini berdua sudah tuntas dan belum tersimpan di streak
  if (isCoupleDone && data?.streak?.lastCompletedDate !== data?.date) {
    displayStreak += 1;
  }

  return {
    isCoupleDone,
    displayStreak,
    sayangProgress,
    izzaProgress,
    sayangDone: sayangProgress.isFullyCompleted,
    izzaDone: izzaProgress.isFullyCompleted,
  };
}

// Hitung persentase progress kesehatan harian pengguna
export function getHealthProgress(userId, data) {
  const userChecklist = data?.[userId] || createInitialUserChecklist();

  let completedItems = 0;
  const totalItems = isJoggingDayToday() ? 8 : 7; // 4 air + 3 makan + (1 jogging jika ada jadwal)

  // 4 Slot Air
  userChecklist.water?.forEach((isDone) => {
    if (isDone) completedItems += 1;
  });

  // 3 Jadwal Makan
  if (userChecklist.meals?.breakfast) completedItems += 1;
  if (userChecklist.meals?.lunch) completedItems += 1;
  if (userChecklist.meals?.dinner) completedItems += 1;

  // Jogging (hanya jika hari jadwal)
  if (isJoggingDayToday()) {
    if (userChecklist.jogging) completedItems += 1;
  }

  const percent = Math.round((completedItems / totalItems) * 100);
  const isFullyCompleted = completedItems >= totalItems;

  return {
    completedItems,
    totalItems,
    percent,
    isFullyCompleted,
  };
}

// Toggle slot air (index 0, 1, 2, 3)
export function toggleWaterSlot(userId, slotIndex) {
  const data = getDailyData();
  if (!data[userId]) data[userId] = createInitialUserChecklist();

  const currentStatus = Boolean(data[userId].water[slotIndex]);
  data[userId].water[slotIndex] = !currentStatus;

  saveDailyData(data);
  return data;
}

// Toggle jadwal makan (breakfast, lunch, dinner)
export function toggleMeal(userId, mealKey) {
  const data = getDailyData();
  if (!data[userId]) data[userId] = createInitialUserChecklist();

  const currentStatus = Boolean(data[userId].meals[mealKey]);
  data[userId].meals[mealKey] = !currentStatus;

  saveDailyData(data);
  return data;
}

// Toggle status jogging
export function toggleJogging(userId) {
  const data = getDailyData();
  if (!data[userId]) data[userId] = createInitialUserChecklist();

  data[userId].jogging = !data[userId].jogging;

  saveDailyData(data);
  return data;
}

// Tambah tugas baru
export function addTask({ title, category = 'Kuliah', deadline = '', notes = '', createdBy }) {
  const data = getDailyData();
  const newTask = {
    id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title,
    category,
    deadline,
    notes,
    isCompleted: false,
    createdBy: createdBy || 'user_sayang',
    createdAt: new Date().toISOString(),
  };

  data.tasks = [newTask, ...(data.tasks || [])];
  saveDailyData(data);
  return data;
}

// Toggle status tugas
export function toggleTask(taskId) {
  const data = getDailyData();
  data.tasks = (data.tasks || []).map((t) =>
    t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
  );
  saveDailyData(data);
  return data;
}

// Hapus tugas
export function deleteTask(taskId) {
  const data = getDailyData();
  data.tasks = (data.tasks || []).map((t) => t).filter((t) => t.id !== taskId);
  saveDailyData(data);
  return data;
}
