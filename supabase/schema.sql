-- =====================================================
-- SAWITKU DATABASE SCHEMA FOR SUPABASE
-- Palm Oil Management System
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS & AUTHENTICATION
-- =====================================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
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
CREATE TABLE public.blok_lahan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    kode TEXT UNIQUE NOT NULL,
    luas_hektar DECIMAL(10,2) NOT NULL,
    jumlah_pohon INTEGER DEFAULT 0,
    tahun_tanam INTEGER,
    jenis_bibit TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    polygon_coordinates JSONB, -- GeoJSON for map plotting
    status TEXT DEFAULT 'produktif' CHECK (status IN ('produktif', 'pemupukan', 'perawatan', 'panen', 'tidak_aktif')),
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data Pohon per Blok
CREATE TABLE public.pohon (
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

-- Kategori Inventaris
CREATE TABLE public.kategori_inventaris (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    jenis TEXT NOT NULL CHECK (jenis IN ('pupuk', 'pestisida', 'alat', 'lainnya')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventaris Items
CREATE TABLE public.inventaris (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kategori_id UUID REFERENCES public.kategori_inventaris(id),
    nama TEXT NOT NULL,
    satuan TEXT NOT NULL, -- kg, liter, unit, etc.
    stok_saat_ini DECIMAL(10,2) DEFAULT 0,
    stok_minimum DECIMAL(10,2) DEFAULT 0,
    harga_per_satuan DECIMAL(15,2) DEFAULT 0,
    lokasi_penyimpanan TEXT,
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaksi Stok (masuk/keluar)
CREATE TABLE public.transaksi_stok (
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
-- 4. OPERASIONAL LAPANGAN (Field Operations)
-- =====================================================

-- Jadwal Pemupukan
CREATE TABLE public.pemupukan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blok_id UUID NOT NULL REFERENCES public.blok_lahan(id) ON DELETE CASCADE,
    tanggal_jadwal DATE NOT NULL,
    tanggal_realisasi DATE,
    inventaris_id UUID REFERENCES public.inventaris(id), -- pupuk yang digunakan
    dosis_per_pohon DECIMAL(10,2), -- kg per pohon
    total_digunakan DECIMAL(10,2),
    status TEXT DEFAULT 'dijadwalkan' CHECK (status IN ('dijadwalkan', 'selesai', 'tertunda')),
    petugas_id UUID REFERENCES public.profiles(id),
    catatan TEXT,
    foto_bukti TEXT[], -- array of image URLs
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Laporan Hama & Penyakit
CREATE TABLE public.hama_penyakit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blok_id UUID NOT NULL REFERENCES public.blok_lahan(id) ON DELETE CASCADE,
    tanggal_laporan DATE NOT NULL DEFAULT CURRENT_DATE,
    jenis TEXT NOT NULL, -- nama hama/penyakit
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

-- Perawatan Lahan (Weeding, Pruning, etc.)
CREATE TABLE public.perawatan (
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
-- 5. PANEN & PENJUALAN (Harvesting & Sales)
-- =====================================================

-- Catatan Panen
CREATE TABLE public.panen (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blok_id UUID NOT NULL REFERENCES public.blok_lahan(id) ON DELETE CASCADE,
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    jumlah_janjang INTEGER NOT NULL, -- jumlah tandan buah segar
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

-- Transportasi ke PKS
CREATE TABLE public.transportasi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    nomor_kendaraan TEXT,
    nama_supir TEXT,
    tujuan_pks TEXT NOT NULL, -- nama pabrik kelapa sawit
    total_berat_kg DECIMAL(10,2) NOT NULL,
    berat_timbangan_pks DECIMAL(10,2), -- berat di PKS
    selisih_kg DECIMAL(10,2) GENERATED ALWAYS AS (total_berat_kg - COALESCE(berat_timbangan_pks, total_berat_kg)) STORED,
    nomor_surat_jalan TEXT,
    status TEXT DEFAULT 'dikirim' CHECK (status IN ('dikirim', 'sampai', 'selesai')),
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Detail Panen per Transportasi
CREATE TABLE public.transportasi_panen (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transportasi_id UUID NOT NULL REFERENCES public.transportasi(id) ON DELETE CASCADE,
    panen_id UUID NOT NULL REFERENCES public.panen(id) ON DELETE CASCADE,
    berat_kg DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Harga TBS Harian
CREATE TABLE public.harga_tbs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tanggal DATE NOT NULL UNIQUE,
    harga_per_kg DECIMAL(15,2) NOT NULL,
    sumber TEXT, -- dinas, pasar, PKS
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. KEUANGAN (Finance)
-- =====================================================

-- Kategori Keuangan
CREATE TABLE public.kategori_keuangan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama TEXT NOT NULL,
    jenis TEXT NOT NULL CHECK (jenis IN ('pendapatan', 'pengeluaran')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaksi Keuangan
CREATE TABLE public.transaksi_keuangan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kategori_id UUID REFERENCES public.kategori_keuangan(id),
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    jenis TEXT NOT NULL CHECK (jenis IN ('pendapatan', 'pengeluaran')),
    jumlah DECIMAL(15,2) NOT NULL,
    deskripsi TEXT NOT NULL,
    referensi_id UUID, -- bisa merujuk ke panen, transportasi, dll
    referensi_tabel TEXT,
    bukti_transaksi TEXT, -- URL file
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data Pekerja
CREATE TABLE public.pekerja (
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

-- Penggajian
CREATE TABLE public.penggajian (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pekerja_id UUID NOT NULL REFERENCES public.pekerja(id) ON DELETE CASCADE,
    periode_mulai DATE NOT NULL,
    periode_selesai DATE NOT NULL,
    hari_kerja INTEGER DEFAULT 0,
    hasil_panen_kg DECIMAL(10,2) DEFAULT 0,
    gaji_pokok DECIMAL(15,2) DEFAULT 0,
    bonus DECIMAL(15,2) DEFAULT 0,
    potongan DECIMAL(15,2) DEFAULT 0,
    total_gaji DECIMAL(15,2) GENERATED ALWAYS AS (gaji_pokok + bonus - potongan) STORED,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'dibayar')),
    tanggal_bayar DATE,
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. NOTIFIKASI & LOG
-- =====================================================

-- Notifikasi
CREATE TABLE public.notifikasi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    judul TEXT NOT NULL,
    pesan TEXT NOT NULL,
    jenis TEXT DEFAULT 'info' CHECK (jenis IN ('info', 'warning', 'success', 'error')),
    dibaca BOOLEAN DEFAULT FALSE,
    link TEXT, -- URL untuk navigasi
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Log
CREATE TABLE public.activity_log (
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
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_blok_lahan_status ON public.blok_lahan(status);
CREATE INDEX idx_panen_tanggal ON public.panen(tanggal);
CREATE INDEX idx_panen_blok ON public.panen(blok_id);
CREATE INDEX idx_panen_status ON public.panen(status);
CREATE INDEX idx_pemupukan_tanggal ON public.pemupukan(tanggal_jadwal);
CREATE INDEX idx_pemupukan_blok ON public.pemupukan(blok_id);
CREATE INDEX idx_inventaris_kategori ON public.inventaris(kategori_id);
CREATE INDEX idx_transaksi_keuangan_tanggal ON public.transaksi_keuangan(tanggal);
CREATE INDEX idx_transaksi_keuangan_jenis ON public.transaksi_keuangan(jenis);
CREATE INDEX idx_harga_tbs_tanggal ON public.harga_tbs(tanggal);
CREATE INDEX idx_notifikasi_user ON public.notifikasi(user_id, dibaca);
CREATE INDEX idx_activity_log_user ON public.activity_log(user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
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

-- Policies: Allow authenticated users to read all data
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

-- Policies: Allow authenticated users to insert/update/delete
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
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_blok_lahan_updated_at BEFORE UPDATE ON public.blok_lahan FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_pohon_updated_at BEFORE UPDATE ON public.pohon FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_inventaris_updated_at BEFORE UPDATE ON public.inventaris FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_pemupukan_updated_at BEFORE UPDATE ON public.pemupukan FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_hama_penyakit_updated_at BEFORE UPDATE ON public.hama_penyakit FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_perawatan_updated_at BEFORE UPDATE ON public.perawatan FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_panen_updated_at BEFORE UPDATE ON public.panen FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_transportasi_updated_at BEFORE UPDATE ON public.transportasi FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_harga_tbs_updated_at BEFORE UPDATE ON public.harga_tbs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_transaksi_keuangan_updated_at BEFORE UPDATE ON public.transaksi_keuangan FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_pekerja_updated_at BEFORE UPDATE ON public.pekerja FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_penggajian_updated_at BEFORE UPDATE ON public.penggajian FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to update stok inventaris after transaksi
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

CREATE TRIGGER trigger_update_stok
AFTER INSERT ON public.transaksi_stok
FOR EACH ROW EXECUTE FUNCTION update_stok_inventaris();

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), 'mandor');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to create notification for low stock
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stok_saat_ini <= NEW.stok_minimum THEN
        INSERT INTO public.notifikasi (user_id, judul, pesan, jenis)
        SELECT id, 'Stok Menipis: ' || NEW.nama, 
               'Stok ' || NEW.nama || ' tersisa ' || NEW.stok_saat_ini || ' ' || NEW.satuan || '. Segera lakukan pemesanan.',
               'warning'
        FROM public.profiles WHERE role = 'admin';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_low_stock
AFTER UPDATE OF stok_saat_ini ON public.inventaris
FOR EACH ROW EXECUTE FUNCTION check_low_stock();

-- =====================================================
-- VIEWS FOR DASHBOARD
-- =====================================================

-- View: Ringkasan Produksi Bulanan
CREATE OR REPLACE VIEW public.v_produksi_bulanan AS
SELECT 
    DATE_TRUNC('month', tanggal) AS bulan,
    SUM(berat_kg) AS total_berat,
    SUM(jumlah_janjang) AS total_janjang,
    COUNT(*) AS jumlah_panen
FROM public.panen
WHERE status = 'approved'
GROUP BY DATE_TRUNC('month', tanggal)
ORDER BY bulan DESC;

-- View: Status Blok Summary
CREATE OR REPLACE VIEW public.v_status_blok AS
SELECT 
    status,
    COUNT(*) AS jumlah,
    SUM(luas_hektar) AS total_luas,
    SUM(jumlah_pohon) AS total_pohon
FROM public.blok_lahan
GROUP BY status;

-- View: Keuangan Bulanan
CREATE OR REPLACE VIEW public.v_keuangan_bulanan AS
SELECT 
    DATE_TRUNC('month', tanggal) AS bulan,
    jenis,
    SUM(jumlah) AS total
FROM public.transaksi_keuangan
GROUP BY DATE_TRUNC('month', tanggal), jenis
ORDER BY bulan DESC;

-- View: Laba Rugi
CREATE OR REPLACE VIEW public.v_laba_rugi AS
SELECT 
    DATE_TRUNC('month', tanggal) AS bulan,
    SUM(CASE WHEN jenis = 'pendapatan' THEN jumlah ELSE 0 END) AS pendapatan,
    SUM(CASE WHEN jenis = 'pengeluaran' THEN jumlah ELSE 0 END) AS pengeluaran,
    SUM(CASE WHEN jenis = 'pendapatan' THEN jumlah ELSE -jumlah END) AS laba
FROM public.transaksi_keuangan
GROUP BY DATE_TRUNC('month', tanggal)
ORDER BY bulan DESC;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample kategori inventaris
INSERT INTO public.kategori_inventaris (nama, jenis) VALUES
('Pupuk NPK', 'pupuk'),
('Pupuk Urea', 'pupuk'),
('Pupuk KCl', 'pupuk'),
('Herbisida', 'pestisida'),
('Insektisida', 'pestisida'),
('Dodos', 'alat'),
('Egrek', 'alat'),
('Gerobak', 'alat');

-- Insert sample kategori keuangan
INSERT INTO public.kategori_keuangan (nama, jenis) VALUES
('Penjualan TBS', 'pendapatan'),
('Pembelian Pupuk', 'pengeluaran'),
('Gaji Pekerja', 'pengeluaran'),
('Transportasi', 'pengeluaran'),
('Perawatan Alat', 'pengeluaran'),
('Pembelian Alat', 'pengeluaran'),
('Pendapatan Lainnya', 'pendapatan'),
('Pengeluaran Lainnya', 'pengeluaran');

-- Insert sample blok lahan
INSERT INTO public.blok_lahan (nama, kode, luas_hektar, jumlah_pohon, tahun_tanam, jenis_bibit, status, latitude, longitude) VALUES
('Blok Utara 1', 'A-1', 2.5, 350, 2018, 'Tenera DxP', 'produktif', -2.9761, 104.7754),
('Blok Utara 2', 'A-2', 2.0, 280, 2018, 'Tenera DxP', 'produktif', -2.9771, 104.7764),
('Blok Tengah 1', 'B-1', 3.0, 420, 2019, 'Marihat', 'pemupukan', -2.9781, 104.7774),
('Blok Tengah 2', 'B-2', 2.5, 350, 2019, 'Marihat', 'produktif', -2.9791, 104.7784),
('Blok Selatan 1', 'C-1', 3.5, 490, 2020, 'Socfindo', 'perawatan', -2.9801, 104.7794),
('Blok Selatan 2', 'C-2', 2.8, 392, 2020, 'Socfindo', 'panen', -2.9811, 104.7804);

-- Insert sample inventaris
INSERT INTO public.inventaris (kategori_id, nama, satuan, stok_saat_ini, stok_minimum, harga_per_satuan) 
SELECT 
    ki.id,
    CASE 
        WHEN ki.nama = 'Pupuk NPK' THEN 'NPK 16-16-16'
        WHEN ki.nama = 'Pupuk Urea' THEN 'Urea Putih'
        WHEN ki.nama = 'Pupuk KCl' THEN 'KCl Merah'
        WHEN ki.nama = 'Herbisida' THEN 'Roundup 486SL'
        WHEN ki.nama = 'Dodos' THEN 'Dodos Besi'
        ELSE ki.nama
    END,
    CASE WHEN ki.jenis = 'alat' THEN 'unit' ELSE 'kg' END,
    CASE 
        WHEN ki.nama = 'Pupuk NPK' THEN 500
        WHEN ki.nama = 'Pupuk Urea' THEN 300
        WHEN ki.nama = 'Pupuk KCl' THEN 200
        WHEN ki.nama = 'Herbisida' THEN 50
        ELSE 10
    END,
    CASE 
        WHEN ki.nama LIKE 'Pupuk%' THEN 100
        WHEN ki.nama LIKE '%isida' THEN 20
        ELSE 2
    END,
    CASE 
        WHEN ki.nama = 'Pupuk NPK' THEN 12000
        WHEN ki.nama = 'Pupuk Urea' THEN 8000
        WHEN ki.nama = 'Pupuk KCl' THEN 15000
        WHEN ki.nama = 'Herbisida' THEN 85000
        ELSE 150000
    END
FROM public.kategori_inventaris ki;

-- Insert sample harga TBS (last 30 days)
INSERT INTO public.harga_tbs (tanggal, harga_per_kg, sumber)
SELECT 
    CURRENT_DATE - (n || ' days')::interval,
    2500 + (random() * 500)::int,
    'PKS Wilmar'
FROM generate_series(0, 29) AS n;
