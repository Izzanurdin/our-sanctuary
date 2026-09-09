/**
 * Konfigurasi Profil Pengguna (Izza & Pasangan)
 *
 * Fitur Spesial:
 * - nicknames: Daftar panggilan sayang (diacak setiap kali login/masuk)
 * - loveNames: Daftar kata panggilan cinta (diacak di bagian 'my ...?')
 * - getRandomGreeting(): Menghasilkan sapaan romantis dinamis secara acak
 */

const pickRandom = (arr) => {
  if (!arr || arr.length === 0) return '';
  return arr[Math.floor(Math.random() * arr.length)];
};

export const PROFILES = [
  {
    id: 'user_sayang',
    name: 'Cahayu',
    role: 'girlfriend',
    tag: 'Girlfriend ❤️',
    // Pilihan panggilan nama yang diacak (Hello Cahayu {nickname}...)
    nicknames: ['Cantikku', 'Manisku', 'Cintaku', 'Bidadariku', 'Sayangku'],
    // Pilihan kata sayang di ujung sapaan (...how's your day my {loveName}?)
    loveNames: ['sunshine', 'love', 'sweetheart', 'everything', 'cutie pie'],
    get greeting() {
      return getRandomGreeting(this);
    },
    // File foto Cahayu di public/avatars/cahayu.jpeg
    avatarUrl: '/avatars/cahayu.jpeg',
    avatarFallbackUrl: '/avatars/sayang.jpg',
    avatarBg: 'from-pink-500/30 to-rose-500/20',
    borderColor: 'border-pink-500/30 hover:border-pink-400/60',
    description: 'Pemilik senyum termanis hari ini',
  },
  {
    id: 'user_izza',
    name: 'Izza',
    role: 'boyfriend',
    tag: 'Boyfriend 💫',
    // Pilihan panggilan nama yang diacak (Hello Izza {nickname}...)
    nicknames: ['Gantengku', 'Cintaku', 'Manisku', 'Sayangku'],
    // Pilihan kata sayang di ujung sapaan (...how's your day my {loveName}?)
    loveNames: ['sunshine', 'love', 'schatzi', 'world', 'universe'],
    get greeting() {
      return getRandomGreeting(this);
    },
    // File foto Izza di public/avatars/izza.jpeg
    avatarUrl: '/avatars/izza.jpeg',
    avatarFallbackUrl: '/avatars/izza.jpg',
    avatarBg: 'from-rose-500/30 to-purple-500/20',
    borderColor: 'border-rose-500/30 hover:border-rose-400/60',
    description: 'Selalu ada dan siap nemenin kamu',
  },
];

/**
 * Fungsi pembantu untuk mengacak sapaan romantis:
 * Format: "Hello {name} {nickname}, how's your day my {loveName}?"
 */
export function getRandomGreeting(profile) {
  if (!profile) return "Hello Sayang, let's get into it";

  // Ambil data referensi dari PROFILES jika ada agar daftar panggilan lengkap
  const source = PROFILES.find((p) => p.id === profile.id) || profile;
  const nicknames = source.nicknames || ['Sayangku'];
  const loveNames = source.loveNames || ['love'];

  const nickname = pickRandom(nicknames);
  const loveName = pickRandom(loveNames);

  const nickPart = nickname ? ` ${nickname}` : '';
  const lovePart = loveName ? ` my ${loveName}` : '';

  return `Hello ${source.name}${nickPart}, how's your day${lovePart}?`;
}
