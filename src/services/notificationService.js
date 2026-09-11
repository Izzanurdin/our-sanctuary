/**
 * Notification Service (Web Notifications API, Service Worker & Supabase Realtime Broadcast)
 *
 * Mengelola:
 * - Pendaftaran Service Worker (PWA)
 * - Permintaan izin Notifikasi browser / HP
 * - Menampilkan notifikasi pop-up native sistem operasi (Android, Windows, macOS)
 * - Pengiriman pengingat & sinyal afeksi via Supabase Realtime Broadcast
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { triggerHaptic } from './whatsapp';

let swRegistration = null;

/**
 * Inisialisasi dan daftarkan Service Worker
 */
export async function initServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    swRegistration = reg;
    return reg;
  } catch (err) {
    console.debug('Service worker registration note:', err);
    return null;
  }
}

/**
 * Cek apakah browser mendukung Web Notifications
 */
export function isNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Status izin notifikasi saat ini ('granted' | 'denied' | 'default')
 */
export function getNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Meminta izin menampilkan notifikasi ke pengguna
 */
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await initServiceWorker();
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
    return false;
  }
}

/**
 * Tampilkan Notifikasi Sistem di HP / Laptop
 * Menggunakan ServiceWorkerRegistration.showNotification jika aktif (didukung di Android background),
 * atau fallback ke new Notification()
 */
export async function showWebNotification({
  title,
  body,
  icon = '/favicon.svg',
  badge = '/favicon.svg',
  vibrate = [200, 100, 200],
  tag = 'our-sanctuary',
  data = {},
}) {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  // Getar HP jika didukung
  triggerHaptic(60);

  const options = {
    body,
    icon,
    badge,
    vibrate,
    tag,
    renotify: true,
    data,
  };

  try {
    // 1. Coba lewat Service Worker jika ada (standar modern, bekerja di HP Android)
    if ('serviceWorker' in navigator) {
      const reg = swRegistration || (await navigator.serviceWorker.ready);
      if (reg && typeof reg.showNotification === 'function') {
        await reg.showNotification(title, options);
        return true;
      }
    }

    // 2. Fallback ke constructor Notification standar
    new Notification(title, options);
    return true;
  } catch (err) {
    console.warn('Error displaying web notification:', err);
    try {
      new Notification(title, options);
      return true;
    } catch {
      return false;
    }
  }
}

let reminderChannel = null;

function getReminderChannel() {
  if (!reminderChannel && supabase) {
    reminderChannel = supabase.channel('realtime:partner_reminders', {
      config: { broadcast: { self: false } },
    });
  }
  return reminderChannel;
}

/**
 * Kirim Pengingat Sehat Langsung ke Layar Pasangan via Supabase Realtime Broadcast
 */
export async function sendPartnerReminderToCloud({
  senderName = 'Pasanganmu',
  senderId = 'user_izza',
  recipientId = 'user_sayang',
  message = 'Jangan lupa minum air dan jaga kesehatan ya sayang! ❤️',
  reminderType = 'health_checklist',
}) {
  if (!isSupabaseConfigured() || !supabase) {
    return false;
  }

  try {
    const channel = getReminderChannel();
    const payload = {
      senderName,
      senderId,
      recipientId,
      message,
      reminderType,
      timestamp: new Date().toISOString(),
    };

    if (channel.state === 'joined') {
      const res = await channel.send({
        type: 'broadcast',
        event: 'reminder',
        payload,
      });
      return res === 'ok';
    }

    return new Promise((resolve) => {
      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const res = await channel.send({
            type: 'broadcast',
            event: 'reminder',
            payload,
          });
          resolve(res === 'ok');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          resolve(false);
        }
      });
    });
  } catch (err) {
    console.error('Error sending partner reminder broadcast:', err);
    return false;
  }
}

/**
 * Berlangganan (Subscribe) Pengingat Sehat Realtime dari Pasangan
 */
export function subscribeToPartnerReminders(currentUserId, onReminderReceived) {
  if (!isSupabaseConfigured() || !supabase || !currentUserId) {
    return null;
  }

  try {
    const channel = getReminderChannel();

    channel.on('broadcast', { event: 'reminder' }, (response) => {
      const payload = response?.payload;
      if (!payload) return;

      // Hanya proses jika pesan ditujukan untuk pengguna saat ini
      if (payload.recipientId === currentUserId) {
        // 1. Tampilkan notifikasi pop-up HP
        showWebNotification({
          title: `⏰ Pengingat Sehat dari ${payload.senderName}!`,
          body: payload.message,
          icon: '/favicon.svg',
          tag: 'health-reminder',
        });

        // 2. Kirim ke callback UI
        if (onReminderReceived) {
          onReminderReceived(payload);
        }
      }
    });

    if (channel.state !== 'joined') {
      channel.subscribe();
    }

    return channel;
  } catch (err) {
    console.warn('Error subscribing to partner reminders:', err);
    return null;
  }
}

/**
 * Tes notifikasi lokal untuk memverifikasi izin, getaran, dan pop-up OS
 */
export async function testNotification() {
  return showWebNotification({
    title: '🔔 Tes Notifikasi Our Sanctuary',
    body: 'Notifikasi & getaran HP kamu berfungsi dengan sempurna! Sinyal rindu & pengingat sehat siap meluncur! ✨',
    icon: '/favicon.svg',
    tag: 'test-notification',
  });
}

