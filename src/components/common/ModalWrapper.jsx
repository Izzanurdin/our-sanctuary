import { useEffect } from 'react';
import { X } from 'lucide-react';
import GlassCard from './GlassCard';

export default function ModalWrapper({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  maxWidth = 'max-w-md',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} transform transition-all duration-300 scale-100 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <GlassCard className="relative border-pink-500/30 bg-[#120a11]/95 shadow-[0_16px_48px_rgba(0,0,0,0.7)] p-5 sm:p-6 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10 shrink-0">
            {title && (
              <h2 className="text-base font-semibold tracking-wide text-pink-100 font-cinzel">
                {title}
              </h2>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup dialog"
              className="flex items-center justify-center w-8 h-8 -mr-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] active:scale-90 border border-white/10 text-pink-300 hover:text-pink-100 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="text-neutral-200 overflow-y-auto flex-1 pr-0.5">
            {children}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
