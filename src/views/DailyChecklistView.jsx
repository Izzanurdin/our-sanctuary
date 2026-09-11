import { useState, useEffect } from 'react';
import GradientBackground from '../components/common/GradientBackground';
import AppHeader from '../components/common/AppHeader';
import GlassCard from '../components/common/GlassCard';
import WaterTracker from '../components/features/WaterTracker';
import MealTracker from '../components/features/MealTracker';
import JoggingTracker from '../components/features/JoggingTracker';
import TaskItem from '../components/features/TaskItem';
import AddTaskModal from '../components/features/AddTaskModal';
import HealthStreakBanner from '../components/features/HealthStreakBanner';
import PartnerReminderModal from '../components/features/PartnerReminderModal';
import {
  getDailyData,
  fetchDailyDataFromCloud,
  subscribeToDailyRealtime,
  toggleWaterSlot,
  toggleMeal,
  toggleJogging,
  addTask,
  toggleTask,
  deleteTask,
  getCoupleHealthStatus,
  getBaliDateString,
} from '../services/checklistService';
import {
  subscribeToPartnerReminders,
  getNotificationPermission,
  requestNotificationPermission,
  isNotificationSupported,
  testNotification,
} from '../services/notificationService';
import { Plus, ListTodo, Calendar, UserCheck, Bell, BellRing } from 'lucide-react';
import { PROFILES } from '../config/profiles';

export default function DailyChecklistView({ onBack, user }) {
  const [data, setData] = useState(() => getDailyData());
  const [selectedUserId, setSelectedUserId] = useState(user?.id || 'user_sayang');
  const [taskFilter, setTaskFilter] = useState('active'); // 'all' | 'active' | 'completed'
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [incomingReminder, setIncomingReminder] = useState(null);
  const [notifPerm, setNotifPerm] = useState(() => getNotificationPermission());

  const partnerId = user?.id === 'user_sayang' ? 'user_izza' : 'user_sayang';
  const partnerName = user?.id === 'user_sayang' ? 'Izza' : 'Cahayu';

  // Sinkronisasi data Cloud Supabase & Realtime Listener
  useEffect(() => {
    let isMounted = true;

    // 1. Ambil data terbaru dari Supabase Cloud
    fetchDailyDataFromCloud().then((cloudData) => {
      if (isMounted && cloudData) {
        setData({ ...cloudData });
      }
    });

    // 2. Berlangganan Realtime: Centang air/makan dari pasangan langsung terupdate live
    const channel = subscribeToDailyRealtime((updatedData) => {
      if (isMounted && updatedData) {
        setData({ ...updatedData });
      }
    });

    // 3. Berlangganan Pengingat Sehat Realtime dari Pasangan
    const reminderChannel = subscribeToPartnerReminders(user?.id, (payload) => {
      if (isMounted) {
        setIncomingReminder({
          senderName: payload.senderName || partnerName,
          message: payload.message,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        });
      }
    });

    return () => {
      isMounted = false;
      channel?.unsubscribe?.();
      reminderChannel?.unsubscribe?.();
    };
  }, [user?.id, partnerName]);

  const handleEnableNotification = async () => {
    const granted = await requestNotificationPermission();
    setNotifPerm(getNotificationPermission());
    if (granted) {
      testNotification();
    }
  };

  const isMyChecklist = selectedUserId === user?.id;

  const activeProfile = PROFILES.find((p) => p.id === selectedUserId) || user;
  const partnerProfile = PROFILES.find((p) => p.id === partnerId) || { name: partnerName };
  const myProfile = PROFILES.find((p) => p.id === user?.id) || user;

  const coupleStatus = getCoupleHealthStatus(data);
  const myProgress = user?.id === 'user_sayang' ? coupleStatus.sayangProgress : coupleStatus.izzaProgress;
  const partnerProgress = user?.id === 'user_sayang' ? coupleStatus.izzaProgress : coupleStatus.sayangProgress;

  const currentChecklist = data[selectedUserId] || {
    water: [false, false, false, false],
    meals: { breakfast: false, lunch: false, dinner: false },
    jogging: false,
  };

  // Handlers
  const handleToggleWater = (slotIndex) => {
    if (!isMyChecklist) return; // Hanya pemilik akun yang dapat centang
    const updated = toggleWaterSlot(selectedUserId, slotIndex);
    setData({ ...updated });
  };

  const handleToggleMeal = (mealKey) => {
    if (!isMyChecklist) return;
    const updated = toggleMeal(selectedUserId, mealKey);
    setData({ ...updated });
  };

  const handleToggleJogging = () => {
    if (!isMyChecklist) return;
    const updated = toggleJogging(selectedUserId);
    setData({ ...updated });
  };

  const handleAddTask = (taskData) => {
    const updated = addTask({
      ...taskData,
      createdBy: selectedUserId,
    });
    setData({ ...updated });
  };

  const handleToggleTask = (taskId) => {
    const updated = toggleTask(taskId, user?.id || selectedUserId);
    setData({ ...updated });
  };

  const handleDeleteTask = (taskId) => {
    const updated = deleteTask(taskId, user?.id || selectedUserId);
    setData({ ...updated });
  };

  // Filter Tasks
  const allTasks = data.tasks || [];
  const filteredTasks = allTasks.filter((task) => {
    if (taskFilter === 'active') return !task.isCompleted;
    if (taskFilter === 'completed') return task.isCompleted;
    return true;
  });

  const activeCount = allTasks.filter((t) => !t.isCompleted).length;
  const completedCount = allTasks.filter((t) => t.isCompleted).length;

  // Format tanggal WITA untuk header
  const baliDateFormatted = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Makassar',
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return (
    <GradientBackground>
      {/* App Header */}
      <AppHeader
        title="Daily Checklist"
        subtitle="Rutinitas & Target Kesehatan Kita"
        onBack={onBack}
        rightAction={
          <div className="flex items-center gap-2">
            {isNotificationSupported() && (
              <button
                type="button"
                onClick={notifPerm === 'granted' ? testNotification : handleEnableNotification}
                title={notifPerm === 'granted' ? 'Notifikasi HP Aktif (Klik untuk Tes Getar)' : 'Klik untuk Aktifkan Notifikasi HP'}
                className={`p-1.5 rounded-xl border text-[11px] font-medium transition-all flex items-center gap-1 ${
                  notifPerm === 'granted'
                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-pink-500/15 hover:bg-pink-500/25 text-pink-200 border-pink-500/40 animate-pulse'
                }`}
              >
                <Bell className="w-3.5 h-3.5 text-pink-300" />
                <span className="hidden sm:inline">{notifPerm === 'granted' ? 'Notif On' : 'Aktifkan'}</span>
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Realtime</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs text-pink-300">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium font-mono">{getBaliDateString()}</span>
            </div>
          </div>
        }
      />

      <div className="space-y-4 pb-6">
        {/* Incoming Partner Health Reminder Banner */}
        {incomingReminder && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/25 via-teal-500/20 to-blue-500/25 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.25)] text-xs flex items-center justify-between gap-3 animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/30 text-emerald-200">
                <BellRing className="w-5 h-5 text-emerald-400 animate-bounce" />
              </div>
              <div>
                <p className="font-semibold text-emerald-100 text-xs">
                  ⏰ Pengingat Sehat dari {incomingReminder.senderName}!
                </p>
                <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                  &ldquo;{incomingReminder.message}&rdquo; ({incomingReminder.time})
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIncomingReminder(null)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-200 text-xs shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        {/* Permission Banner if notifications are not yet enabled */}
        {isNotificationSupported() && notifPerm !== 'granted' && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-emerald-500/15 border border-pink-500/30 flex items-center justify-between gap-3 animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-pink-500/20 text-pink-300 shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-pink-100">Aktifkan Notifikasi Pengingat</p>
                <p className="text-[11px] text-pink-200/70 leading-tight">
                  HP akan bergetar saat {partnerName} mengingatkan kamu minum air atau makan!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleEnableNotification}
              className="py-1 px-3 rounded-xl bg-pink-500 hover:bg-pink-400 active:scale-95 text-white text-xs font-semibold shadow-md shadow-pink-500/20 transition-all shrink-0"
            >
              Izinkan
            </button>
          </div>
        )}

        {/* Profile Switcher Tabs (Decision #2: Personal per profile) */}
        <div className="flex items-center p-1 rounded-2xl bg-white/[0.04] border border-white/10">
          <button
            type="button"
            onClick={() => setSelectedUserId(user?.id || 'user_sayang')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              selectedUserId === user?.id
                ? 'bg-pink-500/20 text-pink-100 border border-pink-500/30 shadow-[0_0_12px_rgba(244,114,182,0.2)]'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Checklist Kamu ({user?.name || 'Sayang'})
          </button>
          <button
            type="button"
            onClick={() => setSelectedUserId(partnerId)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              selectedUserId === partnerId
                ? 'bg-pink-500/20 text-pink-100 border border-pink-500/30 shadow-[0_0_12px_rgba(244,114,182,0.2)]'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Checklist {partnerName}
          </button>
        </div>

        {/* Read-Only Notice if viewing partner */}
        {!isMyChecklist && (
          <div className="py-2.5 px-3.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs text-pink-200 flex items-center justify-between gap-2">
            <div>
              👀 Kamu sedang melihat progres hidup sehat <span className="font-semibold text-pink-100">{partnerName}</span>.
            </div>
            {!partnerProgress.isFullyCompleted && (
              <button
                type="button"
                onClick={() => setIsReminderOpen(true)}
                className="py-1 px-2.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-[11px] font-semibold text-pink-100 flex items-center gap-1 active:scale-95 transition-all flex-shrink-0 shadow-sm"
              >
                <Bell className="w-3 h-3 text-pink-300" />
                Ingatkan
              </button>
            )}
          </div>
        )}

        {/* 1. Health Streak Banner (Couple Streak) */}
        <HealthStreakBanner
          streakCount={coupleStatus.displayStreak}
          isCoupleCompleted={coupleStatus.isCoupleDone}
          myProgress={myProgress}
          partnerProgress={partnerProgress}
          user={myProfile}
          partner={partnerProfile}
          onOpenReminder={() => setIsReminderOpen(true)}
        />
        
        {/* Responsive Grid: Left Column (Health Routine) & Right Column (Tasks) on Desktop PC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Water, Meal, Jogging (6 cols on lg) */}
          <div className="lg:col-span-6 space-y-4">
            {/* 2. Water Tracker (2.000 ml) */}
            <WaterTracker
              water={currentChecklist.water}
              onToggleSlot={handleToggleWater}
              readOnly={!isMyChecklist}
            />

            {/* 3. Meal Tracker (3x Sehari) */}
            <MealTracker
              meals={currentChecklist.meals}
              onToggleMeal={handleToggleMeal}
              readOnly={!isMyChecklist}
              profile={activeProfile}
            />

            {/* 4. Jogging Tracker (Selasa, Kamis, Minggu) */}
            <JoggingTracker
              jogging={currentChecklist.jogging}
              onToggleJogging={handleToggleJogging}
              readOnly={!isMyChecklist}
              profile={activeProfile}
            />
          </div>

          {/* Right Column: Custom Tasks Section (6 cols on lg) */}
          <div className="lg:col-span-6">
            <GlassCard className="space-y-4 border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
                    <ListTodo className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-pink-100">
                      Tugas Kerja & Kuliah
                    </h3>
                    <p className="text-[11px] text-neutral-400">
                      {activeCount} aktif, {completedCount} selesai
                    </p>
                  </div>
                </div>

                {isMyChecklist && (
                  <button
                    type="button"
                    onClick={() => setIsAddTaskOpen(true)}
                    className="p-1.5 px-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah
                  </button>
                )}
              </div>

              {/* Task Filters */}
              <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setTaskFilter('all')}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                    taskFilter === 'all'
                      ? 'bg-white/10 text-pink-100 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Semua ({allTasks.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTaskFilter('active')}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                    taskFilter === 'active'
                      ? 'bg-white/10 text-pink-100 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Aktif ({activeCount})
                </button>
                <button
                  type="button"
                  onClick={() => setTaskFilter('completed')}
                  className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                    taskFilter === 'completed'
                      ? 'bg-white/10 text-pink-100 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Selesai ({completedCount})
                </button>
              </div>

              {/* Tasks List */}
              <div className="space-y-2 pt-1">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                    />
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-neutral-500">
                    {taskFilter === 'completed'
                      ? 'Belum ada tugas yang selesai.'
                      : taskFilter === 'active'
                      ? 'Yeay! Semua tugas aktif sudah selesai 🎉'
                      : 'Belum ada tugas yang ditambahkan.'}
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="text-center pt-2 pb-4 text-[11px] text-neutral-500 select-none">
        <p className="flex items-center justify-center gap-1">
          {baliDateFormatted} • Auto reset 00:00 WITA
        </p>
      </footer>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAddTask={handleAddTask}
        user={user}
      />

      {/* Partner Reminder Modal */}
      <PartnerReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        partner={partnerProfile}
        partnerProgress={partnerProgress}
        user={user}
      />
    </GradientBackground>
  );
}
