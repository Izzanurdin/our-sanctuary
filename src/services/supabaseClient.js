import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

/**
 * Memeriksa apakah kredensial Supabase sudah terkonfigurasi di environment
 */
export function isSupabaseConfigured() {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project-id')
  );
}

/**
 * Klien Supabase utama (null jika belum dikonfigurasi)
 */
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Helper untuk mengunggah foto ke Supabase Storage Bucket 'memory-photos'
 * @param {File|Blob} fileOrBlob
 * @param {string} fileName
 * @returns {Promise<string|null>} Public URL foto atau null jika gagal
 */
export async function uploadMemoryPhoto(fileOrBlob, fileName) {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  try {
    const cleanFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { data, error } = await supabase.storage
      .from('memory-photos')
      .upload(cleanFileName, fileOrBlob, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Error uploading memory photo to Supabase:', error);
      return null;
    }

    const { data: publicData } = supabase.storage
      .from('memory-photos')
      .getPublicUrl(data.path);

    return publicData?.publicUrl || null;
  } catch (err) {
    console.error('Unexpected error uploading memory photo:', err);
    return null;
  }
}
