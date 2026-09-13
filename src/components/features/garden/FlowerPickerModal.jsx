import { useId } from 'react';
import ModalWrapper from '../../common/ModalWrapper';
import { FLOWER_TYPES, playBloomChime } from '../../../services/gardenService';
import { Sparkles, Check } from 'lucide-react';

// Preview SVG Mini untuk Mawar Beludru di dalam Modal
function RosePreview() {
  const gradId = useId();
  const coreId = useId();
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-24 h-24 sm:w-28 sm:h-28 lg:w-28 lg:h-28 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 overflow-visible drop-shadow-[0_0_24px_rgba(244,63,94,0.8)]"
    >
      <defs>
        <radialGradient id={gradId} cx="45%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="40%" stopColor="#f43f5e" />
          <stop offset="75%" stopColor="#be123c" />
          <stop offset="100%" stopColor="#4c0519" />
        </radialGradient>
        <radialGradient id={coreId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b0211" />
          <stop offset="70%" stopColor="#881337" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <g transform="translate(50, 50)">
        {/* Tier 1: 5 Kelopak Mawar Luar Merekah Anggun */}
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <path
            key={`rose-out-${i}`}
            d="M 0,0 C -20,-15 -26,-38 -8,-46 C 6,-48 26,-35 13,-15 Z"
            fill={`url(#${gradId})`}
            stroke="#fda4af"
            strokeWidth="0.6"
            strokeOpacity="0.4"
            transform={`rotate(${angle + 8})`}
          />
        ))}
        {/* Tier 2: 5 Kelopak Mawar Tengah Menangkup */}
        {[36, 108, 180, 252, 324].map((angle, i) => (
          <path
            key={`rose-mid-${i}`}
            d="M 0,0 C -15,-12 -20,-30 -5,-36 C 6,-38 20,-28 8,-10 Z"
            fill={`url(#${gradId})`}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.5"
            transform={`rotate(${angle})`}
          />
        ))}
        {/* Tier 3: Kelopak Lingkar Dalam */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <path
            key={`rose-in-${i}`}
            d="M 0,0 C -10,-6 -13,-20 -2,-25 C 5,-26 13,-18 5,-6 Z"
            fill={`url(#${gradId})`}
            transform={`rotate(${angle + 15})`}
          />
        ))}
        {/* Inti Spiral Kuncup Mawar */}
        <circle cx="0" cy="0" r="11" fill={`url(#${coreId})`} />
        <path
          d="M -5,0 C -7,-6 0,-10 5,-6 C 8,-3 6,3 1,6 C -3,8 -7,3 -5,0 Z"
          fill="#fda4af"
          opacity="0.9"
        />
        <circle cx="0" cy="0" r="3.5" fill="#4c0519" />
      </g>
    </svg>
  );
}

// Preview SVG Mini untuk Peony Megah di dalam Modal
function PeonyPreview() {
  const outerGradId = useId();
  const innerGradId = useId();
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-24 h-24 sm:w-28 sm:h-28 lg:w-28 lg:h-28 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 overflow-visible drop-shadow-[0_0_24px_rgba(244,114,182,0.8)]"
    >
      <defs>
        <radialGradient id={outerGradId} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#fff1f2" />
          <stop offset="65%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#fda4af" />
        </radialGradient>
        <radialGradient id={innerGradId} cx="45%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#fff1f2" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#f472b6" stopOpacity="0.75" />
        </radialGradient>
      </defs>
      <g transform="translate(50, 50)">
        {/* Layer Luar: 10 Kelopak Rimbun Scalloped */}
        {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => (
          <path
            key={`peony-out-${i}`}
            d="M 0,0 C -18,-11 -26,-31 -10,-42 C 3,-47 21,-37 13,-16 Z"
            fill={`url(#${outerGradId})`}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.6"
            transform={`rotate(${angle})`}
          />
        ))}
        {/* Layer Tengah: 8 Kelopak Ruffled Bertumpuk */}
        {[18, 63, 108, 153, 198, 243, 288, 333].map((angle, i) => (
          <path
            key={`peony-mid-${i}`}
            d="M 0,0 C -14,-9 -21,-25 -6,-32 C 6,-35 16,-25 8,-11 Z"
            fill={`url(#${innerGradId})`}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="0.6"
            transform={`rotate(${angle})`}
          />
        ))}
        {/* Layer Inti Berombak */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <path
            key={`peony-in-${i}`}
            d="M 0,0 C -8,-6 -11,-17 -2,-21 C 5,-22 11,-16 5,-6 Z"
            fill={`url(#${innerGradId})`}
            transform={`rotate(${angle + 8})`}
          />
        ))}
        {/* Benang Sari Emas Peony */}
        {Array.from({ length: 16 }).map((_, i) => {
          const rad = (i * 22.5 * Math.PI) / 180;
          return (
            <g key={`peony-stamen-${i}`}>
              <line
                x1="0"
                y1="0"
                x2={Math.cos(rad) * 9}
                y2={Math.sin(rad) * 9}
                stroke="#fde047"
                strokeWidth="1"
              />
              <circle
                cx={Math.cos(rad) * 10}
                cy={Math.sin(rad) * 10}
                r="1.1"
                fill="#facc15"
              />
            </g>
          );
        })}
        <circle cx="0" cy="0" r="3.2" fill="#be185d" />
      </g>
    </svg>
  );
}

// Preview SVG Mini untuk Kamboja di dalam Modal
function FrangipaniPreview() {
  const gradId = useId();
  const coreId = useId();
  return (
    <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 lg:w-28 lg:h-28 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 overflow-visible drop-shadow-[0_0_22px_rgba(255,215,0,0.65)]">
      <defs>
        <radialGradient id={gradId} cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#fffde7" />
          <stop offset="100%" stopColor="#fff59d" />
        </radialGradient>
        <radialGradient id={coreId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e65100" />
          <stop offset="45%" stopColor="#ffb300" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      {/* 5 Kelopak Kamboja Berputar Tumpang Tindih */}
      <g transform="translate(50, 50)">
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <path
            key={i}
            d="M 0,0 C 8,-12 28,-22 28,-36 C 28,-48 10,-52 -2,-48 C -14,-44 -20,-28 -8,-14 Z"
            fill={`url(#${gradId})`}
            stroke="rgba(255, 238, 88, 0.4)"
            strokeWidth="0.8"
            transform={`rotate(${angle})`}
          />
        ))}
        {/* Inti Kuning Oranye Hangat */}
        <circle cx="0" cy="0" r="16" fill={`url(#${coreId})`} opacity="0.95" />
        <circle cx="0" cy="0" r="3.5" fill="#ff6f00" />
      </g>
    </svg>
  );
}

// Preview SVG Mini untuk Silk Blossom di dalam Modal
function SilkBlossomPreview() {
  const gradId = useId();
  const outerGradId = useId();
  return (
    <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 lg:w-28 lg:h-28 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 overflow-visible drop-shadow-[0_0_24px_rgba(244,63,94,0.7)]">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe4e6" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#fda4af" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#fb7185" stopOpacity="0.6" />
        </radialGradient>
        <radialGradient id={outerGradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff1f2" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#f43f5e" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#e11d48" stopOpacity="0.45" />
        </radialGradient>
      </defs>
      <g transform="translate(50, 50)">
        {/* Layer Kelopak Luar Bergelombang Halus */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <path
            key={`outer-${i}`}
            d="M 0,0 C -18,-15 -24,-35 -8,-45 C 8,-50 26,-36 12,-18 Z"
            fill={`url(#${outerGradId})`}
            transform={`rotate(${angle + 12})`}
          />
        ))}
        {/* Layer Kelopak Dalam Transparan Sutra */}
        {[20, 80, 140, 200, 260, 320].map((angle, i) => (
          <path
            key={`inner-${i}`}
            d="M 0,0 C -12,-10 -18,-26 -4,-34 C 8,-38 18,-26 8,-12 Z"
            fill={`url(#${gradId})`}
            transform={`rotate(${angle})`}
          />
        ))}
        {/* Benang Sari Memancar */}
        {Array.from({ length: 14 }).map((_, i) => (
          <line
            key={`stamen-${i}`}
            x1="0"
            y1="0"
            x2={Math.cos((i * 25.7 * Math.PI) / 180) * 14}
            y2={Math.sin((i * 25.7 * Math.PI) / 180) * 14}
            stroke="#fb7185"
            strokeWidth="1.2"
          />
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <circle
            key={`dot-${i}`}
            cx={Math.cos((i * 25.7 * Math.PI) / 180) * 15}
            cy={Math.sin((i * 25.7 * Math.PI) / 180) * 15}
            r="1.2"
            fill="#ffe4e6"
          />
        ))}
        <circle cx="0" cy="0" r="4" fill="#881337" />
      </g>
    </svg>
  );
}

// Preview SVG Mini untuk Realistic Lily di dalam Modal
function RealisticLilyPreview() {
  const gradId = useId();
  return (
    <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 lg:w-28 lg:h-28 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 overflow-visible drop-shadow-[0_0_24px_rgba(255,255,255,0.75)]">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="100%" r="100%">
          <stop offset="0%" stopColor="#a8e6cf" />
          <stop offset="25%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </radialGradient>
      </defs>
      <g transform="translate(50, 50)">
        {/* 3 Kelopak Luar dengan Ujung Recurved */}
        {[0, 120, 240].map((angle, i) => (
          <path
            key={`outer-${i}`}
            d="M 0,0 C -12,-15 -18,-35 -4,-46 C 4,-46 16,-34 6,-14 Z"
            fill={`url(#${gradId})`}
            stroke="rgba(168, 230, 207, 0.4)"
            strokeWidth="0.8"
            transform={`rotate(${angle})`}
          />
        ))}
        {/* 3 Kelopak Dalam Bergelombang Lebar */}
        {[60, 180, 300].map((angle, i) => (
          <path
            key={`inner-${i}`}
            d="M 0,0 C -16,-14 -22,-32 -2,-44 C 12,-44 20,-30 8,-12 Z"
            fill={`url(#${gradId})`}
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="0.8"
            transform={`rotate(${angle})`}
          />
        ))}
        {/* Bintik-bintik Anggun di Pangkal Kelopak */}
        {[-8, -4, 0, 4, 8].map((offset, i) => (
          <circle key={`speckle-${i}`} cx={offset} cy={-16 - (i % 3) * 3} r="0.9" fill="#65a30d" opacity="0.8" />
        ))}
        {/* Benang Sari & Anthers Oranye Cokelat */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <g key={`stamen-${i}`} transform={`rotate(${angle})`}>
            <path d="M 0,0 Q 3,-14 0,-26" stroke="#86efac" strokeWidth="1.2" fill="none" />
            <ellipse cx="0" cy="-26" rx="2" ry="4.5" fill="#c2410c" transform="rotate(28 0 -26)" />
          </g>
        ))}
        <circle cx="0" cy="0" r="4" fill="#a8e6cf" />
      </g>
    </svg>
  );
}

export default function FlowerPickerModal({
  isOpen,
  onClose,
  selectedType = 'lily',
  onSelectType,
}) {
  const handleSelect = (flowerId) => {
    if (onSelectType) {
      onSelectType(flowerId);
    }
    playBloomChime();
    if (onClose) {
      onClose();
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Pilih Benih Bunga Abadi 🌸"
      maxWidth="max-w-md sm:max-w-3xl lg:max-w-5xl xl:max-w-7xl"
    >
      <div className="space-y-4 sm:space-y-5 py-1 select-none">
        {/* Subtitle Deskripsi Puitis */}
        <div className="text-center space-y-1 pb-1 max-w-xl mx-auto">
          <p className="text-xs sm:text-sm text-neutral-200 font-playfair italic">
            &ldquo;Tiap bunga membawa doa dan pesona cinta yang tak akan pernah layu...&rdquo;
          </p>
          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-pink-300/90 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            Dekatkan kursor untuk melihat nama & mekar
          </span>
        </div>

        {/* 5 Panggung Bunga Melayang (Responsive: 1 Col di HP, 2-3 di Tablet/Laptop, 5 Kolom di PC Desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4 xl:gap-3.5 pt-1">
          {FLOWER_TYPES.map((type, idx) => {
            const isSelected = selectedType === type.id;
            const spinClass = [
              'animate-flower-spin-1',
              'animate-flower-spin-2',
              'animate-flower-spin-3',
            ][idx % 3];

            return (
              <div
                key={type.id}
                onClick={() => handleSelect(type.id)}
                className={`group relative rounded-2xl sm:rounded-3xl p-4 sm:p-5 xl:p-3.5 2xl:p-4 border transition-all duration-500 cursor-pointer overflow-hidden flex flex-col justify-between items-center text-center ${
                  isSelected
                    ? 'bg-gradient-to-b from-pink-500/25 via-purple-500/15 to-white/[0.05] border-pink-400/70 shadow-[0_0_35px_rgba(244,114,182,0.35)] ring-2 ring-pink-400/40'
                    : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-pink-400/50 hover:shadow-[0_0_30px_rgba(244,114,182,0.25)]'
                }`}
              >
                {/* Badge Aktif */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg text-xs animate-in zoom-in-50 duration-200">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                )}

                {/* Aura Glow di Belakang Bunga */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-28 h-28 lg:w-36 lg:h-36 rounded-full bg-gradient-to-tr from-pink-500/25 to-amber-500/25 blur-2xl group-hover:scale-150 group-hover:opacity-100 opacity-40 transition-all duration-700 pointer-events-none" />

                {/* Wadah Bunga: Terayun & Berputar, Mengembang saat Hover */}
                <div className="h-28 w-28 sm:h-32 sm:w-32 lg:h-36 lg:w-36 xl:h-28 xl:w-28 2xl:h-32 2xl:w-32 flex items-center justify-center relative my-1.5 sm:my-2">
                  <div className={`transition-transform duration-700 ease-out group-hover:scale-120 ${spinClass}`}>
                    {type.id === 'rose' && <RosePreview />}
                    {type.id === 'peony' && <PeonyPreview />}
                    {type.id === 'frangipani' && <FrangipaniPreview />}
                    {type.id === 'blossom' && <SilkBlossomPreview />}
                    {type.id === 'lily' && <RealisticLilyPreview />}
                  </div>
                </div>

                {/* Nama & Filosofi Bunga */}
                <div className="space-y-1.5 pt-1 relative z-10 w-full flex-1 flex flex-col justify-center">
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <span className="text-base sm:text-lg">{type.icon}</span>
                      <h4 className="!font-sans font-bold text-sm sm:text-base xl:text-[13.5px] 2xl:text-base text-white group-hover:text-pink-200 transition-colors whitespace-nowrap">
                        {type.name}
                      </h4>
                    </div>
                    <span className="text-[10px] xl:text-[9.5px] text-pink-300/70 font-mono tracking-wider block">
                      {type.botanicalName}
                    </span>
                  </div>

                  <p className="text-xs xl:text-[11.5px] text-amber-200 font-playfair italic font-semibold">
                    &ldquo;{type.quote}&rdquo;
                  </p>

                  <p className="text-[11px] xl:text-[10.5px] text-neutral-300/85 leading-relaxed px-0.5 max-w-xs mx-auto">
                    {type.description}
                  </p>
                </div>

                {/* Tombol Pilih */}
                <button
                  type="button"
                  className={`mt-3 w-full py-2 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md'
                      : 'bg-white/10 group-hover:bg-pink-500/30 text-neutral-200 group-hover:text-white border border-white/10 group-hover:border-pink-400/40'
                  }`}
                >
                  {isSelected ? 'Benih Aktif ✓' : 'Pilih Benih Ini'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Info Tambahan di Footer Modal */}
        <p className="text-center text-[11px] text-neutral-400 pt-1">
          💡 Setelah memilih, modal akan otomatis tertutup dan kamu bisa langsung mengetuk di taman untuk menanam bunga ini.
        </p>
      </div>
    </ModalWrapper>
  );
}

