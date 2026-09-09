import {
  Heart,
  MapPin,
  Calendar,
  ExternalLink,
  FolderHeart,
  Camera,
  Trash2,
} from 'lucide-react';
import { MAIN_GOOGLE_DRIVE_FOLDER } from '../../services/loveLifeService';

export default function MemoryCard({ memory, onDelete, onViewDrive }) {
  const driveUrl = memory.driveUrl || MAIN_GOOGLE_DRIVE_FOLDER;

  const handleOpenDrive = (e) => {
    e.stopPropagation();
    if (onViewDrive) {
      onViewDrive(memory);
    } else {
      window.open(driveUrl, '_blank');
    }
  };

  const capturedByName =
    memory.capturedBy === 'user_sayang' ? 'Cahayu' : 'Izza';

  return (
    <div className="relative group p-3 pb-4 rounded-2xl bg-gradient-to-b from-white/[0.09] to-white/[0.03] border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-md hover:border-pink-500/40 transition-all duration-300">
      {/* Tape / Pin decoration */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-pink-500/25 border border-pink-400/30 rounded-sm backdrop-blur-sm transform -rotate-2 z-10 shadow-sm" />

      {/* Polaroid Image Area */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center">
        {memory.photoUrl ? (
          <img
            src={memory.photoUrl}
            alt={memory.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          /* Romantic Aesthetic Graphic if photo not yet uploaded */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-rose-950/40 via-purple-950/30 to-pink-950/40 text-center relative">
            <div className="p-3 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 mb-2">
              <Camera className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-pink-200 px-2 line-clamp-1">
              {memory.title}
            </p>
            {memory.driveFolder && (
              <span className="text-[10px] text-neutral-400 font-mono mt-1 px-2 py-0.5 rounded bg-black/40">
                {memory.driveFolder}
              </span>
            )}
          </div>
        )}

        {/* Small Heart Watermark */}
        <div className="absolute top-2 right-2 p-1 rounded-full bg-black/40 backdrop-blur-md text-pink-400">
          <Heart className="w-3 h-3 fill-pink-500/80" />
        </div>
      </div>

      {/* Polaroid Caption Bottom Area */}
      <div className="mt-3 px-1 space-y-2">
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-pink-100 line-clamp-1 font-cinzel">
            {memory.title}
          </h4>

          <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-0.5 flex-wrap">
            {memory.completedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5 text-pink-400" />
                {memory.completedAt}
              </span>
            )}

            {memory.location && (
              <span className="flex items-center gap-1 text-neutral-300">
                <MapPin className="w-2.5 h-2.5 text-pink-400" />
                {memory.location}
              </span>
            )}
          </div>
        </div>

        {/* Romantic Handwritten-like Caption */}
        {memory.caption && (
          <p className="text-xs text-neutral-200 font-playfair italic leading-relaxed bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
            &ldquo;{memory.caption}&rdquo;
          </p>
        )}

        {/* Footer info & Drive shortcut */}
        <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-400">
          <span className="text-pink-300/80">
            Diabadikan oleh <strong className="text-pink-200">{capturedByName}</strong>
          </span>

          <div className="flex items-center gap-1.5">
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(memory.id);
                }}
                className="p-1 rounded hover:text-rose-400 transition-colors"
                title="Hapus kenangan"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenDrive}
              title="Buka folder kencan ini di Google Drive"
              className="py-0.5 px-2 rounded-md bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-pink-200 font-medium transition-all flex items-center gap-1 active:scale-95"
            >
              <FolderHeart className="w-2.5 h-2.5" />
              <span>Drive</span>
              <ExternalLink className="w-2 h-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
