import { useState, useEffect } from 'react';
import GradientBackground from '../components/common/GradientBackground';
import AppHeader from '../components/common/AppHeader';
import DateCard from '../components/features/DateCard';
import DateShuffler from '../components/features/DateShuffler';
import ScheduleDateModal from '../components/features/ScheduleDateModal';
import AddDateModal from '../components/features/AddDateModal';
import MemoryCard from '../components/features/MemoryCard';
import AddMemoryModal from '../components/features/AddMemoryModal';
import {
  getLoveLifeData,
  fetchLoveLifeData,
  subscribeToLoveLifeRealtime,
  addDateIdea,
  scheduleDate,
  completeDateWithMemory,
  deleteDate,
  ENERGY_LEVELS,
  MAIN_GOOGLE_DRIVE_FOLDER,
} from '../services/loveLifeService';
import {
  CalendarHeart,
  Image,
  Shuffle,
  Plus,
  FolderHeart,
  Sparkles,
  ExternalLink,
  Camera,
} from 'lucide-react';

export default function LoveLifeView({ onBack, user }) {
  const [data, setData] = useState(() => getLoveLifeData());
  const [activeTab, setActiveTab] = useState('dates'); // 'dates' | 'memories'

  // Sinkronisasi data dari Supabase Cloud & Realtime listener
  useEffect(() => {
    let isMounted = true;

    // Ambil data terbaru dari Supabase Cloud saat komponen dibuka
    fetchLoveLifeData().then((cloudData) => {
      if (isMounted && cloudData?.dates) {
        setData(cloudData);
      }
    });

    // Berlangganan perubahan data secara Realtime
    const unsubscribe = subscribeToLoveLifeRealtime((refreshedData) => {
      if (isMounted && refreshedData?.dates) {
        setData(refreshedData);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Filter States for Date Deck
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'wishlist' | 'scheduled' | 'completed'
  const [energyFilter, setEnergyFilter] = useState('all');

  // Modals state
  const [isShufflerOpen, setIsShufflerOpen] = useState(false);
  const [isAddDateOpen, setIsAddDateOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedDateToSchedule, setSelectedDateToSchedule] = useState(null);

  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
  const [selectedDateForMemory, setSelectedDateForMemory] = useState(null);

  const allDates = data.dates || [];

  // Handlers
  const handleAddDate = async (newDateData) => {
    const updated = await addDateIdea(newDateData);
    setData({ ...updated });
    return updated;
  };

  const handleOpenScheduleModal = (date) => {
    setSelectedDateToSchedule(date);
    setIsScheduleOpen(true);
  };

  const handleConfirmSchedule = (dateId, scheduleDetails) => {
    const updated = scheduleDate(dateId, scheduleDetails);
    setData({ ...updated });
  };

  const handleCompleteDate = (date) => {
    // Buka modal abadikan kenangan yang sudah terisi otomatis
    setSelectedDateForMemory(date);
    setIsAddMemoryOpen(true);
  };

  const handleSaveMemory = (dateId, memoryDetails) => {
    if (dateId) {
      const updated = completeDateWithMemory(dateId, memoryDetails);
      setData({ ...updated });
    } else {
      // Jika kencan kustom baru tanpa id lama, buatkan tanggal selesai baru
      const updated = addDateIdea({
        title: memoryDetails.title,
        location: memoryDetails.location,
        energyKey: 'romantic',
        category: 'Memories',
        notes: memoryDetails.caption,
      });
      const newId = updated.dates[0].id;
      const finalUpdated = completeDateWithMemory(newId, memoryDetails);
      setData({ ...finalUpdated });
    }
  };

  const handleDeleteDate = (dateId) => {
    const updated = deleteDate(dateId);
    setData({ ...updated });
  };

  const handleOpenDriveFolder = (driveUrl) => {
    window.open(driveUrl || MAIN_GOOGLE_DRIVE_FOLDER, '_blank');
  };

  // Filtered Dates
  const filteredDates = allDates.filter((date) => {
    const matchesStatus =
      statusFilter === 'all' || date.status === statusFilter;
    const matchesEnergy =
      energyFilter === 'all' || date.energyKey === energyFilter;
    return matchesStatus && matchesEnergy;
  });

  // Filtered Completed Dates for Memory Vault
  const completedMemories = allDates.filter(
    (date) => date.status === 'completed'
  );

  const completedCount = completedMemories.length;
  const wishlistCount = allDates.filter((d) => d.status === 'wishlist').length;
  const scheduledCount = allDates.filter((d) => d.status === 'scheduled').length;

  return (
    <GradientBackground>
      {/* Top Header */}
      <AppHeader
        title="Love Life Engine"
        subtitle="Date Deck, Shuffler & Memory Vault"
        onBack={onBack}
        rightAction={
          <button
            type="button"
            onClick={() => handleOpenDriveFolder(MAIN_GOOGLE_DRIVE_FOLDER)}
            title="Buka Folder Google Drive Bersama"
            className="py-1 px-2.5 rounded-full bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-xs font-medium text-pink-200 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <FolderHeart className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Folder Drive</span>
            <ExternalLink className="w-2.5 h-2.5 text-neutral-400" />
          </button>
        }
      />

      <div className="space-y-4 pb-8">
        {/* Main 2 Sub-Tabs (Date Deck vs Memory Vault) */}
        <div className="flex items-center p-1 rounded-2xl bg-white/[0.04] border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('dates')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'dates'
                ? 'bg-gradient-to-r from-pink-500/30 to-rose-500/30 text-pink-100 border border-pink-500/40 shadow-[0_0_15px_rgba(244,114,182,0.25)]'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <CalendarHeart className="w-4 h-4 text-pink-400" />
            Date Deck ({allDates.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('memories')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'memories'
                ? 'bg-gradient-to-r from-pink-500/30 to-rose-500/30 text-pink-100 border border-pink-500/40 shadow-[0_0_15px_rgba(244,114,182,0.25)]'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Image className="w-4 h-4 text-rose-400" />
            Memory Vault ({completedCount})
          </button>
        </div>

        {/* 1. DATE DECK VIEW */}
        {activeTab === 'dates' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* Action Bar (Shuffler & Add Date) */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsShufflerOpen(true)}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-rose-600/30 hover:from-purple-600/40 hover:to-rose-600/40 border border-pink-500/40 text-xs font-semibold text-pink-100 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(244,114,182,0.15)]"
              >
                <Shuffle className="w-4 h-4 text-pink-300 animate-soft-pulse" />
                Acak Kencan 🎲
              </button>

              <button
                type="button"
                onClick={() => setIsAddDateOpen(true)}
                className="py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 hover:border-pink-500/30 text-xs font-medium text-pink-200 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-pink-400" />
                Tambah Ide
              </button>
            </div>

            {/* Status Filter Tabs (Touch-friendly & Comfortable) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`py-2 px-2 rounded-xl font-semibold text-center transition-all ${
                  statusFilter === 'all'
                    ? 'bg-white/15 text-pink-100 shadow-sm border border-white/20'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Semua ({allDates.length})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('wishlist')}
                className={`py-2 px-2 rounded-xl font-semibold text-center transition-all ${
                  statusFilter === 'wishlist'
                    ? 'bg-pink-500/25 text-pink-100 border border-pink-500/40 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Wishlist ({wishlistCount})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('scheduled')}
                className={`py-2 px-2 rounded-xl font-semibold text-center transition-all ${
                  statusFilter === 'scheduled'
                    ? 'bg-pink-500/25 text-pink-100 border border-pink-500/40 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Terjadwal ({scheduledCount})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('completed')}
                className={`py-2 px-2 rounded-xl font-semibold text-center transition-all ${
                  statusFilter === 'completed'
                    ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-500/40 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Selesai ({completedCount})
              </button>
            </div>

            {/* Energy Level Filter Pills (Spacious, Touch-Friendly, No Ugly Scrollbar) */}
            <div className="flex items-center gap-2.5 overflow-x-auto py-1 px-0.5 no-scrollbar">
              {ENERGY_LEVELS.map((energy) => {
                const isSelected = energyFilter === energy.id;
                return (
                  <button
                    key={energy.id}
                    type="button"
                    onClick={() => setEnergyFilter(energy.id)}
                    className={`text-xs font-semibold py-2 px-3.5 sm:px-4 rounded-xl border whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 shadow-sm ${
                      isSelected
                        ? 'bg-pink-500/30 border-pink-400 text-pink-100 shadow-[0_0_12px_rgba(244,114,182,0.3)]'
                        : 'bg-white/[0.04] border-white/10 text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.07]'
                    }`}
                  >
                    <span>{energy.icon}</span>
                    <span>{energy.shortLabel || energy.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dates Grid / List (1 Col on Mobile, 2 Cols on PC) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {filteredDates.length > 0 ? (
                filteredDates.map((date) => (
                  <DateCard
                    key={date.id}
                    date={date}
                    onSchedule={handleOpenScheduleModal}
                    onComplete={handleCompleteDate}
                    onDelete={handleDeleteDate}
                    onViewDrive={() => handleOpenDriveFolder(date.driveUrl)}
                  />
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-xs text-neutral-500 bg-white/[0.02] rounded-2xl border border-white/5 p-4">
                  Tidak ada ide kencan pada filter ini.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. MEMORY VAULT VIEW */}
        {activeTab === 'memories' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Header Memory Vault with Drive Link */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/15 via-purple-500/10 to-rose-500/15 border border-pink-500/30 shadow-[0_0_25px_rgba(244,114,182,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-pink-100 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-pink-300" />
                  Galeri Polaroid Kenangan Kita
                </h3>
                <p className="text-xs text-neutral-300 mt-0.5">
                  {completedCount} kencan manis telah dilalui bersama. Foto original tersimpan di Google Drive.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleOpenDriveFolder(MAIN_GOOGLE_DRIVE_FOLDER)}
                  className="flex-1 sm:flex-initial py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-semibold text-pink-200 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <FolderHeart className="w-3.5 h-3.5 text-pink-400" />
                  Buka Drive
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedDateForMemory(null);
                    setIsAddMemoryOpen(true);
                  }}
                  className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5 text-pink-200" />
                  + Polaroid
                </button>
              </div>
            </div>

            {/* Polaroid Cards Grid (1 Col on Mobile, 2 Col on Tablet, 3 Col on PC) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {completedMemories.length > 0 ? (
                completedMemories.map((memory) => (
                  <MemoryCard
                    key={memory.id}
                    memory={memory}
                    onDelete={handleDeleteDate}
                    onViewDrive={() => handleOpenDriveFolder(memory.driveUrl)}
                  />
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-xs text-neutral-500 bg-white/[0.02] rounded-2xl border border-white/5 p-4">
                  Belum ada kenangan yang diabadikan. Selesaikan salah satu kencan di Date Deck!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <footer className="text-center pt-2 pb-4 text-[11px] text-neutral-500 select-none">
        <p>Special moments made for Izza & Cahayu ❤️</p>
      </footer>

      {/* 1. Date Shuffler Modal */}
      <DateShuffler
        isOpen={isShufflerOpen}
        onClose={() => setIsShufflerOpen(false)}
        dates={allDates}
        onSchedulePickedDate={(picked) => {
          setSelectedDateToSchedule(picked);
          setIsScheduleOpen(true);
        }}
      />

      {/* 2. Schedule Date Modal */}
      {isScheduleOpen && (
        <ScheduleDateModal
          isOpen={isScheduleOpen}
          onClose={() => {
            setIsScheduleOpen(false);
            setSelectedDateToSchedule(null);
          }}
          date={selectedDateToSchedule}
          onConfirmSchedule={handleConfirmSchedule}
        />
      )}

      {/* 3. Add Custom Date Idea Modal */}
      {isAddDateOpen && (
        <AddDateModal
          isOpen={isAddDateOpen}
          onClose={() => setIsAddDateOpen(false)}
          onAddDate={handleAddDate}
          user={user}
        />
      )}

      {/* 4. Add Memory Modal */}
      {isAddMemoryOpen && (
        <AddMemoryModal
          key={selectedDateForMemory?.id || 'new_memory'}
          isOpen={isAddMemoryOpen}
          onClose={() => {
            setIsAddMemoryOpen(false);
            setSelectedDateForMemory(null);
          }}
          completedDates={completedMemories}
          initialDate={selectedDateForMemory}
          onSaveMemory={handleSaveMemory}
          user={user}
        />
      )}
    </GradientBackground>
  );
}
