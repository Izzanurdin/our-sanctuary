
export default function GradientBackground({ children, className = '' }) {
  return (
    <div className="relative min-h-screen w-full bg-[#0a0508] text-white overflow-x-hidden">
      {/* Ambient Glow Orbs */}
      <div className="pointer-events-none fixed -top-24 -left-24 w-96 h-96 rounded-full bg-pink-500/15 blur-[120px]" />
      <div className="pointer-events-none fixed top-1/2 -right-24 w-80 h-80 rounded-full bg-rose-600/10 blur-[100px]" />
      <div className="pointer-events-none fixed -bottom-24 left-1/3 w-96 h-96 rounded-full bg-pink-400/10 blur-[120px]" />

      {/* Main Mobile-First Wrapper */}
      <main className={`relative z-10 mx-auto min-h-screen max-w-md px-5 py-6 flex flex-col justify-between ${className}`}>
        {children}
      </main>
    </div>
  );
}