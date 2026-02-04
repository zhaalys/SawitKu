"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  BlokLahan,
  Panen,
  Inventaris,
  Pemupukan,
  HamaPenyakit,
  HargaTBS,
  TransaksiKeuangan,
  Notifikasi,
  BlokLahanInsert,
  PanenInsert,
} from "@/types/database";

const supabase = createClient();

// =====================================================
// BLOK LAHAN HOOKS
// =====================================================

export function useBlokLahan() {
  const [data, setData] = useState<BlokLahan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase.from("blok_lahan") as any)
      .select("*")
      .order("kode");

    if (error) {
      setError(error.message);
    } else {
      setData(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  const create = async (blok: BlokLahanInsert) => {
    const { data, error } = await (supabase.from("blok_lahan") as any)
      .insert(blok)
      .select()
      .single();

    if (error) throw error;
    await fetch();
    return data;
  };

  const update = async (id: string, updates: Partial<BlokLahan>) => {
    const { error } = await (supabase.from("blok_lahan") as any)
      .update(updates)
      .eq("id", id);

    if (error) throw error;
    await fetch();
  };

  const remove = async (id: string) => {
    const { error } = await (supabase.from("blok_lahan") as any)
      .delete()
      .eq("id", id);

    if (error) throw error;
    await fetch();
  };

  return { data, loading, error, refetch: fetch, create, update, remove };
}

// =====================================================
// PANEN HOOKS
// =====================================================

export function usePanen(options?: { blokId?: string; status?: string }) {
  const [data, setData] = useState<(Panen & { blok_lahan?: BlokLahan })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    let query = (supabase.from("panen") as any)
      .select("*, blok_lahan(*)")
      .order("tanggal", { ascending: false });

    if (options?.blokId) {
      query = query.eq("blok_id", options.blokId);
    }
    if (options?.status) {
      query = query.eq("status", options.status);
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
    } else {
      setData(data || []);
    }
    setLoading(false);
  }, [options?.blokId, options?.status]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  const create = async (panen: PanenInsert) => {
    const { data, error } = await (supabase.from("panen") as any)
      .insert(panen)
      .select()
      .single();

    if (error) throw error;
    await fetch();
    return data;
  };

  const approve = async (id: string, userId: string) => {
    const { error } = await (supabase.from("panen") as any)
      .update({
        status: "approved",
        approved_by: userId,
        approved_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;
    await fetch();
  };

  const reject = async (id: string, catatan?: string) => {
    const { error } = await (supabase.from("panen") as any)
      .update({
        status: "rejected",
        catatan,
      })
      .eq("id", id);

    if (error) throw error;
    await fetch();
  };

  return { data, loading, error, refetch: fetch, create, approve, reject };
}

// =====================================================
// INVENTARIS HOOKS
// =====================================================

export function useInventaris(
  jenis?: "pupuk" | "pestisida" | "alat" | "lainnya",
) {
  const [data, setData] = useState<Inventaris[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    let query = (supabase.from("inventaris") as any)
      .select("*, kategori_inventaris(*)")
      .order("nama");

    if (jenis) {
      query = query.eq("kategori_inventaris.jenis", jenis);
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
    } else {
      setData(data || []);
    }
    setLoading(false);
  }, [jenis]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  const addStock = async (
    inventarisId: string,
    jumlah: number,
    keterangan?: string,
  ) => {
    const { error } = await (supabase.from("transaksi_stok") as any).insert({
      inventaris_id: inventarisId,
      jenis: "masuk",
      jumlah,
      keterangan,
    });

    if (error) throw error;
    await fetch();
  };

  const removeStock = async (
    inventarisId: string,
    jumlah: number,
    keterangan?: string,
  ) => {
    const { error } = await (supabase.from("transaksi_stok") as any).insert({
      inventaris_id: inventarisId,
      jenis: "keluar",
      jumlah,
      keterangan,
    });

    if (error) throw error;
    await fetch();
  };

  return { data, loading, error, refetch: fetch, addStock, removeStock };
}

// =====================================================
// PEMUPUKAN HOOKS
// =====================================================

export function usePemupukan(status?: "dijadwalkan" | "selesai" | "tertunda") {
  const [data, setData] = useState<(Pemupukan & { blok_lahan?: BlokLahan })[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    let query = (supabase.from("pemupukan") as any)
      .select("*, blok_lahan(*)")
      .order("tanggal_jadwal", { ascending: true });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
    } else {
      setData(data || []);
    }
    setLoading(false);
  }, [status]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// =====================================================
// HAMA PENYAKIT HOOKS
// =====================================================

export function useHamaPenyakit() {
  const [data, setData] = useState<
    (HamaPenyakit & { blok_lahan?: BlokLahan })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase.from("hama_penyakit") as any)
      .select("*, blok_lahan(*)")
      .order("tanggal_laporan", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setData(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// =====================================================
// HARGA TBS HOOKS
// =====================================================

export function useHargaTBS() {
  const [data, setData] = useState<HargaTBS[]>([]);
  const [latestPrice, setLatestPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await (supabase.from("harga_tbs") as any)
      .select("*")
      .order("tanggal", { ascending: false })
      .limit(30);

    setData(data || []);
    if (data && data.length > 0) {
      setLatestPrice(data[0].harga_per_kg);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  const updatePrice = async (
    tanggal: string,
    harga: number,
    sumber?: string,
  ) => {
    const { error } = await (supabase.from("harga_tbs") as any).upsert({
      tanggal,
      harga_per_kg: harga,
      sumber,
    });

    if (error) throw error;
    await fetch();
  };

  return { data, latestPrice, loading, refetch: fetch, updatePrice };
}

// =====================================================
// KEUANGAN HOOKS
// =====================================================

export function useKeuangan(bulan?: string) {
  const [transactions, setTransactions] = useState<TransaksiKeuangan[]>([]);
  const [summary, setSummary] = useState({
    pendapatan: 0,
    pengeluaran: 0,
    laba: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);

    let query = (supabase.from("transaksi_keuangan") as any)
      .select("*, kategori_keuangan(*)")
      .order("tanggal", { ascending: false });

    if (bulan) {
      const startDate = `${bulan}-01`;
      const endDate = `${bulan}-31`;
      query = query.gte("tanggal", startDate).lte("tanggal", endDate);
    }

    const { data } = await query;
    setTransactions(data || []);

    // Calculate summary
    const pendapatan = (data || [])
      .filter((t: any) => t.jenis === "pendapatan")
      .reduce((sum: any, t: any) => sum + t.jumlah, 0);

    const pengeluaran = (data || [])
      .filter((t: any) => t.jenis === "pengeluaran")
      .reduce((sum: any, t: any) => sum + t.jumlah, 0);

    setSummary({
      pendapatan,
      pengeluaran,
      laba: pendapatan - pengeluaran,
    });

    setLoading(false);
  }, [bulan]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  return { transactions, summary, loading, refetch: fetch };
}

// =====================================================
// NOTIFIKASI HOOKS
// =====================================================

export function useNotifikasi() {
  const [data, setData] = useState<Notifikasi[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await (supabase.from("notifikasi") as any)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    setData(data || []);
    setUnreadCount((data || []).filter((n: any) => !n.dibaca).length);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  const markAsRead = async (id: string) => {
    await (supabase.from("notifikasi") as any)
      .update({ dibaca: true })
      .eq("id", id);
    await fetch();
  };

  const markAllAsRead = async () => {
    await (supabase.from("notifikasi") as any)
      .update({ dibaca: true })
      .eq("dibaca", false);
    await fetch();
  };

  return {
    data,
    unreadCount,
    loading,
    refetch: fetch,
    markAsRead,
    markAllAsRead,
  };
}

// =====================================================
// DASHBOARD STATS HOOKS
// =====================================================

export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalTBS: 0,
    luasLahan: 0,
    jumlahBlok: 0,
    jumlahPohon: 0,
    stokPupuk: 0,
    stokPupukPercentage: 0,
    profitMTD: 0,
    profitMargin: 0,
  });
  const [productionData, setProductionData] = useState<
    { bulan: string; produksi: number }[]
  >([]);
  const [blockStatus, setBlockStatus] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);

    // Get current month TBS production
    const currentMonth = new Date().toISOString().slice(0, 7);
    const { data: panenData } = await (supabase.from("panen") as any)
      .select("berat_kg")
      .eq("status", "approved")
      .gte("tanggal", `${currentMonth}-01`);

    const totalTBS = (panenData || []).reduce(
      (sum: any, p: any) => sum + p.berat_kg,
      0,
    );

    // Get blok lahan stats
    const { data: blokData } = await (
      supabase.from("blok_lahan") as any
    ).select("luas_hektar, jumlah_pohon, status");

    const luasLahan = (blokData || []).reduce(
      (sum: any, b: any) => sum + b.luas_hektar,
      0,
    );
    const jumlahPohon = (blokData || []).reduce(
      (sum: any, b: any) => sum + (b.jumlah_pohon || 0),
      0,
    );

    // Block status distribution
    const statusCounts: Record<string, number> = {};
    (blokData || []).forEach((b: any) => {
      statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
    });

    const statusColors: Record<string, string> = {
      produktif: "hsl(145, 60%, 45%)",
      pemupukan: "hsl(45, 90%, 55%)",
      perawatan: "hsl(200, 70%, 50%)",
      panen: "hsl(30, 80%, 55%)",
      tidak_aktif: "hsl(0, 0%, 50%)",
    };

    setBlockStatus(
      Object.entries(statusCounts).map(([status, count]) => ({
        name:
          status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
        value: count,
        color: statusColors[status] || "hsl(0, 0%, 50%)",
      })),
    );

    // Get pupuk stock
    const { data: inventarisData } = await (supabase.from("inventaris") as any)
      .select("stok_saat_ini, stok_minimum, kategori_inventaris!inner(jenis)")
      .eq("kategori_inventaris.jenis", "pupuk");

    const totalStok = (inventarisData || []).reduce(
      (sum: any, i: any) => sum + i.stok_saat_ini,
      0,
    );
    const totalMinimum = (inventarisData || []).reduce(
      (sum: any, i: any) => sum + i.stok_minimum,
      0,
    );
    const stokPercentage =
      totalMinimum > 0 ? (totalStok / totalMinimum) * 100 : 100;

    // Get profit MTD
    const { data: keuanganData } = await (
      supabase.from("transaksi_keuangan") as any
    )
      .select("jenis, jumlah")
      .gte("tanggal", `${currentMonth}-01`);

    const pendapatan = (keuanganData || [])
      .filter((k: any) => k.jenis === "pendapatan")
      .reduce((sum: any, k: any) => sum + k.jumlah, 0);
    const pengeluaran = (keuanganData || [])
      .filter((k: any) => k.jenis === "pengeluaran")
      .reduce((sum: any, k: any) => sum + k.jumlah, 0);
    const profit = pendapatan - pengeluaran;
    const margin = pendapatan > 0 ? (profit / pendapatan) * 100 : 0;

    // Get monthly production trend (last 12 months)
    const { data: produksiData } = await (
      supabase.from("v_produksi_bulanan") as any
    )
      .select("*")
      .limit(12);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agt",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    setProductionData(
      (produksiData || []).reverse().map((p: any) => ({
        bulan: months[new Date(p.bulan).getMonth()],
        produksi: p.total_berat,
      })),
    );

    setStats({
      totalTBS,
      luasLahan,
      jumlahBlok: (blokData || []).length,
      jumlahPohon,
      stokPupuk: totalStok,
      stokPupukPercentage: stokPercentage,
      profitMTD: profit,
      profitMargin: margin,
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  return { stats, productionData, blockStatus, loading, refetch: fetch };
}
