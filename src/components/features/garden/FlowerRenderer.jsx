import { useState, useId, memo } from 'react';
import {
  GERBERA_PROFILES,
  PERMANENT_GERBERAS,
  LILY_PROFILES,
  FRANGIPANI_PROFILES,
  BLOSSOM_PROFILES,
} from '../../../services/gardenService';

// ============================================================================
// 1. KOMPONEN BUNGA GERBERA PERMANEN (3 Penjaga Taman)
// ============================================================================
const GerberaFlower = memo(({ profileIndex, xPercent, yPercent, windAngle = 0 }) => {
  const profile = GERBERA_PROFILES[profileIndex] || GERBERA_PROFILES[0];
  const gradId = useId();
  const [isHovered, setIsHovered] = useState(false);

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
      <div
        style={{
          transformOrigin: '50% 92%',
          transform: `rotate(${windAngle * 0.35}deg) translate3d(${windAngle * 0.25}px, ${Math.abs(windAngle) * 0.12}px, 0)`,
          transition: windAngle !== 0
            ? 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
            : 'transform 1.6s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
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
            <circle cx="50" cy="50" r="12" fill="#21100b" stroke="#4e342e" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
});

GerberaFlower.displayName = 'GerberaFlower';

// ============================================================================
// 2. KOMPONEN BUNGA LILY REALISTIS (Natural, Wavy Petals, Freckles & Stamens)
// ============================================================================
const RealisticLilySVG = ({ profile, gradId }) => {
  return (
    <svg
      viewBox="0 0 120 120"
      className="w-24 h-24 sm:w-28 sm:h-28 overflow-visible animate-bloom"
      style={{
        filter: `drop-shadow(0 0 14px ${profile.glow}) drop-shadow(0 0 28px ${profile.outerGlow})`,
        transition: 'filter 0.4s ease',
      }}
    >
      <defs>
        {/* Gradasi Kelopak dari Throat -> Inner -> Outer */}
        <radialGradient id={gradId} cx="50%" cy="100%" r="100%">
          <stop offset="0%" stopColor={profile.throat || '#a8e6cf'} />
          <stop offset="25%" stopColor={profile.inner || '#ffffff'} />
          <stop offset="65%" stopColor={profile.mid || '#f8fafc'} />
          <stop offset="100%" stopColor={profile.outer || '#f1f5f9'} />
        </radialGradient>
      </defs>

      <g transform="translate(60, 60)">
        {/* 3 Kelopak Luar (Outer Sepals) dengan Lengkung Recurved Organik */}
        {[0, 120, 240].map((angle, idx) => (
          <g key={`outer-petal-${idx}`} transform={`rotate(${angle})`}>
            {/* Kelopak Luar */}
            <path
              d="M 0,0 C -14,-16 -22,-38 -6,-52 C 2,-55 18,-42 8,-18 Z"
              fill={`url(#${gradId})`}
              stroke={profile.vein || 'rgba(255,255,255,0.4)'}
              strokeWidth="0.6"
            />
            {/* Urat Tengah (Midrib Vein) */}
            <path
              d="M 0,-2 Q 1,-24 0,-48"
              stroke={profile.vein || 'rgba(0,0,0,0.15)'}
              strokeWidth="1.2"
              fill="none"
              opacity="0.75"
            />
          </g>
        ))}

        {/* 3 Kelopak Dalam (Inner Petals) dengan Lekukan Ruffled Bergelombang Lebar */}
        {[60, 180, 300].map((angle, idx) => (
          <g key={`inner-petal-${idx}`} transform={`rotate(${angle})`}>
            {/* Kelopak Dalam Bergelombang */}
            <path
              d="M 0,0 C -20,-16 -26,-36 -4,-50 C 14,-50 24,-34 10,-14 Z"
              fill={`url(#${gradId})`}
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="0.8"
            />
            {/* Urat Tengah Kelopak Dalam */}
            <path
              d="M 0,-2 Q -1,-22 0,-46"
              stroke={profile.vein || 'rgba(0,0,0,0.2)'}
              strokeWidth="1.4"
              fill="none"
              opacity="0.8"
            />
            {/* Bintik-bintik Freckles Anggun khas Lily Nyata */}
            {[-6, -3, 0, 3, 6].map((xOffset, sIdx) => (
              <circle
                key={`speckle-${idx}-${sIdx}`}
                cx={xOffset + (sIdx % 2 === 0 ? 1 : -1)}
                cy={-18 - (sIdx % 3) * 4}
                r="1.1"
                fill={profile.speckles || '#7c2d12'}
                opacity="0.85"
              />
            ))}
          </g>
        ))}

        {/* 6 Benang Sari (Green Filaments) & Kepala Serbuk Sari (Anthers Oranye Cokelat) */}
        {[0, 60, 120, 180, 240, 300].map((angle, idx) => (
          <g key={`stamen-${idx}`} transform={`rotate(${angle})`}>
            {/* Tangkai Sari Melengkung */}
            <path
              d="M 0,0 Q 3.5,-16 0,-28"
              stroke="#86efac"
              strokeWidth="1.3"
              fill="none"
            />
            {/* Kepala Serbuk Sari (Anther) Horisontal Berbobot */}
            <ellipse
              cx="0"
              cy="-28"
              rx="2.4"
              ry="5.2"
              fill={profile.anthers || '#c2410c'}
              stroke="#431407"
              strokeWidth="0.5"
              transform="rotate(32 0 -28)"
            />
          </g>
        ))}

        {/* Putik Tengah (Pistil / Stigma) */}
        <circle cx="0" cy="0" r="4.5" fill={profile.throat || '#a8e6cf'} stroke="#15803d" strokeWidth="0.6" />
      </g>
    </svg>
  );
};

// ============================================================================
// 3. KOMPONEN BUNGA KAMBOJA (FRANGIPANI - 5 Kelopak Spiral Beludru)
// ============================================================================
const FrangipaniSVG = ({ profile, gradId, coreId }) => {
  return (
    <svg
      viewBox="0 0 120 120"
      className="w-24 h-24 sm:w-28 sm:h-28 overflow-visible animate-bloom"
      style={{
        filter: `drop-shadow(0 0 15px ${profile.glow}) drop-shadow(0 0 28px ${profile.outerGlow})`,
        transition: 'filter 0.4s ease',
      }}
    >
      <defs>
        {/* Gradasi Kelopak Kamboja Lembut */}
        <radialGradient id={gradId} cx="42%" cy="28%" r="72%">
          <stop offset="0%" stopColor={profile.petalBase || '#ffffff'} />
          <stop offset="55%" stopColor={profile.petalMid || '#fffde7'} />
          <stop offset="100%" stopColor={profile.petalTip || '#fff9c4'} />
        </radialGradient>
        {/* Gradasi Inti Kuning-Oranye Hangat */}
        <radialGradient id={coreId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={profile.centerCore || '#ff6f00'} />
          <stop offset="45%" stopColor={profile.centerGlow || '#ffb300'} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <g transform="translate(60, 60)">
        {/* 5 Kelopak Kamboja Berputar Tumpang Tindih (Pinwheel Spreading) */}
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <path
            key={`frangipani-petal-${idx}`}
            d="M 0,0 C 10,-14 34,-26 34,-42 C 34,-56 12,-60 -2,-56 C -16,-50 -24,-32 -10,-16 Z"
            fill={`url(#${gradId})`}
            stroke="rgba(255, 238, 88, 0.4)"
            strokeWidth="0.8"
            transform={`rotate(${angle})`}
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
            }}
          />
        ))}

        {/* Inti Bunga Emas Kamboja yang Meradiasi */}
        <circle cx="0" cy="0" r="18" fill={`url(#${coreId})`} opacity="0.95" />
        <circle cx="0" cy="0" r="4" fill={profile.centerCore || '#ff6f00'} />
      </g>
    </svg>
  );
};

// ============================================================================
// 4. KOMPONEN BUNGA SAKURA SUTRA (SILK BLOSSOM - Translucent Chiffon Petals)
// ============================================================================
const SilkBlossomSVG = ({ profile, outerGradId, innerGradId }) => {
  return (
    <svg
      viewBox="0 0 120 120"
      className="w-24 h-24 sm:w-28 sm:h-28 overflow-visible animate-bloom"
      style={{
        filter: `drop-shadow(0 0 16px ${profile.glow}) drop-shadow(0 0 30px ${profile.outerGlow})`,
        transition: 'filter 0.4s ease',
      }}
    >
      <defs>
        {/* Kelopak Luar Tipis */}
        <radialGradient id={outerGradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={profile.inner || '#fff1f2'} stopOpacity="0.85" />
          <stop offset="70%" stopColor={profile.mid || '#f43f5e'} stopOpacity="0.65" />
          <stop offset="100%" stopColor={profile.outer || '#e11d48'} stopOpacity="0.45" />
        </radialGradient>
        {/* Kelopak Dalam Lebih Pekat */}
        <radialGradient id={innerGradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={profile.inner || '#ffe4e6'} stopOpacity="0.95" />
          <stop offset="60%" stopColor={profile.outer || '#fda4af'} stopOpacity="0.8" />
          <stop offset="100%" stopColor={profile.mid || '#fb7185'} stopOpacity="0.65" />
        </radialGradient>
      </defs>

      <g transform="translate(60, 60)">
        {/* Tier 1: 8 Kelopak Luar Bergelombang Halus */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
          <path
            key={`blossom-outer-${idx}`}
            d="M 0,0 C -22,-18 -30,-42 -10,-54 C 10,-60 32,-44 14,-22 Z"
            fill={`url(#${outerGradId})`}
            transform={`rotate(${angle + 14})`}
          />
        ))}

        {/* Tier 2: 6 Kelopak Tengah Transparan Sutra */}
        {[20, 80, 140, 200, 260, 320].map((angle, idx) => (
          <path
            key={`blossom-inner-${idx}`}
            d="M 0,0 C -15,-12 -22,-32 -5,-42 C 10,-46 22,-32 10,-15 Z"
            fill={`url(#${innerGradId})`}
            transform={`rotate(${angle})`}
          />
        ))}

        {/* 16 Tangkai Benang Sari Halus Memancar */}
        {Array.from({ length: 16 }).map((_, idx) => {
          const rad = (idx * 22.5 * Math.PI) / 180;
          return (
            <g key={`blossom-stamen-${idx}`}>
              <line
                x1="0"
                y1="0"
                x2={Math.cos(rad) * 16}
                y2={Math.sin(rad) * 16}
                stroke={profile.stamen || '#fb7185'}
                strokeWidth="1.2"
                opacity="0.9"
              />
              <circle
                cx={Math.cos(rad) * 17.5}
                cy={Math.sin(rad) * 17.5}
                r="1.4"
                fill={profile.inner || '#ffe4e6'}
              />
            </g>
          );
        })}

        {/* Inti Pusat Mahkota */}
        <circle cx="0" cy="0" r="5" fill={profile.core || '#881337'} />
      </g>
    </svg>
  );
};

// ============================================================================
// 5. MASTER FLOWER WRAPPER (Mendukung Ketiga Jenis Bunga Secara Terpadu)
// ============================================================================
const MasterPlantedFlower = memo(({ flower, onSelectSecret, windAngle = 0, index = 0 }) => {
  const gradId1 = useId();
  const gradId2 = useId();
  const [floatingText, setFloatingText] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const hasSecret = Boolean(flower.secretMessage);
  const scale = flower.scale || 0.85;

  // Hasilkan ritme ayunan unik dari ID bunga
  const seed = (index * 7 + (flower.id ? flower.id.charCodeAt(flower.id.length - 1) : 3)) % 100;
  const swayClass = seed % 3 === 0 ? 'animate-sway-1' : seed % 3 === 1 ? 'animate-sway-2' : 'animate-sway-3';
  const duration = (4.2 + (seed % 20) * 0.14).toFixed(2) + 's';
  const delay = (-((seed % 40) * 0.14)).toFixed(2) + 's';

  const handlePointerEnter = (e) => {
    if (e.pointerType === 'mouse') setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setIsHovered(true);
    setTimeout(() => setIsHovered(false), 700);

    if (hasSecret) {
      setFloatingText(flower.secretMessage);
      setTimeout(() => setFloatingText(null), 3800);
      if (onSelectSecret) onSelectSecret(flower);
    }
  };

  const hoverTilt = isHovered ? (seed % 2 === 0 ? 1.2 : -1.2) : 0;
  const totalWindAngle = windAngle * 0.65 + hoverTilt;

  // Render spesifik sesuai jenis bunga
  const flowerType = flower.type || 'lily';

  const renderFlowerSVG = () => {
    if (flowerType === 'frangipani') {
      const profile = FRANGIPANI_PROFILES[flower.profileIndex % FRANGIPANI_PROFILES.length] || FRANGIPANI_PROFILES[0];
      return <FrangipaniSVG profile={profile} gradId={gradId1} coreId={gradId2} />;
    }

    if (flowerType === 'blossom') {
      const profile = BLOSSOM_PROFILES[flower.profileIndex % BLOSSOM_PROFILES.length] || BLOSSOM_PROFILES[0];
      return <SilkBlossomSVG profile={profile} outerGradId={gradId1} innerGradId={gradId2} />;
    }

    // Default: Realistic Lily
    const profile = LILY_PROFILES[flower.profileIndex % LILY_PROFILES.length] || LILY_PROFILES[0];
    return <RealisticLilySVG profile={profile} gradId={gradId1} />;
  };

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
        transform: `translate(-50%, -50%) scale(${isHovered ? scale * 1.05 : scale})`,
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
          {/* Aura Emas Khusus Bunga Berisi Pesan Rahasia */}
          {hasSecret && (
            <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl scale-125 animate-pulse pointer-events-none" />
          )}

          {renderFlowerSVG()}
        </div>
      </div>
    </div>
  );
});

MasterPlantedFlower.displayName = 'MasterPlantedFlower';

// ============================================================================
// 6. EXPORT DEFAULT FLOWER RENDERER
// ============================================================================
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

      {/* Seluruh Bunga yang Ditanam (Lily, Frangipani, Silk Blossom) */}
      {flowers.map((f, idx) => (
        <MasterPlantedFlower
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
