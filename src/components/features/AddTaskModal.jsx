import { useState } from 'react';
import ModalWrapper from '../common/ModalWrapper';
import {
  Plus,
  Clock,
  Tag,
  FileText,
  Check,
  Calendar,
  User,
  Heart,
  Save,
} from 'lucide-react';
import { getBaliDateString } from '../../services/checklistService';

const CATEGORIES = ['Kuliah', 'Kerja', 'Personal'];

// Helper to get formatted date string for offset in days
function getDateStringOffset(daysOffset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Makassar',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const y = parts.find((p) => p.type === 'year')?.value;
  const m = parts.find((p) => p.type === 'month')?.value;
  const d = parts.find((p) => p.type === 'day')?.value;
  return `${y}-${m}-${d}`;
}

// Format human-readable deadline display
function formatDeadlineDisplay(dateStr, timeStr) {
  if (!dateStr && !timeStr) return '';
  const todayStr = getBaliDateString();
  const tomorrowStr = getDateStringOffset(1);

  let datePart = '';
  if (dateStr) {
    if (dateStr === todayStr) {
      datePart = 'Hari ini';
    } else if (dateStr === tomorrowStr) {
      datePart = 'Besok';
    } else {
      const [y, m, d] = dateStr.split('-');
      const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      datePart = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
      }).format(dateObj);
    }
  }

  if (datePart && timeStr) {
    return `${datePart} ${timeStr}`;
  }
  return datePart || timeStr || '';
}

// Parse initial deadline for edit/add mode
function parseInitialDeadline(task) {
  const today = getBaliDateString();
  if (!task) {
    return {
      hasDeadline: true,
      deadlineDate: today,
      deadlineTime: '17:00',
    };
  }

  if (task.deadlineDate || task.deadlineTime) {
    return {
      hasDeadline: Boolean(task.deadlineDate || task.deadlineTime || task.deadline),
      deadlineDate: task.deadlineDate || (task.deadline ? today : ''),
      deadlineTime: task.deadlineTime || '17:00',
    };
  }

  if (!task.deadline) {
    return {
      hasDeadline: false,
      deadlineDate: today,
      deadlineTime: '17:00',
    };
  }

  // Parse legacy string
  const raw = task.deadline.trim();
  const tomorrow = getDateStringOffset(1);
  let date = today;
  if (/besok/i.test(raw)) {
    date = tomorrow;
  }

  const timeMatch = raw.match(/(\d{1,2})[:.](\d{2})/);
  let time = '17:00';
  if (timeMatch) {
    const hh = timeMatch[1].padStart(2, '0');
    const mm = timeMatch[2];
    time = `${hh}:${mm}`;
  }

  return {
    hasDeadline: true,
    deadlineDate: date,
    deadlineTime: time,
  };
}

function AddTaskForm({
  onClose,
  onAddTask,
  onSaveTask,
  initialTask = null,
  user,
  partnerName = 'Cahayu',
  defaultOwner,
}) {
  const isEditMode = Boolean(initialTask);
  const myId = user?.id || 'user_izza';
  const myName = user?.name || 'Izza';
  const partnerId = myId === 'user_sayang' ? 'user_izza' : 'user_sayang';

  const initialDeadline = parseInitialDeadline(initialTask);

  const [title, setTitle] = useState(initialTask?.title || '');
  const [category, setCategory] = useState(initialTask?.category || 'Kuliah');
  const [createdBy, setCreatedBy] = useState(
    initialTask?.createdBy || defaultOwner || myId
  );
  const [hasDeadline, setHasDeadline] = useState(initialDeadline.hasDeadline);
  const [deadlineDate, setDeadlineDate] = useState(initialDeadline.deadlineDate);
  const [deadlineTime, setDeadlineTime] = useState(initialDeadline.deadlineTime);
  const [notes, setNotes] = useState(initialTask?.notes || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Judul tugas tidak boleh kosong ya');
      return;
    }

    const computedDeadline = hasDeadline
      ? formatDeadlineDisplay(deadlineDate, deadlineTime)
      : '';

    const payload = {
      title: title.trim(),
      category,
      createdBy,
      deadline: computedDeadline,
      deadlineDate: hasDeadline ? deadlineDate : '',
      deadlineTime: hasDeadline ? deadlineTime : '',
      notes: notes.trim(),
    };

    if (onSaveTask) {
      onSaveTask(payload);
    } else if (onAddTask) {
      onAddTask(payload);
    }

    onClose();
  };

  const todayStr = getBaliDateString();
  const tomorrowStr = getDateStringOffset(1);
  const lusaStr = getDateStringOffset(2);
  const weekStr = getDateStringOffset(7);

  const previewDeadline = hasDeadline
    ? formatDeadlineDisplay(deadlineDate, deadlineTime)
    : 'Tanpa batas waktu';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-xs font-medium text-pink-200 mb-1.5">
            Judul Tugas <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            placeholder="Contoh: Kumpul Makalah Analisis Bisnis"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 focus:bg-white/[0.07] text-xs text-white placeholder-neutral-500 outline-none transition-all"
            autoFocus
          />
          {error && (
            <p className="text-[11px] text-rose-300 mt-1">{error}</p>
          )}
        </div>

        {/* Task Owner / Assignee Selector */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-pink-200 mb-1.5">
            <User className="w-3.5 h-3.5 text-pink-400" />
            Tugas Milik Siapa?
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCreatedBy(myId)}
              className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all select-none flex items-center justify-center gap-1.5 ${
                createdBy === myId
                  ? 'bg-indigo-500/25 border-indigo-500/50 text-indigo-100 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                  : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <User className="w-3.5 h-3.5 text-indigo-400" />
              Milikku ({myName})
              {createdBy === myId && <Check className="w-3 h-3 ml-0.5 text-indigo-300" />}
            </button>

            <button
              type="button"
              onClick={() => setCreatedBy(partnerId)}
              className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all select-none flex items-center justify-center gap-1.5 ${
                createdBy === partnerId
                  ? 'bg-pink-500/25 border-pink-500/50 text-pink-100 shadow-[0_0_12px_rgba(244,114,182,0.25)]'
                  : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/20" />
              Milik {partnerName}
              {createdBy === partnerId && <Check className="w-3 h-3 ml-0.5 text-pink-300" />}
            </button>
          </div>
        </div>

        {/* Category Selector */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-pink-200 mb-1.5">
            <Tag className="w-3.5 h-3.5 text-pink-400" />
            Kategori
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-2 px-2.5 rounded-xl border text-xs font-medium transition-all select-none flex items-center justify-center gap-1.5 ${
                  category === cat
                    ? 'bg-pink-500/20 border-pink-500/50 text-pink-200 shadow-[0_0_12px_rgba(244,114,182,0.2)]'
                    : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {category === cat && <Check className="w-3 h-3" />}
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Structured Deadline Picker (Date & Time Picker) */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs font-medium text-pink-200">
              <Clock className="w-3.5 h-3.5 text-pink-400" />
              Batas Waktu (Deadline)
            </label>
            <button
              type="button"
              onClick={() => setHasDeadline(!hasDeadline)}
              className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all ${
                hasDeadline
                  ? 'bg-pink-500/20 border-pink-500/40 text-pink-200'
                  : 'bg-white/5 border-white/10 text-neutral-400'
              }`}
            >
              {hasDeadline ? 'Aktif' : 'Tanpa Deadline'}
            </button>
          </div>

          {hasDeadline && (
            <div className="space-y-3 pt-1">
              {/* Date Selection */}
              <div>
                <span className="block text-[11px] text-neutral-400 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-neutral-400" />
                  Pilih Tanggal:
                </span>
                <div className="space-y-1.5">
                  <input
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    style={{ colorScheme: 'dark' }}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 focus:border-pink-500/60 text-xs text-white outline-none"
                  />
                  {/* Quick Date Presets */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { label: 'Hari ini', val: todayStr },
                      { label: 'Besok', val: tomorrowStr },
                      { label: 'Lusa', val: lusaStr },
                      { label: '+7 Hari', val: weekStr },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setDeadlineDate(preset.val)}
                        className={`py-1 px-1.5 rounded-lg text-[10.5px] border transition-all truncate ${
                          deadlineDate === preset.val
                            ? 'bg-pink-500/30 border-pink-500/60 text-pink-100 font-medium'
                            : 'bg-white/[0.04] border-white/10 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <span className="block text-[11px] text-neutral-400 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  Pilih Jam:
                </span>
                <div className="space-y-1.5">
                  <input
                    type="time"
                    value={deadlineTime}
                    onChange={(e) => setDeadlineTime(e.target.value)}
                    style={{ colorScheme: 'dark' }}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 focus:border-pink-500/60 text-xs text-white outline-none"
                  />
                  {/* Quick Time Presets */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {['12:00', '17:00', '20:00', '23:59'].map((tVal) => (
                      <button
                        key={tVal}
                        type="button"
                        onClick={() => setDeadlineTime(tVal)}
                        className={`py-1 px-1.5 rounded-lg text-[10.5px] font-mono border transition-all ${
                          deadlineTime === tVal
                            ? 'bg-purple-500/30 border-purple-500/60 text-purple-100 font-medium'
                            : 'bg-white/[0.04] border-white/10 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        {tVal}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Formatted Preview */}
              <div className="px-2.5 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-[11px] text-pink-200 flex items-center justify-between">
                <span className="text-neutral-400">Ringkasan:</span>
                <span className="font-medium font-mono text-pink-200">{previewDeadline}</span>
              </div>
            </div>
          )}
        </div>

        {/* Notes Textarea */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-pink-200 mb-1.5">
            <FileText className="w-3.5 h-3.5 text-pink-400" />
            Catatan Tambahan (Opsional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Tulis catatan, instruksi, atau link tugas..."
            className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 focus:bg-white/[0.07] text-xs text-white placeholder-neutral-500 outline-none transition-all resize-none"
          />
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 text-neutral-300 text-xs font-medium transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-pink-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            {isEditMode ? (
              <>
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Simpan Tugas
              </>
            )}
          </button>
        </div>
      </form>
  );
}

export default function AddTaskModal(props) {
  const { isOpen, onClose, initialTask } = props;
  const isEditMode = Boolean(initialTask);

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Tugas' : 'Tambah Tugas Baru'}
    >
      {isOpen && (
        <AddTaskForm
          key={initialTask?.id || 'new'}
          {...props}
        />
      )}
    </ModalWrapper>
  );
}

