import { useState } from 'react';
import GradientBackground from '../components/common/GradientBackground';
import AppHeader from '../components/common/AppHeader';
import GlassCard from '../components/common/GlassCard';
import WaterTracker from '../components/features/WaterTracker';
import MealTracker from '../components/features/MealTracker';
import JoggingTracker from '../components/features/JoggingTracker';
import TaskItem from '../components/features/TaskItem';
import AddTaskModal from '../components/features/AddTaskModal';
import HealthStreakBanner from '../components/features/HealthStreakBanner';
import {
  getDailyData,
  toggleWaterSlot,
  toggleMeal,
  toggleJogging,
  addTask,
  toggleTask,
  deleteTask,
  getHealthProgress,
  getBaliDateString,
} from '../services/checklistService';
import { Plus, ListTodo, Calendar, UserCheck } from 'lucide-react';
import { PROFILES } from '../config/profiles';

export default function DailyChecklistView({ onBack, user }) {
  const [data, setData] = useState(() => getDailyData());
  const [selectedUserId, setSelectedUserId] = useState(user?.id || 'user_sayang');
  const [taskFilter, setTaskFilter] = useState('active'); // 'all' | 'active' | 'completed'
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const isMyChecklist = selectedUserId === user?.id;
  const partnerId = user?.id === 'user_sayang' ? 'user_izza' : 'user_sayang';
  const partnerName = user?.id === 'user_sayang' ? 'Izza' : 'Cahayu';
  const activeProfile = PROFILES.find((p) => p.id === selectedUserId) || user;

  const currentChecklist = data[selectedUserId] || {
    water: [false, false, false, false],
    meals: { breakfast: false, lunch: false, dinner: false },
    jogging: false,
  };

  const progress = getHealthProgress(selectedUserId, data);

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
    const updated = toggleTask(taskId);
    setData({ ...updated });
  };

  const handleDeleteTask = (taskId) => {
    const updated = deleteTask(taskId);
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
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs text-pink-300">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium font-mono">{getBaliDateString()}</span>
          </div>
        }
      />

      <div className="space-y-4 pb-6">
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
          <div className="py-2 px-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-[11px] text-pink-200 text-center">
            👀 Kamu sedang melihat progres hidup sehat <span className="font-semibold text-pink-100">{partnerName}</span> hari ini.
          </div>
        )}

        {/* 1. Health Streak Banner */}
        <HealthStreakBanner
          streakCount={data.streak?.count || 0}
          isCompletedToday={progress.isFullyCompleted}
          progressPercent={progress.percent}
          profile={activeProfile}
        />

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

        {/* 5. Custom Tasks Section */}
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

            <button
              type="button"
              onClick={() => setIsAddTaskOpen(true)}
              className="py-1.5 px-3 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-xs font-medium text-pink-200 active:scale-95 transition-all flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah
            </button>
          </div>

          {/* Filter Tabs (Decision #3: Opsi B) */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
            <button
              type="button"
              onClick={() => setTaskFilter('all')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center font-medium transition-all ${
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
              className={`flex-1 py-1.5 px-2 rounded-lg text-center font-medium transition-all ${
                taskFilter === 'active'
                  ? 'bg-pink-500/20 text-pink-200 border border-pink-500/30'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Aktif ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setTaskFilter('completed')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center font-medium transition-all ${
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
    </GradientBackground>
  );
}
