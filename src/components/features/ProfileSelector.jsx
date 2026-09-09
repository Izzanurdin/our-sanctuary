import GlassCard from '../common/GlassCard';
import UserAvatar from '../common/UserAvatar';
import { Sparkles, ArrowRight } from 'lucide-react';
import { PROFILES } from '../../config/profiles';

export default function ProfileSelector({ onSelectProfile, className = '' }) {
  return (
    <div className={`w-full max-w-sm mx-auto space-y-4 select-none ${className}`}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs text-pink-300 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          PIN Terverifikasi
        </div>
        <h2 className="text-xl font-semibold text-pink-100 tracking-wide">
          Siapa yang Membuka?
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Pilih profilmu untuk memulai sesi privat kita
        </p>
      </div>

      <div className="space-y-3.5">
        {PROFILES.map((profile) => (
          <GlassCard
            key={profile.id}
            onClick={() => onSelectProfile(profile)}
            className={`group transition-all duration-300 ${profile.borderColor} hover:bg-white/[0.07] hover:scale-[1.01]`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                {/* Photo or Fallback Icon Avatar */}
                <UserAvatar
                  profile={profile}
                  size="lg"
                  className="group-hover:scale-105 transition-transform duration-300"
                />

                {/* Profile Details */}
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-pink-100 group-hover:text-pink-200">
                      {profile.name}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-pink-200/80 font-medium">
                      {profile.tag}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                    {profile.description}
                  </p>
                </div>
              </div>

              {/* Arrow Action */}
              <div className="p-2 rounded-xl bg-white/[0.04] text-neutral-400 group-hover:text-pink-300 group-hover:translate-x-1 transition-all duration-200">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
