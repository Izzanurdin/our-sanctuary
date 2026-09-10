-- ==============================================================================
-- DATABASE SCHEMA: OUR PRIVATE SPACE (IZZA & CAHAYU)
-- Platform: Supabase (PostgreSQL 15+)
-- Petunjuk: Salin seluruh kode ini dan jalankan (Run) di Supabase SQL Editor.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL: USERS (PROFIL PASANGAN)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY, -- 'user_izza' / 'user_sayang'
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('boyfriend', 'girlfriend', 'partner')),
    avatar_url TEXT,
    timezone TEXT NOT NULL DEFAULT 'Asia/Jakarta', -- 'Asia/Makassar' (WITA) / 'Asia/Jakarta' (WIB)
    pin_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Masukkan data awal profil Izza & Cahayu
INSERT INTO public.users (id, name, role, timezone)
VALUES 
    ('user_izza', 'Izza', 'boyfriend', 'Asia/Makassar'),
    ('user_sayang', 'Cahayu', 'girlfriend', 'Asia/Jakarta')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, role = EXCLUDED.role, timezone = EXCLUDED.timezone;


-- 3. TABEL: DAILY_STATUSES (PILAR 1: MOOD & DETAK JANTUNG HARIAN)
CREATE TABLE IF NOT EXISTS public.daily_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    mood TEXT NOT NULL DEFAULT 'happy',
    status_message TEXT,
    energy_level INT CHECK (energy_level BETWEEN 1 AND 100) DEFAULT 85,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_daily_status UNIQUE (user_id, date)
);


-- 4. TABEL: HABITS & HABIT_COMPLETIONS (PILAR 1: RUTINITAS BERSAMA)
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT DEFAULT 'shared',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.habit_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_habit_user_date UNIQUE (habit_id, user_id, completed_date)
);


-- 5. TABEL: MEMORIES (PILAR 2: POLAROID MEMORY VAULT)
CREATE TABLE IF NOT EXISTS public.memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    caption TEXT,
    photo_url TEXT,
    event_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    tags JSONB DEFAULT '[]'::JSONB,
    created_by TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 6. TABEL: DATE_PLANS (PILAR 2: IDE, JADWAL & REKAP KENCAN GOOGLE DRIVE)
-- Hapus tabel date_plans lama jika masih menggunakan tipe UUID agar bersih dan menggunakan tipe TEXT
DROP TABLE IF EXISTS public.date_plans CASCADE;

CREATE TABLE public.date_plans (
    id TEXT PRIMARY KEY DEFAULT ('date_' || gen_random_uuid())::text,
    title TEXT NOT NULL,
    location TEXT,
    gmaps_url TEXT,
    energy_key TEXT NOT NULL DEFAULT 'casual', -- 'cozy', 'casual', 'outdoor', 'romantic'
    category TEXT DEFAULT 'Food & Drinks',
    dress_code TEXT,
    status TEXT NOT NULL DEFAULT 'wishlist' CHECK (status IN ('planned', 'scheduled', 'completed', 'wishlist')),
    scheduled_date DATE,
    scheduled_start_time TEXT DEFAULT '16:00',
    scheduled_end_time TEXT DEFAULT '19:00',
    completed_at DATE,
    notes TEXT,
    caption TEXT,
    photo_url TEXT,
    drive_folder TEXT,
    drive_url TEXT,
    captured_by TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    created_by TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pastikan kolom baru tetap ditambahkan jika tabel sebelumnya sudah pernah dibuat
ALTER TABLE public.date_plans ADD COLUMN IF NOT EXISTS gmaps_url TEXT;
ALTER TABLE public.date_plans ADD COLUMN IF NOT EXISTS energy_key TEXT DEFAULT 'casual';
ALTER TABLE public.date_plans ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Food & Drinks';
ALTER TABLE public.date_plans ADD COLUMN IF NOT EXISTS dress_code TEXT;
ALTER TABLE public.date_plans ADD COLUMN IF NOT EXISTS scheduled_date DATE;
ALTER TABLE public.date_plans ADD COLUMN IF NOT EXISTS scheduled_start_time TEXT DEFAULT '16:00';
ALTER TABLE public.date_plans ADD COLUMN IF NOT EXISTS scheduled_end_time TEXT DEFAULT '19:00';
ALTER TABLE public.date_plans ADD COLUMN IF NOT EXISTS completed_at DATE;
ALTER TABLE public.date_plans ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.date_plans ADD COLUMN IF NOT EXISTS caption TEXT;
ALTER TABLE public.date_plans ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.date_plans ADD COLUMN IF NOT EXISTS drive_folder TEXT;
ALTER TABLE public.date_plans ADD COLUMN IF NOT EXISTS drive_url TEXT;
ALTER TABLE public.date_plans ADD COLUMN IF NOT EXISTS captured_by TEXT REFERENCES public.users(id) ON DELETE SET NULL;

-- SEED DATA AWAL: 11 Kencan Nyata dari Google Drive (Selesai) + 4 Wishlist Kencan
INSERT INTO public.date_plans (
    id, title, location, gmaps_url, energy_key, category, status, completed_at, 
    drive_folder, drive_url, notes, dress_code, caption, photo_url, captured_by, created_by
)
VALUES 
    -- 1. Matcha & Flowers
    ('date_1_matcha', 'Matcha Date', 'Matcha Bar', '', 'casual', 'Food & Drinks', 'completed', '2026-07-21', 
     '1. Matcha & Flowers! :33', 'https://drive.google.com/drive/folders/1V5eJAV_QtEAod8TVty8p5yBGLk4ZIQFO', 
     'Matcha & flowers date yang manis :33', 'Comfy Casual', 'Matcha enak dan bunga cantik buat kamu yang paling manis :33 🍵💐', '', 'user_izza', 'user_izza'),

    -- 2. Basketball
    ('date_2_basketball', 'Basketball', 'Barty', '', 'outdoor', 'Sports & Play', 'completed', '2026-07-21', 
     '2. Basketball :O', 'https://drive.google.com/drive/folders/1Pv9L5L2SJSlTagj64riKqkfdjUh9m7_T', 
     'Main basket seru bareng di Barty :O', 'Sporty / Active Wear', 'Keringetan bareng main basket di Barty, kamu jago banget nge-shoot bola! 🏀✨', '', 'user_izza', 'user_izza'),

    -- 3. Study Date / Cafie
    ('date_3_study', 'Study Date', 'Kopken', '', 'cozy', 'Productive / Cafe', 'completed', '2026-07-21', 
     '3. :Cafie', 'https://drive.google.com/drive/folders/1M6TGKs4AMB3KGM7aC3QHM2BKKxqQWOI7', 
     'Nugas & ngobrol santai berdua di Kopken', 'Comfy Casual', 'Nemenin kamu nugas sambil ngopi, suasana tenang dan selalu nyaman kalau bareng kamu ☕📖', '', 'user_sayang', 'user_sayang'),

    -- 4. Gelato
    ('date_4_gelato', 'Gelato', 'Gusto''s Gelato', '', 'casual', 'Food & Drinks', 'completed', '2026-07-21', 
     '4. Geyato', 'https://drive.google.com/drive/folders/1D6MrUNgdmT4TN4vxUgUyCKuT0VqZRMt7', 
     'Nyobain varian gelato favorit di Gusto Gelato', 'Casual Santai', 'Manisnya gelato Gusto ga ada apa-apanya dibanding senyum manis kamu hari itu 🍨❤️', '', 'user_sayang', 'user_sayang'),

    -- 5. Mall Date
    ('date_5_mall', 'Mall Date', 'Living World', '', 'casual', 'Shopping & Chill', 'completed', '2026-07-21', 
     '5. Malu D:ong', 'https://drive.google.com/drive/folders/1c_KKcEvh_VL_m7RQXET8WdkfB6Pidc0n', 
     'Jalan-jalan, belanja, & hunting kuliner di Living World', 'Smart Casual / Rapi Manis', 'Keliling Living World gandengan tangan sambil nyari makan dan ngobrol seru 🛍️🍽️', '', 'user_izza', 'user_izza'),

    -- 6. Yendeem
    ('date_6_yendeem', 'Yendeem', 'Yendeem', '', 'casual', 'Food & Drinks', 'completed', '2026-07-22', 
     '6. Yendeem', 'https://drive.google.com/drive/folders/1VUWm9SnR2ywcGm9MCfpQkews63FTDQU3', 
     'Kencan kuliner santai dan seru bareng di Yendeem', 'Comfy Casual', 'Momen kulineran santai dan hangat berdua di Yendeem 🥢🍲❤️', '', 'user_sayang', 'user_sayang'),

    -- 7. PKB (Pekan Kebudayaan Bali)
    ('date_7_pkb', 'PKB : Pekan Kebudayaan Bali', 'Art Center Denpasar', '', 'outdoor', 'Culture & Arts', 'completed', '2026-07-22', 
     '7. Pekabeh', 'https://drive.google.com/drive/folders/1wwSDOvjYSkWZrsHrkrXoJ-_ZlACHbz_u', 
     'Keliling pameran seni & festival budaya bareng', 'Batik / Semi Formal', 'Jalan santai liat karya seni & pertunjukan budaya di Pekan Kebudayaan Bali 🎭✨', '', 'user_izza', 'user_izza'),

    -- 8. Trampoline Date (Aero X Space)
    ('date_8_trampoline', 'Trampoline Date', 'Aero X Space', '', 'outdoor', 'Adventure & Play', 'completed', '2026-07-22', 
     '9. Aero X Space', 'https://drive.google.com/drive/folders/1VRCjxLpnkyfCocE53SkddLKYyql9hcHX', 
     'Lompat-lompat seru di Aero X Space', 'Sporty / Active Wear', 'Tertawa lepas lompat-lompat di trampolin Aero X Space, energi kita tumpah ruah! 🤸‍♀️⚡', '', 'user_sayang', 'user_sayang'),

    -- 9. Jimbaran & Banyoo
    ('date_9_jimbaran', 'Jimbaran & Banyoo', 'Pantai Jimbaran & Banyoo', '', 'romantic', 'Beach & Sunset', 'completed', '2026-07-22', 
     '10. Jimbaran && Banyoo!!', 'https://drive.google.com/drive/folders/1BccOXee6NYJoxxHH3PPN_9QINObat_mF', 
     'Menikmati sunset romantis di tepi pantai Jimbaran dan serunya Banyoo', 'Sunset / Beach Wear', 'Deburan ombak pantai Jimbaran, sunset jingga, dan momen magis di Banyoo berdua bersamamu 🌅🌊❤️', '', 'user_izza', 'user_izza'),

    -- 10. Kencan Lewe
    ('date_10_kencan_lewe', 'Kencan Lewe', 'Lewe', '', 'cozy', 'Night Ride / Cozy', 'completed', '2026-07-22', 
     '11. Kencan Lewe :O', 'https://drive.google.com/drive/folders/1WAMCW3SdbcpfLurh7NulHSayg2hGJNst', 
     'Kencan santai Lewe berdua :O', 'Comfy Casual', 'Kencan manis dan hangat berdua tanpa beban, penuh tawa dan kebahagiaan 🌙✨', '', 'user_sayang', 'user_sayang'),

    -- 11. Konser Nadin & Baskara
    ('date_11_concert', 'Concert Date : Nadin & Baskara', 'Kebun Raya Bedugul', '', 'romantic', 'Music & Concert', 'completed', '2026-07-26', 
     '12. Konser!!', 'https://drive.google.com/drive/folders/1Afhqd6Z02kOOP9wsr8_FzJ0h_a7nOuc8', 
     'Nonton penampilan Nadin Amizah & Hindia/Baskara di sejuknya alam Bedugul', 'Warm Outer & Earth Tone', 'Momen magis nyanyi bareng lagu Nadin & Baskara di tengah dingin dan kabut Bedugul, salah satu kencan terbaik kita 🌲🎶❤️', '', 'user_sayang', 'user_sayang'),

    -- 4 Wishlist Awal
    ('date_wish_1', 'Sunset Picnic di Pantai', 'Pantai Melasti / Pantai Nyang-Nyang', '', 'outdoor', 'Nature & Romantic', 'wishlist', NULL, 
     '', '', 'Bawa tikar piknik, buah segar, minuman dingin, dan kamera polaroid!', 'Sunset / Beach Wear', '', '', NULL, 'user_izza'),

    ('date_wish_2', 'Midnight Car Talk & Ice Cream Drive-thru', 'Keliling Kota & Drive-thru', '', 'cozy', 'Night Ride', 'wishlist', NULL, 
     '', '', 'Beli es krim favorit, putar playlist Spotify kita, ngobrol deep talk sampai malam.', 'Comfy Casual / Santai', '', '', NULL, 'user_sayang'),

    ('date_wish_3', 'Masak Pasta & Baking Cookies Bareng', 'Dapur Rumah', '', 'cozy', 'Cooking & Home', 'wishlist', NULL, 
     '', '', 'Bikin creamy pasta carbonara & cookies cokelat hangat, sambil setel lagu jazz.', 'Kaos Santai & Celemek', '', '', NULL, 'user_sayang'),

    ('date_wish_4', 'Romantic Rooftop Dinner & City Lights', 'Rooftop Resto', '', 'romantic', 'Fine Dining', 'wishlist', NULL, 
     '', '', 'Dress up cantik & ganteng, makan malam romantis sambil liat gemerlap lampu kota.', 'Elegant / Dress-up Formal', '', '', NULL, 'user_izza')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    location = EXCLUDED.location,
    gmaps_url = EXCLUDED.gmaps_url,
    energy_key = EXCLUDED.energy_key,
    category = EXCLUDED.category,
    dress_code = EXCLUDED.dress_code,
    status = EXCLUDED.status,
    completed_at = EXCLUDED.completed_at,
    drive_folder = EXCLUDED.drive_folder,
    drive_url = EXCLUDED.drive_url,
    notes = EXCLUDED.notes,
    caption = EXCLUDED.caption,
    photo_url = EXCLUDED.photo_url,
    captured_by = EXCLUDED.captured_by,
    updated_at = NOW();


-- 7. TABEL: MISS_YOU_LOGS (PILAR 3: RIWAYAT SPAM RINDU)
CREATE TABLE IF NOT EXISTS public.miss_you_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    recipient_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    click_count INT NOT NULL DEFAULT 1,
    milestone_text TEXT,
    sent_via TEXT NOT NULL DEFAULT 'wa_gateway',
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 8. TABEL: GARDEN_FLOWERS (PILAR 4: BUNGA TAMAN ABADI)
CREATE TABLE IF NOT EXISTS public.garden_flowers (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL DEFAULT 'lily',
    x_percent NUMERIC(5,2) NOT NULL,
    y_percent NUMERIC(5,2) NOT NULL,
    scale NUMERIC(3,2) NOT NULL DEFAULT 0.85,
    profile_index INT NOT NULL DEFAULT 0,
    secret_message TEXT,
    planted_by JSONB NOT NULL,
    planted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Masukkan bunga sambutan awal
INSERT INTO public.garden_flowers (id, type, x_percent, y_percent, scale, profile_index, secret_message, planted_by, planted_at)
VALUES (
    'flower_starter_welcome',
    'lily',
    50.00,
    52.00,
    0.95,
    8,
    'Selamat datang di taman abadi kita, sayangku... Mekarlah selamanya ❤️',
    '{"id": "user_izza", "name": "Izza", "role": "boyfriend"}'::JSONB,
    NOW()
) ON CONFLICT (id) DO NOTHING;


-- 9. TABEL: FLOWER_BASKET (PILAR 4: KERANJANG SURAT & BISIKAN RAHASIA)
CREATE TABLE IF NOT EXISTS public.flower_basket (
    id TEXT PRIMARY KEY,
    flower_id TEXT,
    secret_message TEXT NOT NULL,
    planted_by JSONB NOT NULL,
    saved_by TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    planted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- Aplikasi ini adalah aplikasi privat personal untuk Izza & Cahayu.
-- Seluruh tabel diizinkan untuk diakses secara publik menggunakan anon key.
-- ==============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.date_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.miss_you_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garden_flowers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flower_basket ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read/write users" ON public.users;
CREATE POLICY "Allow public read/write users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write daily_statuses" ON public.daily_statuses;
CREATE POLICY "Allow public read/write daily_statuses" ON public.daily_statuses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write habits" ON public.habits;
CREATE POLICY "Allow public read/write habits" ON public.habits FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write habit_completions" ON public.habit_completions;
CREATE POLICY "Allow public read/write habit_completions" ON public.habit_completions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write memories" ON public.memories;
CREATE POLICY "Allow public read/write memories" ON public.memories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write date_plans" ON public.date_plans;
CREATE POLICY "Allow public read/write date_plans" ON public.date_plans FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write miss_you_logs" ON public.miss_you_logs;
CREATE POLICY "Allow public read/write miss_you_logs" ON public.miss_you_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write garden_flowers" ON public.garden_flowers;
CREATE POLICY "Allow public read/write garden_flowers" ON public.garden_flowers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read/write flower_basket" ON public.flower_basket;
CREATE POLICY "Allow public read/write flower_basket" ON public.flower_basket FOR ALL USING (true) WITH CHECK (true);


-- ==============================================================================
-- 11. SUPABASE STORAGE BUCKET UNTUK FOTO MEMORY VAULT
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('memory-photos', 'memory-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Allow public read memory photos" ON storage.objects;
CREATE POLICY "Allow public read memory photos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'memory-photos');

DROP POLICY IF EXISTS "Allow public upload memory photos" ON storage.objects;
CREATE POLICY "Allow public upload memory photos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'memory-photos');

DROP POLICY IF EXISTS "Allow public delete memory photos" ON storage.objects;
CREATE POLICY "Allow public delete memory photos" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'memory-photos');


-- ==============================================================================
-- 12. SUPABASE REALTIME REPLICATION (AMAN & IDEMPOTEN)
-- ==============================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'garden_flowers') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.garden_flowers;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'flower_basket') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.flower_basket;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'daily_statuses') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_statuses;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'memories') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.memories;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'miss_you_logs') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.miss_you_logs;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'date_plans') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.date_plans;
    END IF;
END $$;

-- SELESAI! Database siap digunakan secara Realtime untuk Izza & Cahayu ❤️
