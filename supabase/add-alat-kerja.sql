-- Add alat_kerja table for work tools tracking
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.alat_kerja (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    kategori TEXT NOT NULL CHECK (kategori IN ('panen', 'perawatan', 'pemupukan')),
    jumlah_total INTEGER NOT NULL DEFAULT 0,
    jumlah_baik INTEGER NOT NULL DEFAULT 0,
    jumlah_rusak INTEGER NOT NULL DEFAULT 0,
    deskripsi TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.alat_kerja ENABLE ROW LEVEL SECURITY;

-- RLS policies
DROP POLICY IF EXISTS "Allow authenticated read" ON public.alat_kerja;
DROP POLICY IF EXISTS "Allow authenticated write" ON public.alat_kerja;
CREATE POLICY "Allow authenticated read" ON public.alat_kerja FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write" ON public.alat_kerja FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Done!
SELECT 'Tabel alat_kerja berhasil dibuat!' AS result;
