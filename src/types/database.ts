// TypeScript types generated from Supabase schema
// These types match the database schema in supabase/schema.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: "admin" | "mandor" | "owner";
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: "admin" | "mandor" | "owner";
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: "admin" | "mandor" | "owner";
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      blok_lahan: {
        Row: {
          id: string;
          nama: string;
          kode: string;
          luas_hektar: number;
          jumlah_pohon: number;
          tahun_tanam: number | null;
          jenis_bibit: string | null;
          latitude: number | null;
          longitude: number | null;
          polygon_coordinates: Json | null;
          status:
            | "produktif"
            | "pemupukan"
            | "perawatan"
            | "panen"
            | "tidak_aktif";
          catatan: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nama: string;
          kode: string;
          luas_hektar: number;
          jumlah_pohon?: number;
          tahun_tanam?: number | null;
          jenis_bibit?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          polygon_coordinates?: Json | null;
          status?:
            | "produktif"
            | "pemupukan"
            | "perawatan"
            | "panen"
            | "tidak_aktif";
          catatan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nama?: string;
          kode?: string;
          luas_hektar?: number;
          jumlah_pohon?: number;
          tahun_tanam?: number | null;
          jenis_bibit?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          polygon_coordinates?: Json | null;
          status?:
            | "produktif"
            | "pemupukan"
            | "perawatan"
            | "panen"
            | "tidak_aktif";
          catatan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      pohon: {
        Row: {
          id: string;
          blok_id: string;
          nomor_pohon: string | null;
          tanggal_tanam: string | null;
          jenis_bibit: string | null;
          kondisi: "sehat" | "sakit" | "mati" | "diganti";
          catatan: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          blok_id: string;
          nomor_pohon?: string | null;
          tanggal_tanam?: string | null;
          jenis_bibit?: string | null;
          kondisi?: "sehat" | "sakit" | "mati" | "diganti";
          catatan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          blok_id?: string;
          nomor_pohon?: string | null;
          tanggal_tanam?: string | null;
          jenis_bibit?: string | null;
          kondisi?: "sehat" | "sakit" | "mati" | "diganti";
          catatan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      kategori_inventaris: {
        Row: {
          id: string;
          nama: string;
          jenis: "pupuk" | "pestisida" | "alat" | "lainnya";
          created_at: string;
        };
        Insert: {
          id?: string;
          nama: string;
          jenis: "pupuk" | "pestisida" | "alat" | "lainnya";
          created_at?: string;
        };
        Update: {
          id?: string;
          nama?: string;
          jenis?: "pupuk" | "pestisida" | "alat" | "lainnya";
          created_at?: string;
        };
      };
      inventaris: {
        Row: {
          id: string;
          kategori_id: string | null;
          nama: string;
          satuan: string;
          stok_saat_ini: number;
          stok_minimum: number;
          harga_per_satuan: number;
          lokasi_penyimpanan: string | null;
          catatan: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          kategori_id?: string | null;
          nama: string;
          satuan: string;
          stok_saat_ini?: number;
          stok_minimum?: number;
          harga_per_satuan?: number;
          lokasi_penyimpanan?: string | null;
          catatan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          kategori_id?: string | null;
          nama?: string;
          satuan?: string;
          stok_saat_ini?: number;
          stok_minimum?: number;
          harga_per_satuan?: number;
          lokasi_penyimpanan?: string | null;
          catatan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      transaksi_stok: {
        Row: {
          id: string;
          inventaris_id: string;
          jenis: "masuk" | "keluar";
          jumlah: number;
          tanggal: string;
          keterangan: string | null;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          inventaris_id: string;
          jenis: "masuk" | "keluar";
          jumlah: number;
          tanggal?: string;
          keterangan?: string | null;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          inventaris_id?: string;
          jenis?: "masuk" | "keluar";
          jumlah?: number;
          tanggal?: string;
          keterangan?: string | null;
          user_id?: string | null;
          created_at?: string;
        };
      };
      pemupukan: {
        Row: {
          id: string;
          blok_id: string;
          tanggal_jadwal: string;
          tanggal_realisasi: string | null;
          inventaris_id: string | null;
          dosis_per_pohon: number | null;
          total_digunakan: number | null;
          status: "dijadwalkan" | "selesai" | "tertunda";
          petugas_id: string | null;
          catatan: string | null;
          foto_bukti: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          blok_id: string;
          tanggal_jadwal: string;
          tanggal_realisasi?: string | null;
          inventaris_id?: string | null;
          dosis_per_pohon?: number | null;
          total_digunakan?: number | null;
          status?: "dijadwalkan" | "selesai" | "tertunda";
          petugas_id?: string | null;
          catatan?: string | null;
          foto_bukti?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          blok_id?: string;
          tanggal_jadwal?: string;
          tanggal_realisasi?: string | null;
          inventaris_id?: string | null;
          dosis_per_pohon?: number | null;
          total_digunakan?: number | null;
          status?: "dijadwalkan" | "selesai" | "tertunda";
          petugas_id?: string | null;
          catatan?: string | null;
          foto_bukti?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      hama_penyakit: {
        Row: {
          id: string;
          blok_id: string;
          tanggal_laporan: string;
          jenis: string;
          tingkat_serangan: "ringan" | "sedang" | "berat" | null;
          jumlah_pohon_terserang: number | null;
          tindakan: string | null;
          status: "dilaporkan" | "ditangani" | "selesai";
          pelapor_id: string | null;
          foto_bukti: string[] | null;
          catatan: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          blok_id: string;
          tanggal_laporan?: string;
          jenis: string;
          tingkat_serangan?: "ringan" | "sedang" | "berat" | null;
          jumlah_pohon_terserang?: number | null;
          tindakan?: string | null;
          status?: "dilaporkan" | "ditangani" | "selesai";
          pelapor_id?: string | null;
          foto_bukti?: string[] | null;
          catatan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          blok_id?: string;
          tanggal_laporan?: string;
          jenis?: string;
          tingkat_serangan?: "ringan" | "sedang" | "berat" | null;
          jumlah_pohon_terserang?: number | null;
          tindakan?: string | null;
          status?: "dilaporkan" | "ditangani" | "selesai";
          pelapor_id?: string | null;
          foto_bukti?: string[] | null;
          catatan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      perawatan: {
        Row: {
          id: string;
          blok_id: string;
          tanggal: string;
          jenis_perawatan: "weeding" | "pruning" | "pembersihan" | "lainnya";
          deskripsi: string | null;
          petugas_id: string | null;
          jumlah_pekerja: number | null;
          biaya: number;
          status: "dijadwalkan" | "sedang_dikerjakan" | "selesai";
          foto_bukti: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          blok_id: string;
          tanggal?: string;
          jenis_perawatan: "weeding" | "pruning" | "pembersihan" | "lainnya";
          deskripsi?: string | null;
          petugas_id?: string | null;
          jumlah_pekerja?: number | null;
          biaya?: number;
          status?: "dijadwalkan" | "sedang_dikerjakan" | "selesai";
          foto_bukti?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          blok_id?: string;
          tanggal?: string;
          jenis_perawatan?: "weeding" | "pruning" | "pembersihan" | "lainnya";
          deskripsi?: string | null;
          petugas_id?: string | null;
          jumlah_pekerja?: number | null;
          biaya?: number;
          status?: "dijadwalkan" | "sedang_dikerjakan" | "selesai";
          foto_bukti?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      panen: {
        Row: {
          id: string;
          blok_id: string;
          tanggal: string;
          jumlah_janjang: number;
          berat_kg: number;
          pemanen_id: string | null;
          status: "pending" | "approved" | "rejected";
          approved_by: string | null;
          approved_at: string | null;
          catatan: string | null;
          foto_bukti: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          blok_id: string;
          tanggal?: string;
          jumlah_janjang: number;
          berat_kg: number;
          pemanen_id?: string | null;
          status?: "pending" | "approved" | "rejected";
          approved_by?: string | null;
          approved_at?: string | null;
          catatan?: string | null;
          foto_bukti?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          blok_id?: string;
          tanggal?: string;
          jumlah_janjang?: number;
          berat_kg?: number;
          pemanen_id?: string | null;
          status?: "pending" | "approved" | "rejected";
          approved_by?: string | null;
          approved_at?: string | null;
          catatan?: string | null;
          foto_bukti?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      transportasi: {
        Row: {
          id: string;
          tanggal: string;
          nomor_kendaraan: string | null;
          nama_supir: string | null;
          tujuan_pks: string;
          total_berat_kg: number;
          berat_timbangan_pks: number | null;
          selisih_kg: number | null;
          nomor_surat_jalan: string | null;
          status: "dikirim" | "sampai" | "selesai";
          catatan: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tanggal?: string;
          nomor_kendaraan?: string | null;
          nama_supir?: string | null;
          tujuan_pks: string;
          total_berat_kg: number;
          berat_timbangan_pks?: number | null;
          nomor_surat_jalan?: string | null;
          status?: "dikirim" | "sampai" | "selesai";
          catatan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tanggal?: string;
          nomor_kendaraan?: string | null;
          nama_supir?: string | null;
          tujuan_pks?: string;
          total_berat_kg?: number;
          berat_timbangan_pks?: number | null;
          nomor_surat_jalan?: string | null;
          status?: "dikirim" | "sampai" | "selesai";
          catatan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      transportasi_panen: {
        Row: {
          id: string;
          transportasi_id: string;
          panen_id: string;
          berat_kg: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          transportasi_id: string;
          panen_id: string;
          berat_kg: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          transportasi_id?: string;
          panen_id?: string;
          berat_kg?: number;
          created_at?: string;
        };
      };
      harga_tbs: {
        Row: {
          id: string;
          tanggal: string;
          harga_per_kg: number;
          sumber: string | null;
          catatan: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tanggal: string;
          harga_per_kg: number;
          sumber?: string | null;
          catatan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tanggal?: string;
          harga_per_kg?: number;
          sumber?: string | null;
          catatan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      kategori_keuangan: {
        Row: {
          id: string;
          nama: string;
          jenis: "pendapatan" | "pengeluaran";
          created_at: string;
        };
        Insert: {
          id?: string;
          nama: string;
          jenis: "pendapatan" | "pengeluaran";
          created_at?: string;
        };
        Update: {
          id?: string;
          nama?: string;
          jenis?: "pendapatan" | "pengeluaran";
          created_at?: string;
        };
      };
      transaksi_keuangan: {
        Row: {
          id: string;
          kategori_id: string | null;
          tanggal: string;
          jenis: "pendapatan" | "pengeluaran";
          jumlah: number;
          deskripsi: string;
          referensi_id: string | null;
          referensi_tabel: string | null;
          bukti_transaksi: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          kategori_id?: string | null;
          tanggal?: string;
          jenis: "pendapatan" | "pengeluaran";
          jumlah: number;
          deskripsi: string;
          referensi_id?: string | null;
          referensi_tabel?: string | null;
          bukti_transaksi?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          kategori_id?: string | null;
          tanggal?: string;
          jenis?: "pendapatan" | "pengeluaran";
          jumlah?: number;
          deskripsi?: string;
          referensi_id?: string | null;
          referensi_tabel?: string | null;
          bukti_transaksi?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      pekerja: {
        Row: {
          id: string;
          nama: string;
          nik: string | null;
          alamat: string | null;
          telepon: string | null;
          tanggal_masuk: string | null;
          jenis_kontrak: "tetap" | "harian" | "borongan";
          gaji_pokok: number;
          status: "aktif" | "tidak_aktif";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nama: string;
          nik?: string | null;
          alamat?: string | null;
          telepon?: string | null;
          tanggal_masuk?: string | null;
          jenis_kontrak?: "tetap" | "harian" | "borongan";
          gaji_pokok?: number;
          status?: "aktif" | "tidak_aktif";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nama?: string;
          nik?: string | null;
          alamat?: string | null;
          telepon?: string | null;
          tanggal_masuk?: string | null;
          jenis_kontrak?: "tetap" | "harian" | "borongan";
          gaji_pokok?: number;
          status?: "aktif" | "tidak_aktif";
          created_at?: string;
          updated_at?: string;
        };
      };
      penggajian: {
        Row: {
          id: string;
          pekerja_id: string;
          periode_mulai: string;
          periode_selesai: string;
          hari_kerja: number;
          hasil_panen_kg: number;
          gaji_pokok: number;
          bonus: number;
          potongan: number;
          total_gaji: number;
          status: "pending" | "dibayar";
          tanggal_bayar: string | null;
          catatan: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pekerja_id: string;
          periode_mulai: string;
          periode_selesai: string;
          hari_kerja?: number;
          hasil_panen_kg?: number;
          gaji_pokok?: number;
          bonus?: number;
          potongan?: number;
          status?: "pending" | "dibayar";
          tanggal_bayar?: string | null;
          catatan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pekerja_id?: string;
          periode_mulai?: string;
          periode_selesai?: string;
          hari_kerja?: number;
          hasil_panen_kg?: number;
          gaji_pokok?: number;
          bonus?: number;
          potongan?: number;
          status?: "pending" | "dibayar";
          tanggal_bayar?: string | null;
          catatan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifikasi: {
        Row: {
          id: string;
          user_id: string | null;
          judul: string;
          pesan: string;
          jenis: "info" | "warning" | "success" | "error";
          dibaca: boolean;
          link: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          judul: string;
          pesan: string;
          jenis?: "info" | "warning" | "success" | "error";
          dibaca?: boolean;
          link?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          judul?: string;
          pesan?: string;
          jenis?: "info" | "warning" | "success" | "error";
          dibaca?: boolean;
          link?: string | null;
          created_at?: string;
        };
      };
      activity_log: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          table_name: string | null;
          record_id: string | null;
          old_data: Json | null;
          new_data: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          table_name?: string | null;
          record_id?: string | null;
          old_data?: Json | null;
          new_data?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          table_name?: string | null;
          record_id?: string | null;
          old_data?: Json | null;
          new_data?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: {
      v_produksi_bulanan: {
        Row: {
          bulan: string;
          total_berat: number;
          total_janjang: number;
          jumlah_panen: number;
        };
      };
      v_status_blok: {
        Row: {
          status: string;
          jumlah: number;
          total_luas: number;
          total_pohon: number;
        };
      };
      v_keuangan_bulanan: {
        Row: {
          bulan: string;
          jenis: string;
          total: number;
        };
      };
      v_laba_rugi: {
        Row: {
          bulan: string;
          pendapatan: number;
          pengeluaran: number;
          laba: number;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Convenience type aliases
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type BlokLahan = Database["public"]["Tables"]["blok_lahan"]["Row"];
export type Pohon = Database["public"]["Tables"]["pohon"]["Row"];
export type KategoriInventaris =
  Database["public"]["Tables"]["kategori_inventaris"]["Row"];
export type Inventaris = Database["public"]["Tables"]["inventaris"]["Row"];
export type TransaksiStok =
  Database["public"]["Tables"]["transaksi_stok"]["Row"];
export type Pemupukan = Database["public"]["Tables"]["pemupukan"]["Row"];
export type HamaPenyakit = Database["public"]["Tables"]["hama_penyakit"]["Row"];
export type Perawatan = Database["public"]["Tables"]["perawatan"]["Row"];
export type Panen = Database["public"]["Tables"]["panen"]["Row"];
export type Transportasi = Database["public"]["Tables"]["transportasi"]["Row"];
export type TransportasiPanen =
  Database["public"]["Tables"]["transportasi_panen"]["Row"];
export type HargaTBS = Database["public"]["Tables"]["harga_tbs"]["Row"];
export type KategoriKeuangan =
  Database["public"]["Tables"]["kategori_keuangan"]["Row"];
export type TransaksiKeuangan =
  Database["public"]["Tables"]["transaksi_keuangan"]["Row"];
export type Pekerja = Database["public"]["Tables"]["pekerja"]["Row"];
export type Penggajian = Database["public"]["Tables"]["penggajian"]["Row"];
export type Notifikasi = Database["public"]["Tables"]["notifikasi"]["Row"];
export type ActivityLog = Database["public"]["Tables"]["activity_log"]["Row"];

// Insert types
export type BlokLahanInsert =
  Database["public"]["Tables"]["blok_lahan"]["Insert"];
export type PanenInsert = Database["public"]["Tables"]["panen"]["Insert"];
export type InventarisInsert =
  Database["public"]["Tables"]["inventaris"]["Insert"];
export type PemupukanInsert =
  Database["public"]["Tables"]["pemupukan"]["Insert"];
export type TransaksiKeuanganInsert =
  Database["public"]["Tables"]["transaksi_keuangan"]["Insert"];

// View types
export type ProduksiBulanan =
  Database["public"]["Views"]["v_produksi_bulanan"]["Row"];
export type StatusBlok = Database["public"]["Views"]["v_status_blok"]["Row"];
export type KeuanganBulanan =
  Database["public"]["Views"]["v_keuangan_bulanan"]["Row"];
export type LabaRugi = Database["public"]["Views"]["v_laba_rugi"]["Row"];
