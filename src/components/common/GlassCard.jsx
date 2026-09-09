
export default function GlassCard({ children, className = '', onClick, ...props }) {
  const interactiveClasses = onClick
    ? 'cursor-pointer hover:border-pink-500/30 hover:bg-white/[0.06] active:scale-[0.99]'
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-200 ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}