import { useState, useId, memo } from 'react';
import {
  GERBERA_PROFILES,
  PERMANENT_GERBERAS,
  LILY_PROFILES,
} from '../../../services/gardenService';

// Komponen Tunggal Bunga Gerbera Permanen
const GerberaFlower = memo(({ profileIndex, xPercent, yPercent, windAngle = 0 }) => {
  const profile = GERBERA_PROFILES[profileIndex] || GERBERA_PROFILES[0];
  const gradId = useId();
  const [isHovered, setIsHovered] = useState(false);

  // Pola ayunan santai berbeda untuk masing-masing 3 Gerbera
  const swayClass =
    profileIndex === 0
      ? 'animate-sway-1'
      : profileIndex === 1
      ? 'animate-sway-2'
      : 'animate-sway-3';

  const swayDuration = profileIndex === 0 ? '5.8s' : profileIndex === 1 ? '5.0s' : '5.4s';
  const swayDelay = profileIndex === 0 ? '0s' : profileIndex === 1 ? '-2.3s' : '-3.9s';

  const handlePointerEnter = (e) => {
    if (e.pointerType === 'mouse') setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      data-flower="true"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className="absolute pointer-events-auto select-none"
      style={{
        left: `${xPercent}%`,
        top: `${yPercent}%`,
        transform: `translate(-50%, -50%) scale(${isHovered ? 1.03 : 1})`,
        transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
        zIndex: 6,
      }}
    >
      {/* Lapisan Reaksi Terpaan Angin (Anggun & Kalem) */}
      <div
        style={{
          transformOrigin: '50% 92%',
          transform: `rotate(${windAngle * 0.35}deg) translate3d(${windAngle * 0.25}px, ${Math.abs(windAngle) * 0.12}px, 0)`,
          transition: windAngle !== 0
            ? 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
            : 'transform 1.6s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        {/* Lapisan Ayunan Alami Santai (Organic Idle Sway) */}
        <div
          className={swayClass}
          style={{
            animationDuration: swayDuration,
            animationDelay: swayDelay,
            transformOrigin: '50% 92%',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-24 h-24 sm:w-28 sm:h-28 overflow-visible"
            style={{
              filter: isHovered
                ? `drop-shadow(0 0 16px ${profile.glow}) drop-shadow(0 0 32px ${profile.outerGlow})`
                : `drop-shadow(0 0 12px ${profile.glow}) drop-shadow(0 0 28px ${profile.outerGlow})`,
              transition: 'filter 0.5s ease',
            }}
          >
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={profile.main} />
                <stop offset="70%" stopColor={profile.dark} />
                <stop offset="100%" stopColor="#1e3d2f" />
              </linearGradient>
            </defs>

            {/* 24 Kelopak Berputar Berulang */}
            <g transform="translate(50, 50)">
              {Array.from({ length: 24 }).map((_, i) => (
                <path
                  key={i}
                  d="M -2.5, 0 Q -6, -22 -3, -42 Q 0, -50 3, -42 Q 6, -22 2.5, 0 Z"
                  fill={`url(#${gradId})`}
                  transform={`rotate(${i * 15})`}
                />
              ))}
            </g>

            {/* Inti Pusat Bunga */}
            <circle cx="50" cy="50" r="12" fill="#21100b" stroke="#4e342e" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
});

GerberaFlower.displayName = 'GerberaFlower';

// Komponen Tunggal Bunga Lily Mekar
const LilyFlower = memo(({ flower, onSelectSecret, windAngle = 0, index = 0 }) => {
  const profile = LILY_PROFILES[flower.profileIndex] || LILY_PROFILES[0];
  const gradId = useId();
  const [floatingText, setFloatingText] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const hasSecret = Boolean(flower.secretMessage);

  const scale = flower.scale || 0.85;

  // Hasilkan ritme ayunan unik dari ID bunga agar tidak ada 2 bunga yang berayun sama
  const seed = (index * 7 + (flower.id ? flower.id.charCodeAt(flower.id.length - 1) : 3)) % 100;
  const swayClass = seed % 3 === 0 ? 'animate-sway-1' : seed % 3 === 1 ? 'animate-sway-2' : 'animate-sway-3';
  const duration = (4.2 + (seed % 20) * 0.14).toFixed(2) + 's';
  const delay = (-((seed % 40) * 0.14)).toFixed(2) + 's';

  // Pointer enter & leave yang membedakan mouse desktop vs touch mobile
  const handlePointerEnter = (e) => {
    // Pada mobile touch, jangan biarkan efek hover tersangkut (sticky hover)
    if (e.pointerType === 'mouse') {
      setIsHovered(true);
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  // Handle KLIK / TAP untuk membuka bisikan rahasia (HANYA saat diklik/tap, BUKAN saat di-hover!)
  const handleClick = (e) => {
    e.stopPropagation();

    // Reaksi sentuh lembut sejenak pada layar HP
    setIsHovered(true);
    setTimeout(() => setIsHovered(false), 700);

    if (hasSecret) {
      // Munculkan teks melayang singkat di langit taman
      setFloatingText(flower.secretMessage);
      setTimeout(() => setFloatingText(null), 3800);

      // Buka modal kartu surat cinta
      if (onSelectSecret) {
        onSelectSecret(flower);
      }
    }
  };

  // Hover yang sangat lembut (hanya micro-tilt 1.2 derajat yang tenang tanpa lonjakan drastis)
  const hoverTilt = isHovered ? (seed % 2 === 0 ? 1.2 : -1.2) : 0;
  const totalWindAngle = windAngle * 0.65 + hoverTilt;

  // Buat path kelopak melengkung halus
  const createPetalPath = (width, length, bend) => `
    M 0,0 
    C -${width},-${length * 0.3} -${width * 0.8},-${length * 0.8} ${bend},-${length}
    C ${width * 0.8},-${length * 0.8} ${width},-${length * 0.3} 0,0 Z
  `;

  return (
    <div
      data-flower="true"
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      title={hasSecret ? '✨ Ketuk untuk membuka bisikan rahasia cinta' : undefined}
      className={`absolute select-none pointer-events-auto ${
        hasSecret ? 'cursor-pointer' : 'cursor-default'
      }`}
      style={{
        left: `${flower.xPercent}%`,
        top: `${flower.yPercent}%`,
        transform: `translate(-50%, -50%) scale(${isHovered ? scale * 1.04 : scale})`,
        transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
        zIndex: hasSecret ? 25 : 15,
      }}
    >
      {/* Teks Bisikan Melayang Ke Langit HANYA Saat Bunga Diklik / Diketuk */}
      {floatingText && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap text-amber-200 font-playfair text-xs sm:text-sm italic font-semibold tracking-wider pointer-events-none z-50 drop-shadow-[0_2px_14px_rgba(255,215,0,0.95)] animate-in fade-in slide-in-from-bottom-4 duration-500">
          ✨ &ldquo;{floatingText}&rdquo;
        </div>
      )}

      {/* Lapisan 1: Reaksi Terpaan Angin & Hover Halus Menenangkan */}
      <div
        style={{
          transformOrigin: '50% 92%',
          transform: `rotate(${totalWindAngle}deg) translate3d(${totalWindAngle * 0.3}px, ${Math.abs(totalWindAngle) * 0.15}px, 0)`,
          transition: isHovered
            ? 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)'
            : totalWindAngle !== 0
            ? 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
            : 'transform 1.6s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        {/* Lapisan 2: Ayunan Organik Alami Malam (Idle Organic Sway Layer) */}
        <div
          className={swayClass}
          style={{
            animationDuration: duration,
            animationDelay: delay,
            transformOrigin: '50% 92%',
          }}
        >
          {/* SVG Bunga Lily */}
          <svg
            viewBox="0 0 100 100"
            className="w-24 h-24 sm:w-28 sm:h-28 overflow-visible animate-bloom"
            style={{
              filter: hasSecret
                ? isHovered
                  ? 'drop-shadow(0 0 16px rgba(255, 215, 0, 1)) drop-shadow(0 0 35px rgba(255, 215, 0, 0.7))'
                  : 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.95)) drop-shadow(0 0 28px rgba(255, 215, 0, 0.55))'
                : isHovered
                ? `drop-shadow(0 0 14px ${profile.glow}) drop-shadow(0 0 26px ${profile.outerGlow})`
                : `drop-shadow(0 0 10px ${profile.glow}) drop-shadow(0 0 22px ${profile.outerGlow})`,
              transition: 'filter 0.4s ease',
            }}
          >
            <defs>
              <radialGradient id={gradId} cx="50%" cy="100%" r="100%">
                <stop offset="0%" stopColor={profile.vein} />
                <stop offset="35%" stopColor={profile.inner} />
                <stop offset="85%" stopColor={profile.outer} />
              </radialGradient>
            </defs>

            {/* 6 Kelopak Lily (3 Luar + 3 Dalam) */}
            <g transform="translate(50, 50)">
              {/* 3 Kelopak Luar */}
              {[0, 120, 240].map((angle, idx) => (
                <path
                  key={`outer-${idx}`}
                  d={createPetalPath(15, 45, (idx % 2 === 0 ? 3 : -3))}
                  fill={`url(#${gradId})`}
                  transform={`rotate(${angle})`}
                />
              ))}

              {/* 3 Kelopak Dalam */}
              {[60, 180, 300].map((angle, idx) => (
                <path
                  key={`inner-${idx}`}
                  d={createPetalPath(12, 40, (idx % 2 === 0 ? -2 : 2))}
                  fill={`url(#${gradId})`}
                  transform={`rotate(${angle})`}
                />
              ))}

              {/* Benang Sari (Stamens & Anthers) */}
              {[0, 60, 120, 180, 240, 300].map((angle, idx) => (
                <g key={`stamen-${idx}`} transform={`rotate(${angle})`}>
                  <path
                    d="M 0,0 Q 2,-12 0,-24"
                    stroke="#8bc34a"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <ellipse
                    cx="0"
                    cy="-24"
                    rx="2.5"
                    ry="4"
                    fill="#5d4037"
                    transform="rotate(25 0 -24)"
                  />
                </g>
              ))}

              {/* Pusat Tengah Bunga */}
              <circle cx="0" cy="0" r="4.5" fill="#fff59d" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
});

LilyFlower.displayName = 'LilyFlower';

export default function FlowerRenderer({
  flowers = [],
  onSelectSecret,
  windAngle = 0,
}) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* 3 Gerbera Permanen */}
      {PERMANENT_GERBERAS.map((g) => (
        <GerberaFlower
          key={g.id}
          profileIndex={g.profileIndex}
          xPercent={g.xPercent}
          yPercent={g.yPercent}
          windAngle={windAngle}
        />
      ))}

      {/* Lily yang Ditanam */}
      {flowers.map((f, idx) => (
        <LilyFlower
          key={f.id}
          flower={f}
          index={idx}
          onSelectSecret={onSelectSecret}
          windAngle={windAngle}
        />
      ))}
    </div>
  );
}
