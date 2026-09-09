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


-- 6. TABEL: DATE_PLANS (PILAR 2: IDE & JADWAL KENCAN)
CREATE TABLE IF NOT EXISTS public.date_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    target_date TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'completed', 'wishlist')),
    created_by TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


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
END $$;

-- SELESAI! Database siap digunakan secara Realtime untuk Izza & Cahayu ❤️
