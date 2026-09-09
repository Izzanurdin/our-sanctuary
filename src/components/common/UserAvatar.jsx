import { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';

export default function UserAvatar({
  profile,
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
}) {
  const [failedUrls, setFailedUrls] = useState({});

  const primaryUrl = profile?.avatarUrl;
  const fallbackUrl = profile?.avatarFallbackUrl;

  const currentUrl =
    primaryUrl && !failedUrls[primaryUrl]
      ? primaryUrl
      : fallbackUrl && !failedUrls[fallbackUrl]
      ? fallbackUrl
      : null;

  const handleError = () => {
    if (currentUrl) {
      setFailedUrls((prev) => ({ ...prev, [currentUrl]: true }));
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6 rounded-full text-xs',
    md: 'w-10 h-10 rounded-xl text-sm',
    lg: 'w-14 h-14 rounded-2xl text-base',
  }[size] || 'w-10 h-10 rounded-xl';

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  }[size] || 'w-5 h-5';

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.3)] bg-gradient-to-br ${
        profile?.avatarBg || 'from-pink-500/30 to-rose-500/20'
      } ${sizeClasses} ${className}`}
    >
      {currentUrl ? (
        <img
          key={currentUrl}
          src={currentUrl}
          alt={profile?.name || 'Avatar'}
          onError={handleError}
          className="w-full h-full object-cover object-center"
        />
      ) : profile?.role === 'girlfriend' ? (
        <Heart className={`${iconSizes} text-pink-300 fill-pink-400/40 animate-pulse`} />
      ) : (
        <Sparkles className={`${iconSizes} text-rose-300`} />
      )}
    </div>
  );
}
