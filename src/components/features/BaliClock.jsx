import { useState, useEffect } from 'react';
import { MapPin, Moon, Sun, Sunset } from 'lucide-react';

export default function BaliClock({ className = '' }) {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format jam WITA (Asia/Makassar)
  const timeString = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Makassar',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(currentTime);

  // Format tanggal WITA
  const dateString = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Makassar',
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(currentTime);

  // Ambil jam saat ini di Bali untuk menentukan ikon suasana (Pagi, Sore, Malam)
  const baliHour = parseInt(
    new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Makassar',
      hour: 'numeric',
      hour12: false,
    }).format(currentTime),
    10
  );

  const getTimeTheme = () => {
    if (baliHour >= 6 && baliHour < 17) {
      return {
        icon: Sun,
        iconColor: 'text-amber-300',
        label: 'Siang',
      };
    }
    if (baliHour >= 17 && baliHour < 19) {
      return {
        icon: Sunset,
        iconColor: 'text-rose-400',
        label: 'Senja',
      };
    }
    return {
      icon: Moon,
      iconColor: 'text-pink-300',
      label: 'Malam',
    };
  };

  const theme = getTimeTheme();
  const TimeIcon = theme.icon;

  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-pink-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-300 select-none group ${className}`}
    >
      {/* Dynamic Ambiance Icon */}
      <div className="flex items-center gap-1 text-pink-300/90">
        <TimeIcon className={`w-3.5 h-3.5 ${theme.iconColor} transition-transform group-hover:scale-110`} />
      </div>

      {/* Clock Display */}
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-xs font-semibold tracking-wider text-pink-100">
          {timeString}
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-pink-500/15 border border-pink-500/30 text-pink-300">
          WITA
        </span>
      </div>

      {/* Subtle Dot Separator */}
      <span className="w-1 h-1 rounded-full bg-white/20" />

      {/* Location / Date info */}
      <div className="flex items-center gap-1 text-[11px] text-neutral-400">
        <MapPin className="w-3 h-3 text-rose-400/80 -mr-0.5" />
        <span>Bali</span>
        <span className="text-neutral-500">•</span>
        <span className="text-neutral-300 text-[10px]">{dateString}</span>
      </div>
    </div>
  );
}
