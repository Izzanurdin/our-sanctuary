
export default function GradientBackground({
  children,
  className = '',
  maxWidthClass = 'max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl',
}) {
  return (
    <div className="relative min-h-screen w-full bg-[#0a0508] text-white overflow-x-hidden">
      {/* Ambient Glow Orbs (Enhanced for both PC wide screens and Mobile) */}
      <div className="pointer-events-none fixed -top-24 -left-24 w-96 h-96 md:w-[32rem] md:h-[32rem] rounded-full bg-pink-500/15 blur-[120px]" />
      <div className="pointer-events-none fixed top-1/2 -right-24 w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-full bg-rose-600/10 blur-[100px]" />
      <div className="pointer-events-none fixed -bottom-24 left-1/3 w-96 h-96 md:w-[36rem] md:h-[36rem] rounded-full bg-pink-400/10 blur-[120px]" />

      {/* Main Responsive Wrapper */}
      <main
        className={`relative z-10 mx-auto min-h-screen w-full px-4 sm:px-6 md:px-8 py-6 flex flex-col justify-between transition-all duration-300 ${maxWidthClass} ${className}`}
      >
        {children}
      </main>
    </div>
  );
}