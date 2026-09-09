import { useState, useEffect, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import GardenCanvas from '../components/features/garden/GardenCanvas';
import FlowerRenderer from '../components/features/garden/FlowerRenderer';
import PlantSecretModal from '../components/features/garden/PlantSecretModal';
import SecretWhisperModal from '../components/features/garden/SecretWhisperModal';
import SavePictureModal from '../components/features/garden/SavePictureModal';
import ResetGardenModal from '../components/features/garden/ResetGardenModal';
import {
  getGardenFlowers,
  addGardenFlower,
  resetGardenFlowers,
  playBloomChime,
  playWindBreezeSound,
  playSecretFoundSound,
  isGardenAudioEnabled,
  setGardenAudioEnabled,
} from '../services/gardenService';
import {
  ChevronLeft,
  Camera,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
} from 'lucide-react';

export default function GardenView({ onBack, user }) {
  const [flowers, setFlowers] = useState(getGardenFlowers);
  const [isPlantSecretOpen, setIsPlantSecretOpen] = useState(false);
  const [targetCoords, setTargetCoords] = useState(null);
  const [activeSecretFlower, setActiveSecretFlower] = useState(null);
  const [isSavePictureOpen, setIsSavePictureOpen] = useState(false);
  const [capturedImageUrl, setCapturedImageUrl] = useState(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(isGardenAudioEnabled);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [windAngle, setWindAngle] = useState(0);

  const canvasRef = useRef(null);
  const gardenContainerRef = useRef(null);
  const pressTimerRef = useRef(null);
  const isPressingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0, time: 0 });
  const windResetTimerRef = useRef(null);
  const lastWindSoundTimeRef = useRef(0);

  // Sembunyikan petunjuk setelah 7 detik
  useEffect(() => {
    const timer = setTimeout(() => {
      setHintVisible(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  // Toggle Audio Soundscape
  const handleToggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    setGardenAudioEnabled(next);
  };

  // Toggle Fullscreen Mode
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Tanam bunga biasa saat Single Tap
  const plantRegularLily = useCallback(
    (clientX, clientY) => {
      const xPercent = (clientX / window.innerWidth) * 100;
      const yPercent = (clientY / window.innerHeight) * 100;

      // Cek jarak aman dari 3 gerbera
      const tooClose = [
        { x: 50, y: 15 },
        { x: 15, y: 82 },
        { x: 85, y: 82 },
      ].some((g) => {
        const dist = Math.hypot(xPercent - g.x, yPercent - g.y);
        return dist < 8;
      });

      if (tooClose) return;

      const randomProfileIndex = Math.floor(Math.random() * 10);
      const randomScale = parseFloat((Math.random() * 0.4 + 0.7).toFixed(2));

      const newFlower = {
        id: `lily_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        type: 'lily',
        xPercent: parseFloat(xPercent.toFixed(2)),
        yPercent: parseFloat(yPercent.toFixed(2)),
        scale: randomScale,
        profileIndex: randomProfileIndex,
        secretMessage: '',
        plantedBy: {
          id: user?.id || 'user_sayang',
          name: user?.name || 'Sayang',
          role: user?.role || 'girlfriend',
        },
        plantedAt: new Date().toISOString(),
      };

      const updated = addGardenFlower(newFlower);
      setFlowers(updated);
      playBloomChime();
    },
    [user]
  );

  // Handle pointer down (mulai deteksi tap atau long-press)
  const handlePointerDown = (e) => {
    // Abaikan jika klik tombol UI, modal, atau bunga yang sudah ada di taman
    if (
      e.target.closest('button') ||
      e.target.closest('.modal-content') ||
      e.target.closest('[data-flower="true"]')
    ) {
      isPressingRef.current = false;
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }
      return;
    }

    isPressingRef.current = true;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    lastPosRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };

    pressTimerRef.current = setTimeout(() => {
      if (isPressingRef.current) {
        isPressingRef.current = false;
        // Trigger modal bisikan rahasia
        const xPercent = (startPosRef.current.x / window.innerWidth) * 100;
        const yPercent = (startPosRef.current.y / window.innerHeight) * 100;
        setTargetCoords({
          xPercent: parseFloat(xPercent.toFixed(2)),
          yPercent: parseFloat(yPercent.toFixed(2)),
        });
        setIsPlantSecretOpen(true);
      }
    }, 900);
  };

  // Handle pointer move (usapan angin & jejak bintang)
  const handlePointerMove = (e) => {
    const moveDist = Math.hypot(
      e.clientX - startPosRef.current.x,
      e.clientY - startPosRef.current.y
    );

    // Jika jari / kursor bergeser > 15px, batalkan penanaman tap/long-press
    if (moveDist > 15 && pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
      isPressingRef.current = false;
    }

    // Spawn jejak bintang di canvas
    if (Math.random() > 0.6) {
      canvasRef.current?.spawnStar(e.clientX, e.clientY);
    }

    // Hitung kecepatan usapan angin (dengan threshold yang tenang & tidak brutal)
    const now = Date.now();
    const dt = now - lastPosRef.current.time;
    if (dt > 25) {
      const dx = e.clientX - lastPosRef.current.x;
      const speed = dx / dt; // px per ms

      // Sensitivitas ideal: 0.32 untuk mouse desktop, 0.42 untuk usapan sentuh HP
      const threshold = e.pointerType === 'touch' ? 0.42 : 0.32;

      if (Math.abs(speed) > threshold) {
        // Suara angin ter-throttle minimal jeda 1.2 detik agar tidak bising/crackle
        if (now - lastWindSoundTimeRef.current > 1200) {
          playWindBreezeSound();
          lastWindSoundTimeRef.current = now;
        }

        // Kemiringan angin maksimal hanya ±3.2 derajat agar selalu anggun & tenang
        const maxAngle = 3.2;
        const targetAngle = Math.max(-maxAngle, Math.min(maxAngle, speed * 2.2));
        setWindAngle(targetAngle);

        clearTimeout(windResetTimerRef.current);
        windResetTimerRef.current = setTimeout(() => {
          setWindAngle(0);
        }, 750);
      }
      lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };
    }
  };

  // Handle pointer up (selesai sentuhan)
  const handlePointerUp = (e) => {
    // Abaikan jika interaksi selesai di tombol UI, modal, atau bunga yang sudah ada
    if (
      e.target.closest('button') ||
      e.target.closest('.modal-content') ||
      e.target.closest('[data-flower="true"]')
    ) {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }
      isPressingRef.current = false;
      return;
    }

    if (pressTimerRef.current && isPressingRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
      isPressingRef.current = false;
      // Berhasil Single Tap di ruang kosong! Tanam Lily Biasa
      plantRegularLily(e.clientX, e.clientY);
    }
  };

  // Submit bisikan rahasia
  const handlePlantSecret = (message) => {
    if (!targetCoords) return;

    const newFlower = {
      id: `lily_secret_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: 'lily',
      xPercent: targetCoords.xPercent,
      yPercent: targetCoords.yPercent,
      scale: 1.0,
      profileIndex: 8, // Golden Ray
      secretMessage: message,
      plantedBy: {
        id: user?.id || 'user_sayang',
        name: user?.name || 'Sayang',
        role: user?.role || 'girlfriend',
      },
      plantedAt: new Date().toISOString(),
    };

    const updated = addGardenFlower(newFlower);
    setFlowers(updated);
    playBloomChime();
    setTargetCoords(null);
  };

  // Buka kartu pesan rahasia saat bunga emas diketuk
  const handleOpenSecret = (flower) => {
    setActiveSecretFlower(flower);
    playSecretFoundSound();
  };

  // Tangkap potret layar taman (Save Picture)
  const handleCaptureGarden = async () => {
    if (!gardenContainerRef.current) return;
    setIsCapturing(true);

    // Beri jeda 50ms agar tombol tersembunyi dari jepretan
    setTimeout(async () => {
      try {
        const dataUrl = await toPng(gardenContainerRef.current, {
          quality: 0.95,
          backgroundColor: '#0a150a',
          pixelRatio: 2,
        });
        setCapturedImageUrl(dataUrl);
        setIsSavePictureOpen(true);
      } catch (err) {
        console.error('Gagal memotret taman:', err);
      } finally {
        setIsCapturing(false);
      }
    }, 60);
  };

  // Konfirmasi reset taman
  const handleConfirmReset = () => {
    resetGardenFlowers();
    setFlowers([]);
  };

  return (
    <div
      ref={gardenContainerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="fixed inset-0 w-screen h-screen overflow-hidden animate-aurora select-none cursor-pointer"
      style={{ touchAction: 'none' }}
    >
      {/* 3 Lapis Bias Cahaya Magis Taman */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 85% 15%, rgba(216, 27, 96, 0.25) 0%, transparent 60%),
            radial-gradient(circle at 15% 85%, rgba(76, 175, 80, 0.18) 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, rgba(33, 150, 243, 0.12) 0%, transparent 70%)
          `,
        }}
      />

      {/* Bayangan Pinggiran Gelap (Vignette Shadow) */}
      <div
        className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.92)] z-20"
      />

      {/* Kanvas Partikel Kunang-kunang & Jejak Bintang */}
      <GardenCanvas ref={canvasRef} />

      {/* Renderer Bunga Gerbera & Lily SVG */}
      <FlowerRenderer
        flowers={flowers}
        onSelectSecret={handleOpenSecret}
        windAngle={windAngle}
      />

      {/* Top Floating Controls Header (Sembunyi saat potret) */}
      {!isCapturing && (
        <header className="absolute top-0 left-0 right-0 p-4 z-40 flex items-center justify-between pointer-events-auto">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-xs text-pink-200 backdrop-blur-md active:scale-95 transition-all shadow-lg"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-cinzel tracking-wider">Dashboard</span>
          </button>

          <div className="text-center">
            <h1 className="text-xs sm:text-sm font-bold text-pink-100 font-cinzel tracking-widest drop-shadow-[0_0_12px_rgba(244,114,182,0.6)]">
              GARDEN OF UNWITHERING FLOWERS
            </h1>
            <span className="hidden sm:inline-block text-[10px] text-pink-300/80 font-playfair italic">
              Bunga abadi kita yang tak akan pernah layu
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Toggle Audio */}
            <button
              type="button"
              onClick={handleToggleAudio}
              title={audioEnabled ? 'Mute Suara' : 'Nyalakan Suara'}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-pink-200 backdrop-blur-md active:scale-95 transition-all"
            >
              {audioEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
              )}
            </button>

            {/* Toggle Fullscreen */}
            <button
              type="button"
              onClick={handleToggleFullscreen}
              title="Layar Penuh"
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-pink-200 backdrop-blur-md active:scale-95 transition-all"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </header>
      )}

      {/* Center Whispering Hint (Fades out automatically) */}
      {hintVisible && !isCapturing && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 text-center max-w-xs px-4 animate-in fade-in duration-1000">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md text-neutral-200 text-xs font-playfair italic shadow-2xl">
            <Sparkles className="w-4 h-4 text-amber-300 mx-auto mb-1 animate-spin" />
            <p>
              Sentuh untuk menanam bunga... Tahan sentuhan 1 detik untuk membisikkan rahasia cinta... Geser jari untuk meniup angin ✨
            </p>
          </div>
        </div>
      )}

      {/* Floating Bottom Action Dock (Sembunyi saat potret) */}
      {!isCapturing && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 pointer-events-auto max-w-sm w-full px-4">
          <button
            type="button"
            onClick={handleCaptureGarden}
            className="flex-1 py-2.5 px-4 rounded-full bg-gradient-to-r from-pink-500/30 via-rose-500/30 to-purple-600/30 hover:from-pink-500/40 hover:to-purple-600/40 border border-pink-400/40 backdrop-blur-md text-white text-xs font-cinzel font-semibold shadow-[0_4px_20px_rgba(244,114,182,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4 text-pink-300" />
            <span>SAVE PICTURE</span>
          </button>

          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            title="Tata Ulang Taman"
            className="p-2.5 rounded-full bg-black/40 hover:bg-rose-500/20 border border-white/15 text-neutral-300 hover:text-rose-300 backdrop-blur-md active:scale-95 transition-all shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MODAL 1: Tanam Pesan Rahasia */}
      <PlantSecretModal
        isOpen={isPlantSecretOpen}
        onClose={() => setIsPlantSecretOpen(false)}
        onSubmit={handlePlantSecret}
      />

      {/* MODAL 2: Baca Bisikan Rahasia */}
      <SecretWhisperModal
        isOpen={Boolean(activeSecretFlower)}
        onClose={() => setActiveSecretFlower(null)}
        flower={activeSecretFlower}
      />

      {/* MODAL 3: Save Picture & Simpan ke Memory Vault */}
      <SavePictureModal
        isOpen={isSavePictureOpen}
        onClose={() => setIsSavePictureOpen(false)}
        imageDataUrl={capturedImageUrl}
        user={user}
        flowersCount={flowers.length}
      />

      {/* MODAL 4: Konfirmasi Reset Taman */}
      <ResetGardenModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleConfirmReset}
      />
    </div>
  );
}
