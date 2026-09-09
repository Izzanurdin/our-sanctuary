import { ChevronLeft } from 'lucide-react';

export default function AppHeader({
  title,
  subtitle,
  onBack,
  rightAction,
  className = '',
}) {
  return (
    <header className={`flex items-center justify-between py-3 mb-4 select-none ${className}`}>
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Kembali"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] active:scale-90 border border-white/10 text-pink-200 transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5 -ml-0.5" />
          </button>
        )}
        <div>
          {title && (
            <h1 className="text-lg font-semibold tracking-wide text-pink-100">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs text-pink-200/60 leading-tight">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {rightAction && (
        <div className="flex items-center">
          {rightAction}
        </div>
      )}
    </header>
  );
}
