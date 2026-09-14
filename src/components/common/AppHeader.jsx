import { ChevronLeft } from 'lucide-react';

export default function AppHeader({
  title,
  subtitle,
  onBack,
  rightAction,
  className = '',
}) {
  return (
    <header className={`flex items-center justify-between py-2.5 sm:py-3 mb-3 sm:mb-4 select-none ${className}`}>
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Kembali"
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] active:scale-90 border border-white/10 text-pink-200 transition-all duration-200 shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 -ml-0.5" />
          </button>
        )}
        <div className="min-w-0">
          {title && (
            <h1 className="text-base sm:text-xl font-semibold tracking-wide text-pink-100 font-cinzel leading-tight truncate">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-pink-200/70 leading-tight truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {rightAction && (
        <div className="flex items-center shrink-0 ml-2">
          {rightAction}
        </div>
      )}
    </header>
  );
}
