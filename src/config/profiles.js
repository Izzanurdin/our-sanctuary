/**
 * Konfigurasi Profil Pengguna (Izza & Pasangan)
 *
 * Di file ini kamu bisa mengubah:
 * 1. name: Nama panggilan yang tampil di seluruh aplikasi
 * 2. greeting: Otomatis memanggil 'name' menggunakan getter (tidak perlu ketik manual!)
 * 3. avatarUrl: Path file foto di folder public/avatars/
 * 4. description: Pesan/bio singkat di kartu profil
 */

export const PROFILES = [
  {
    id: 'user_sayang',
    name: 'Cahayu',
    role: 'girlfriend',
    tag: 'Girlfriend ❤️',
    // Otomatis mengambil dari value 'name'
    get greeting() {
      return `Hello ${this.name}, let's get into it`;
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
    // Otomatis mengambil dari value 'name'
    get greeting() {
      return `Hello ${this.name}, let's get into it`;
    },
    // File foto Izza di public/avatars/izza.jpeg
    avatarUrl: '/avatars/izza.jpeg',
    avatarFallbackUrl: '/avatars/izza.jpg',
    avatarBg: 'from-rose-500/30 to-purple-500/20',
    borderColor: 'border-rose-500/30 hover:border-rose-400/60',
    description: 'Selalu ada dan siap nemenin kamu',
  },
];
