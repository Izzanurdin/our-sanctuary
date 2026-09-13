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
  INITIAL_DATES,
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

  // Filter States for Date Deck: Default to 'wishlist' agar pengguna langsung disapa ide baru!
  const [statusFilter, setStatusFilter] = useState('wishlist'); // 'wishlist' | 'scheduled' | 'completed' | 'all'
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

  const handleOpenDriveFolder = (driveUrlOrDate) => {
    let url = MAIN_GOOGLE_DRIVE_FOLDER;
    if (typeof driveUrlOrDate === 'object' && driveUrlOrDate !== null) {
      const rawUrl = driveUrlOrDate.driveUrl || '';
      if (rawUrl && !rawUrl.includes('1xG4Z-xUO0c1g49u') && !rawUrl.includes('AlspXi')) {
        url = rawUrl;
      } else {
        const found = INITIAL_DATES.find(
          (d) => d.id === driveUrlOrDate.id || (d.driveFolder && d.driveFolder === driveUrlOrDate.driveFolder)
        );
        url = found?.driveUrl || MAIN_GOOGLE_DRIVE_FOLDER;
      }
    } else if (typeof driveUrlOrDate === 'string' && driveUrlOrDate) {
      if (!driveUrlOrDate.includes('1xG4Z-xUO0c1g49u') && !driveUrlOrDate.includes('AlspXi')) {
        url = driveUrlOrDate;
      }
    }
    window.open(url, '_blank', 'noopener,noreferrer');
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
        title="Kisah Cinta Kita"
        subtitle="Kartu Kencan, Pengacak Ide & Galeri Kenangan"
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

      <div className="max-w-5xl mx-auto space-y-4 pb-12 px-1">
        {/* Main 2 Sub-Tabs (Kartu Kencan vs Galeri Kenangan) */}
        <div className="flex items-center p-1 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('dates')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'dates'
                ? 'bg-gradient-to-r from-pink-500/30 to-rose-500/30 text-pink-100 border border-pink-500/40 shadow-[0_0_15px_rgba(244,114,182,0.25)]'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <CalendarHeart className="w-4 h-4 text-pink-400" />
            <span>Kartu Kencan</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-pink-200 font-mono">
              {allDates.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('memories')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'memories'
                ? 'bg-gradient-to-r from-pink-500/30 to-rose-500/30 text-pink-100 border border-pink-500/40 shadow-[0_0_15px_rgba(244,114,182,0.25)]'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Image className="w-4 h-4 text-rose-400" />
            <span>Galeri Kenangan</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-rose-200 font-mono">
              {completedCount}
            </span>
          </button>
        </div>

        {/* 1. DATE DECK VIEW */}
        {activeTab === 'dates' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Action Bar (Header Actions: Shuffler & Add Date) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-2 px-1">
                <Sparkles className="w-4 h-4 text-pink-400 flex-shrink-0 animate-soft-pulse" />
                <p className="text-xs text-neutral-300">
                  {statusFilter === 'wishlist' && (
                    <span>
                      Ada <strong className="text-pink-300 font-semibold">{wishlistCount} ide kencan</strong> yang siap dicoba!
                    </span>
                  )}
                  {statusFilter === 'scheduled' && (
                    <span>
                      <strong className="text-pink-300 font-semibold">{scheduledCount} kencan</strong> sudah terjadwal.
                    </span>
                  )}
                  {statusFilter === 'completed' && (
                    <span>
                      <strong className="text-emerald-300 font-semibold">{completedCount} kencan indah</strong> telah dilalui bersama.
                    </span>
                  )}
                  {statusFilter === 'all' && (
                    <span>
                      Menampilkan semua <strong className="text-pink-200 font-semibold">{allDates.length} kencan</strong>.
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsShufflerOpen(true)}
                  className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-rose-600/30 hover:from-purple-600/40 hover:to-rose-600/40 border border-pink-500/40 text-xs font-semibold text-pink-100 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(244,114,182,0.15)]"
                >
                  <Shuffle className="w-3.5 h-3.5 text-pink-300" />
                  <span>Acak Kencan 🎲</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddDateOpen(true)}
                  className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-medium text-pink-200 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-pink-400" />
                  <span>Tambah Ide</span>
                </button>
              </div>
            </div>

            {/* Status Filter Tabs (Wishlist First, Clean Segmented Control) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('wishlist')}
                className={`py-2 px-2.5 rounded-xl font-semibold text-center transition-all flex items-center justify-center gap-1.5 ${
                  statusFilter === 'wishlist'
                    ? 'bg-pink-500/30 text-pink-100 border border-pink-500/50 shadow-[0_0_12px_rgba(244,114,182,0.2)]'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <span>💡 Ide Kencan</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">
                  {wishlistCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('scheduled')}
                className={`py-2 px-2.5 rounded-xl font-semibold text-center transition-all flex items-center justify-center gap-1.5 ${
                  statusFilter === 'scheduled'
                    ? 'bg-pink-500/30 text-pink-100 border border-pink-500/50 shadow-[0_0_12px_rgba(244,114,182,0.2)]'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <span>🗓️ Terjadwal</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">
                  {scheduledCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('completed')}
                className={`py-2 px-2.5 rounded-xl font-semibold text-center transition-all flex items-center justify-center gap-1.5 ${
                  statusFilter === 'completed'
                    ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <span>✨ Selesai</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">
                  {completedCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`py-2 px-2.5 rounded-xl font-semibold text-center transition-all flex items-center justify-center gap-1.5 ${
                  statusFilter === 'all'
                    ? 'bg-white/15 text-pink-100 border border-white/20 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <span>Semua</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">
                  {allDates.length}
                </span>
              </button>
            </div>

            {/* Energy Level Filter Pills (Spacious, Touch-Friendly, No Ugly Scrollbar) */}
            <div className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 no-scrollbar">
              {ENERGY_LEVELS.map((energy) => {
                const isSelected = energyFilter === energy.id;
                return (
                  <button
                    key={energy.id}
                    type="button"
                    onClick={() => setEnergyFilter(energy.id)}
                    className={`text-xs font-semibold py-1.5 px-3 sm:px-3.5 rounded-xl border whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 shadow-sm ${
                      isSelected
                        ? 'bg-pink-500/30 border-pink-400 text-pink-100 shadow-[0_0_12px_rgba(244,114,182,0.3)]'
                        : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.06]'
                    }`}
                  >
                    <span>{energy.icon}</span>
                    <span>{energy.shortLabel || energy.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dates Grid / List (1 Col on Mobile, 2 Cols on PC) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDates.length > 0 ? (
                filteredDates.map((date) => (
                  <DateCard
                    key={date.id}
                    date={date}
                    onSchedule={handleOpenScheduleModal}
                    onComplete={handleCompleteDate}
                    onDelete={handleDeleteDate}
                    onViewDrive={() => handleOpenDriveFolder(date)}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 px-4 text-center rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 flex items-center justify-center mx-auto text-xl">
                    💌
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-neutral-300">
                      Tidak ada ide kencan pada filter ini
                    </p>
                    <p className="text-xs text-neutral-400">
                      {statusFilter === 'wishlist'
                        ? 'Kamu bisa menambahkan ide kencan kustom baru atau reset filter mood.'
                        : 'Coba pilih filter status atau mood lain.'}
                    </p>
                  </div>
                  <div className="pt-1 flex items-center justify-center gap-2">
                    {energyFilter !== 'all' && (
                      <button
                        type="button"
                        onClick={() => setEnergyFilter('all')}
                        className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-neutral-300 transition-all"
                      >
                        Reset Mood Filter
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsAddDateOpen(true)}
                      className="py-1.5 px-3 rounded-xl bg-pink-500/25 hover:bg-pink-500/35 border border-pink-500/40 text-xs font-semibold text-pink-200 transition-all"
                    >
                      + Tambah Ide Baru
                    </button>
                  </div>
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
                    onViewDrive={() => handleOpenDriveFolder(memory)}
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
