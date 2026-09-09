import { CheckCircle2, Circle, Clock, Trash2 } from 'lucide-react';

const CATEGORY_STYLES = {
  Kuliah: {
    badge: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
  },
  Kerja: {
    badge: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
  },
  Personal: {
    badge: 'bg-pink-500/15 border-pink-500/30 text-pink-300',
  },
};

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  className = '',
}) {
  const isDone = Boolean(task.isCompleted);
  const categoryStyle = CATEGORY_STYLES[task.category] || CATEGORY_STYLES.Kuliah;

  return (
    <div
      className={`p-3.5 rounded-xl border transition-all duration-200 select-none ${
        isDone
          ? 'bg-white/[0.01] border-white/5 opacity-60'
          : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 hover:border-white/20'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Checkbox */}
        <button
          type="button"
          onClick={() => onToggle && onToggle(task.id)}
          aria-label={isDone ? 'Tandai belum selesai' : 'Tandai selesai'}
          className="mt-0.5 text-neutral-400 hover:text-pink-300 active:scale-90 transition-transform"
        >
          {isDone ? (
            <CheckCircle2 className="w-5 h-5 text-pink-400 fill-pink-400/20" />
          ) : (
            <Circle className="w-5 h-5 text-neutral-500 hover:text-neutral-300" />
          )}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${categoryStyle.badge}`}
            >
              {task.category || 'Tugas'}
            </span>

            {task.deadline && (
              <span className="flex items-center gap-1 text-[10px] text-neutral-400 font-mono">
                <Clock className="w-3 h-3 text-neutral-500" />
                {task.deadline}
              </span>
            )}
          </div>

          <h4
            className={`text-xs font-medium leading-snug transition-all ${
              isDone
                ? 'line-through text-neutral-500'
                : 'text-pink-100 hover:text-pink-200'
            }`}
          >
            {task.title}
          </h4>

          {task.notes && (
            <p
              className={`text-[11px] mt-1 leading-relaxed ${
                isDone ? 'text-neutral-600 line-through' : 'text-neutral-400'
              }`}
            >
              {task.notes}
            </p>
          )}
        </div>

        {/* Delete button */}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            title="Hapus tugas"
            aria-label="Hapus tugas"
            className="p-1 rounded-lg hover:bg-rose-500/20 text-neutral-500 hover:text-rose-300 active:scale-90 transition-all duration-150"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
