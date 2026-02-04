-- =====================================================
-- SAWITKU DATABASE SCHEMA FOR SUPABASE (SAFE VERSION)
-- Skips existing tables using IF NOT EXISTS
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS & AUTHENTICATION
-- =====================================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'mandor' CHECK (role IN ('admin', 'mandor', 'owner')),
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. MANAJEMEN LAHAN (Land Management)
-- =====================================================

-- Blok Lahan (Land Blocks)
CREATE TABLE IF NOT EXISTS public.blok_lahan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    kode TEXT UNIQUE NOT NULL,
    luas_hektar DECIMAL(10,2) NOT NULL,
    jumlah_pohon INTEGER DEFAULT 0,
    tahun_tanam INTEGER,
    jenis_bibit TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    polygon_coordinates JSONB,
    status TEXT DEFAULT 'produktif' CHECK (status IN ('produktif', 'pemupukan', 'perawatan', 'panen', 'tidak_aktif')),
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data Pohon per Blok
CREATE TABLE IF NOT EXISTS public.pohon (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blok_id UUID NOT NULL REFERENCES public.blok_lahan(id) ON DELETE CASCADE,
    nomor_pohon TEXT,
    tanggal_tanam DATE,
    jenis_bibit TEXT,
    kondisi TEXT DEFAULT 'sehat' CHECK (kondisi IN ('sehat', 'sakit', 'mati', 'diganti')),
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. INVENTARIS (Inventory)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.kategori_inventaris (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    jenis TEXT NOT NULL CHECK (jenis IN ('pupuk', 'pestisida', 'alat', 'lainnya')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inventaris (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kategori_id UUID REFERENCES public.kategori_inventaris(id),
    nama TEXT NOT NULL,
    satuan TEXT NOT NULL,
    stok_saat_ini DECIMAL(10,2) DEFAULT 0,
    stok_minimum DECIMAL(10,2) DEFAULT 0,
    harga_per_satuan DECIMAL(15,2) DEFAULT 0,
    lokasi_penyimpanan TEXT,
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transaksi_stok (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventaris_id UUID NOT NULL REFERENCES public.inventaris(id) ON DELETE CASCADE,
    jenis TEXT NOT NULL CHECK (jenis IN ('masuk', 'keluar')),
    jumlah DECIMAL(10,2) NOT NULL,
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    keterangan TEXT,
    user_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. OPERASIONAL LAPANGAN
-- =====================================================

CREATE TABLE IF NOT EXISTS public.pemupukan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blok_id UUID NOT NULL REFERENCES public.blok_lahan(id) ON DELETE CASCADE,
    tanggal_jadwal DATE NOT NULL,
    tanggal_realisasi DATE,
    inventaris_id UUID REFERENCES public.inventaris(id),
    dosis_per_pohon DECIMAL(10,2),
    total_digunakan DECIMAL(10,2),
    status TEXT DEFAULT 'dijadwalkan' CHECK (status IN ('dijadwalkan', 'selesai', 'tertunda')),
    petugas_id UUID REFERENCES public.profiles(id),
    catatan TEXT,
    foto_bukti TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hama_penyakit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blok_id UUID NOT NULL REFERENCES public.blok_lahan(id) ON DELETE CASCADE,
    tanggal_laporan DATE NOT NULL DEFAULT CURRENT_DATE,
    jenis TEXT NOT NULL,
    tingkat_serangan TEXT CHECK (tingkat_serangan IN ('ringan', 'sedang', 'berat')),
    jumlah_pohon_terserang INTEGER,
    tindakan TEXT,
    status TEXT DEFAULT 'dilaporkan' CHECK (status IN ('dilaporkan', 'ditangani', 'selesai')),
    pelapor_id UUID REFERENCES public.profiles(id),
    foto_bukti TEXT[],
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.perawatan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blok_id UUID NOT NULL REFERENCES public.blok_lahan(id) ON DELETE CASCADE,
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    jenis_perawatan TEXT NOT NULL CHECK (jenis_perawatan IN ('weeding', 'pruning', 'pembersihan', 'lainnya')),
    deskripsi TEXT,
    petugas_id UUID REFERENCES public.profiles(id),
    jumlah_pekerja INTEGER,
    biaya DECIMAL(15,2) DEFAULT 0,
    status TEXT DEFAULT 'selesai' CHECK (status IN ('dijadwalkan', 'sedang_dikerjakan', 'selesai')),
    foto_bukti TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. PANEN & PENJUALAN
-- =====================================================

CREATE TABLE IF NOT EXISTS public.panen (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blok_id UUID NOT NULL REFERENCES public.blok_lahan(id) ON DELETE CASCADE,
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    jumlah_janjang INTEGER NOT NULL,
    berat_kg DECIMAL(10,2) NOT NULL,
    pemanen_id UUID REFERENCES public.profiles(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by UUID REFERENCES public.profiles(id),
    approved_at TIMESTAMPTZ,
    catatan TEXT,
    foto_bukti TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transportasi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    nomor_kendaraan TEXT,
    nama_supir TEXT,
    tujuan_pks TEXT NOT NULL,
    total_berat_kg DECIMAL(10,2) NOT NULL,
    berat_timbangan_pks DECIMAL(10,2),
    nomor_surat_jalan TEXT,
    status TEXT DEFAULT 'dikirim' CHECK (status IN ('dikirim', 'sampai', 'selesai')),
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transportasi_panen (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transportasi_id UUID NOT NULL REFERENCES public.transportasi(id) ON DELETE CASCADE,
    panen_id UUID NOT NULL REFERENCES public.panen(id) ON DELETE CASCADE,
    berat_kg DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.harga_tbs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tanggal DATE NOT NULL UNIQUE,
    harga_per_kg DECIMAL(15,2) NOT NULL,
    sumber TEXT,
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. KEUANGAN
-- =====================================================

CREATE TABLE IF NOT EXISTS public.kategori_keuangan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    jenis TEXT NOT NULL CHECK (jenis IN ('pendapatan', 'pengeluaran')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transaksi_keuangan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kategori_id UUID REFERENCES public.kategori_keuangan(id),
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    jenis TEXT NOT NULL CHECK (jenis IN ('pendapatan', 'pengeluaran')),
    jumlah DECIMAL(15,2) NOT NULL,
    deskripsi TEXT NOT NULL,
    referensi_id UUID,
    referensi_tabel TEXT,
    bukti_transaksi TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pekerja (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    nik TEXT UNIQUE,
    alamat TEXT,
    telepon TEXT,
    tanggal_masuk DATE,
    jenis_kontrak TEXT DEFAULT 'harian' CHECK (jenis_kontrak IN ('tetap', 'harian', 'borongan')),
    gaji_pokok DECIMAL(15,2) DEFAULT 0,
    status TEXT DEFAULT 'aktif' CHECK (status IN ('aktif', 'tidak_aktif')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.penggajian (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pekerja_id UUID NOT NULL REFERENCES public.pekerja(id) ON DELETE CASCADE,
    periode_mulai DATE NOT NULL,
    periode_selesai DATE NOT NULL,
    hari_kerja INTEGER DEFAULT 0,
    hasil_panen_kg DECIMAL(10,2) DEFAULT 0,
    gaji_pokok DECIMAL(15,2) DEFAULT 0,
    bonus DECIMAL(15,2) DEFAULT 0,
    potongan DECIMAL(15,2) DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'dibayar')),
    tanggal_bayar DATE,
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. NOTIFIKASI & LOG
-- =====================================================

CREATE TABLE IF NOT EXISTS public.notifikasi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    judul TEXT NOT NULL,
    pesan TEXT NOT NULL,
    jenis TEXT DEFAULT 'info' CHECK (jenis IN ('info', 'warning', 'success', 'error')),
    dibaca BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES (idempotent)
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_blok_lahan_status ON public.blok_lahan(status);
CREATE INDEX IF NOT EXISTS idx_panen_tanggal ON public.panen(tanggal);
CREATE INDEX IF NOT EXISTS idx_panen_blok ON public.panen(blok_id);
CREATE INDEX IF NOT EXISTS idx_panen_status ON public.panen(status);
CREATE INDEX IF NOT EXISTS idx_pemupukan_tanggal ON public.pemupukan(tanggal_jadwal);
CREATE INDEX IF NOT EXISTS idx_pemupukan_blok ON public.pemupukan(blok_id);
CREATE INDEX IF NOT EXISTS idx_inventaris_kategori ON public.inventaris(kategori_id);
CREATE INDEX IF NOT EXISTS idx_transaksi_keuangan_tanggal ON public.transaksi_keuangan(tanggal);
CREATE INDEX IF NOT EXISTS idx_transaksi_keuangan_jenis ON public.transaksi_keuangan(jenis);
CREATE INDEX IF NOT EXISTS idx_harga_tbs_tanggal ON public.harga_tbs(tanggal);
CREATE INDEX IF NOT EXISTS idx_notifikasi_user ON public.notifikasi(user_id, dibaca);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON public.activity_log(user_id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blok_lahan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pohon ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kategori_inventaris ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventaris ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaksi_stok ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pemupukan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hama_penyakit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perawatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.panen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transportasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transportasi_panen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.harga_tbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kategori_keuangan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaksi_keuangan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pekerja ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.penggajian ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifikasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (ignore errors)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow authenticated read" ON public.profiles;
  DROP POLICY IF EXISTS "Allow authenticated read" ON public.blok_lahan;
  DROP POLICY IF EXISTS "Allow authenticated read" ON public.pohon;
  DROP POLICY IF EXISTS "Allow authenticated read" ON public.kategori_inventaris;
  DROP POLICY IF EXISTS "Allow authenticated read" ON public.inventaris;
  DROP POLICY IF EXISTS "Allow authenticated read" ON public.transaksi_stok;
  DROP POLICY IF EXISTS "Allow authenticated read" ON public.pemupukan;
  DROP POLICY IF EXISTS "Allow authenticated read" ON public.hama_penyakit;
  DROP POLICY IF EXISTS "Allow authenticated read" ON public.perawatan;
  DROP POLICY IF EXISTS "Allow authenticated read" ON public.panen;
  DROP POLICY IF EXISTS "Allow authenticated read" ON public.transportasi;
  DROP POLICY IF EXISTS "Allow authenticated read" ON public.transportasi_panen;
  DROP POLICY IF EXISTS "Allow authenticated read" ON public.harga_tbs;
  DROP POLICY IF EXISTS "Allow authenticated read" ON public.kategori_keuangan;
  DROP POLICY IF EXISTS "Allow authenticated read" ON public.transaksi_keuangan;
  DROP POLICY IF EXISTS "Allow authenticated read" ON public.pekerja;
  DROP POLICY IF EXISTS "Allow authenticated read" ON public.penggajian;
  DROP POLICY IF EXISTS "Allow authenticated read" ON public.notifikasi;
  DROP POLICY IF EXISTS "Allow authenticated read" ON public.activity_log;
  DROP POLICY IF EXISTS "Allow authenticated write" ON public.blok_lahan;
  DROP POLICY IF EXISTS "Allow authenticated write" ON public.pohon;
  DROP POLICY IF EXISTS "Allow authenticated write" ON public.kategori_inventaris;
  DROP POLICY IF EXISTS "Allow authenticated write" ON public.inventaris;
  DROP POLICY IF EXISTS "Allow authenticated write" ON public.transaksi_stok;
  DROP POLICY IF EXISTS "Allow authenticated write" ON public.pemupukan;
  DROP POLICY IF EXISTS "Allow authenticated write" ON public.hama_penyakit;
  DROP POLICY IF EXISTS "Allow authenticated write" ON public.perawatan;
  DROP POLICY IF EXISTS "Allow authenticated write" ON public.panen;
  DROP POLICY IF EXISTS "Allow authenticated write" ON public.transportasi;
  DROP POLICY IF EXISTS "Allow authenticated write" ON public.transportasi_panen;
  DROP POLICY IF EXISTS "Allow authenticated write" ON public.harga_tbs;
  DROP POLICY IF EXISTS "Allow authenticated write" ON public.kategori_keuangan;
  DROP POLICY IF EXISTS "Allow authenticated write" ON public.transaksi_keuangan;
  DROP POLICY IF EXISTS "Allow authenticated write" ON public.pekerja;
  DROP POLICY IF EXISTS "Allow authenticated write" ON public.penggajian;
  DROP POLICY IF EXISTS "Allow authenticated write" ON public.notifikasi;
  DROP POLICY IF EXISTS "Allow authenticated write" ON public.activity_log;
END $$;

-- Read policies
CREATE POLICY "Allow authenticated read" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON public.blok_lahan FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON public.pohon FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON public.kategori_inventaris FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON public.inventaris FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON public.transaksi_stok FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON public.pemupukan FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON public.hama_penyakit FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON public.perawatan FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON public.panen FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON public.transportasi FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON public.transportasi_panen FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON public.harga_tbs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON public.kategori_keuangan FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON public.transaksi_keuangan FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON public.pekerja FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON public.penggajian FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON public.notifikasi FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Allow authenticated read" ON public.activity_log FOR SELECT TO authenticated USING (true);

-- Write policies
CREATE POLICY "Allow authenticated write" ON public.blok_lahan FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON public.pohon FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON public.kategori_inventaris FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON public.inventaris FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON public.transaksi_stok FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON public.pemupukan FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON public.hama_penyakit FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON public.perawatan FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON public.panen FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON public.transportasi FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON public.transportasi_panen FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON public.harga_tbs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON public.kategori_keuangan FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON public.transaksi_keuangan FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON public.pekerja FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON public.penggajian FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated write" ON public.notifikasi FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Allow authenticated write" ON public.activity_log FOR INSERT TO authenticated WITH CHECK (true);

-- =====================================================
-- FUNCTIONS & TRIGGERS (idempotent)
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_blok_lahan_updated_at ON public.blok_lahan;
CREATE TRIGGER update_blok_lahan_updated_at BEFORE UPDATE ON public.blok_lahan FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_panen_updated_at ON public.panen;
CREATE TRIGGER update_panen_updated_at BEFORE UPDATE ON public.panen FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_inventaris_updated_at ON public.inventaris;
CREATE TRIGGER update_inventaris_updated_at BEFORE UPDATE ON public.inventaris FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_transaksi_keuangan_updated_at ON public.transaksi_keuangan;
CREATE TRIGGER update_transaksi_keuangan_updated_at BEFORE UPDATE ON public.transaksi_keuangan FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Stok update trigger
CREATE OR REPLACE FUNCTION update_stok_inventaris()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.jenis = 'masuk' THEN
        UPDATE public.inventaris SET stok_saat_ini = stok_saat_ini + NEW.jumlah WHERE id = NEW.inventaris_id;
    ELSE
        UPDATE public.inventaris SET stok_saat_ini = stok_saat_ini - NEW.jumlah WHERE id = NEW.inventaris_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_stok ON public.transaksi_stok;
CREATE TRIGGER trigger_update_stok AFTER INSERT ON public.transaksi_stok FOR EACH ROW EXECUTE FUNCTION update_stok_inventaris();

-- Done!
SELECT 'Schema created successfully!' AS result;
