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
  icon = '/icon-192.png',
  badge = '/icon-192.png',
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
const reminderCallbacks = new Set();
let registeredRecipientId = null;

function ensureReminderChannel(currentUserId) {
  if (!supabase) return null;

  if (currentUserId) {
    registeredRecipientId = currentUserId;
  }

  if (!reminderChannel) {
    reminderChannel = supabase.channel('realtime:partner_reminders', {
      config: { broadcast: { self: false } },
    });

    reminderChannel
      .on('broadcast', { event: 'reminder' }, (response) => {
        const payload = response?.payload;
        if (!payload) return;

        // Hanya proses jika pesan ditujukan untuk pengguna saat ini
        if (!registeredRecipientId || payload.recipientId === registeredRecipientId) {
          showWebNotification({
            title: `⏰ Pengingat Sehat dari ${payload.senderName}!`,
            body: payload.message,
            icon: '/icon-192.png',
            tag: 'health-reminder',
          });

          reminderCallbacks.forEach((cb) => {
            try {
              cb(payload);
            } catch (err) {
              console.error('Error executing reminder callback:', err);
            }
          });
        }
      })
      .subscribe((status, err) => {
        if (err) {
          console.debug('Partner reminder subscription status:', status, err);
        }
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

  const payload = {
    senderName,
    senderId,
    recipientId,
    message,
    reminderType,
    timestamp: new Date().toISOString(),
  };

  try {
    const channel = ensureReminderChannel(senderId);
    if (!channel) return false;

    // Supabase RealtimeChannel.send() otomatis mengirim via WebSocket atau fallback ke REST API
    const res = await channel.send({
      type: 'broadcast',
      event: 'reminder',
      payload,
    });

    return res === 'ok';
  } catch (err) {
    console.error('Error sending partner reminder broadcast:', err);
    try {
      if (reminderChannel && typeof reminderChannel.httpSend === 'function') {
        const httpRes = await reminderChannel.httpSend('reminder', payload);
        return httpRes?.status === 'ok' || true;
      }
    } catch {
      // ignore
    }
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
    if (onReminderReceived) {
      reminderCallbacks.add(onReminderReceived);
    }

    ensureReminderChannel(currentUserId);

    return {
      unsubscribe: () => {
        if (onReminderReceived) {
          reminderCallbacks.delete(onReminderReceived);
        }
      },
    };
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
    icon: '/icon-192.png',
    tag: 'test-notification',
  });
}

