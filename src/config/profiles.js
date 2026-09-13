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
    tag: 'Pacar Tersayang ❤️',
    // Pilihan panggilan nama yang diacak (Halo Cahayu {nickname}...)
    nicknames: ['Cantikku', 'Manisku', 'Cintaku', 'Bidadariku', 'Sayangku'],
    // Pilihan kata sayang di ujung sapaan (...gimana harimu hari ini, {loveName}?)
    loveNames: ['sayangku', 'cintaku', 'manisku', 'semestaku', 'bidadariku'],
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
    tag: 'Pacar Tersayang 💫',
    // Pilihan panggilan nama yang diacak (Halo Izza {nickname}...)
    nicknames: ['Gantengku', 'Cintaku', 'Manisku', 'Sayangku'],
    // Pilihan kata sayang di ujung sapaan (...gimana harimu hari ini, {loveName}?)
    loveNames: ['sayangku', 'cintaku', 'manisku', 'semestaku', 'pangeranku'],
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
 * Format: "Halo {name} {nickname}, gimana harimu hari ini, {loveName}?"
 */
export function getRandomGreeting(profile) {
  if (!profile) return "Halo Sayang, mari kita jalani hari ini bersama";

  // Ambil data referensi dari PROFILES jika ada agar daftar panggilan lengkap
  const source = PROFILES.find((p) => p.id === profile.id) || profile;
  const nicknames = source.nicknames || ['Sayangku'];
  const loveNames = source.loveNames || ['sayangku'];

  const nickname = pickRandom(nicknames);
  const loveName = pickRandom(loveNames);

  const nickPart = nickname ? ` ${nickname}` : '';
  const lovePart = loveName ? `, ${loveName}` : '';

  return `Halo ${source.name}${nickPart}, gimana harimu hari ini${lovePart}?`;
}

/**
 * Fungsi untuk mengambil satu panggilan acak dari daftar nicknames profil
 */
export function getRandomNickname(profileOrId) {
  if (!profileOrId) return 'sayang';
  let profile = profileOrId;
  if (typeof profileOrId === 'string') {
    profile = PROFILES.find((p) => p.id === profileOrId) || { nicknames: ['sayang'] };
  } else if (profileOrId.id) {
    profile = PROFILES.find((p) => p.id === profileOrId.id) || profileOrId;
  }
  const nicknames = profile?.nicknames || ['sayang'];
  return pickRandom(nicknames);
}

