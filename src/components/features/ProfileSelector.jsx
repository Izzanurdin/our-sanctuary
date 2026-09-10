import { PROFILES } from '../../config/profiles';

export default function ProfileSelector({ onSelectProfile, className = '' }) {
  return (
    <div className={`w-full max-w-2xl mx-auto select-none py-6 ${className}`}>
      {/* Netflix Title Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-tight font-sans">
          Who's there?
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2.5 font-normal">
          Pilih profil untuk masuk ke Our Sanctuary
        </p>
      </div>

      {/* Netflix Profile Avatar Grid */}
      <div className="flex items-center justify-center gap-6 sm:gap-10 md:gap-14 flex-wrap">
        {PROFILES.map((profile) => (
          <button
            key={profile.id}
            type="button"
            onClick={() => onSelectProfile(profile)}
            className="group flex flex-col items-center cursor-pointer focus:outline-none active:scale-95 transition-transform duration-150"
          >
            {/* Square Avatar Box with Netflix Hover Border & Zoom */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-md overflow-hidden border-2 border-transparent group-hover:border-white transition-all duration-200 shadow-[0_4px_24px_rgba(0,0,0,0.6)] bg-neutral-900 relative">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                onError={(e) => {
                  if (profile.avatarFallbackUrl && e.currentTarget.src !== profile.avatarFallbackUrl) {
                    e.currentTarget.src = profile.avatarFallbackUrl;
                  }
                }}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Profile Name Under Avatar */}
            <span className="text-neutral-400 group-hover:text-white text-base sm:text-lg md:text-xl font-normal mt-3 sm:mt-4 tracking-wide transition-colors">
              {profile.name}
            </span>

            {/* Role / Tag */}
            <span className="text-[11px] sm:text-xs text-neutral-500 group-hover:text-neutral-400 transition-colors mt-0.5">
              {profile.tag}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

