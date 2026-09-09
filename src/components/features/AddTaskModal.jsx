import { useState } from 'react';
import ModalWrapper from '../common/ModalWrapper';
import { Plus, Clock, Tag, FileText, Check } from 'lucide-react';

const CATEGORIES = ['Kuliah', 'Kerja', 'Personal'];

export default function AddTaskModal({
  isOpen,
  onClose,
  onAddTask,
  user,
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Kuliah');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Judul tugas tidak boleh kosong ya sayang');
      return;
    }

    onAddTask({
      title: title.trim(),
      category,
      deadline: deadline.trim(),
      notes: notes.trim(),
      createdBy: user?.id || 'user_sayang',
    });

    // Reset Form
    setTitle('');
    setCategory('Kuliah');
    setDeadline('');
    setNotes('');
    setError('');
    onClose();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Tugas Baru"
    >
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
          />
          {error && (
            <p className="text-[11px] text-rose-300 mt-1">{error}</p>
          )}
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
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all select-none flex items-center justify-center gap-1.5 ${
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

        {/* Deadline Input */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-pink-200 mb-1.5">
            <Clock className="w-3.5 h-3.5 text-pink-400" />
            Batas Waktu / Jam
          </label>
          <input
            type="text"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder="Contoh: 23:59 atau Besok 10:00"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-pink-500/50 focus:bg-white/[0.07] text-xs text-white placeholder-neutral-500 outline-none transition-all"
          />
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
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-pink-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Simpan Tugas
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}
