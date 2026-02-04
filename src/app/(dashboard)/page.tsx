"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Truck,
  TreePalm,
  Leaf,
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  useDashboardStats,
  useBlokLahan,
  usePanen,
  useKeuangan,
} from "@/hooks/use-supabase";
import { createClient } from "@/lib/supabase/client";

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)} Juta`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toLocaleString("id-ID");
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: blokData, loading: blokLoading } = useBlokLahan();
  const { data: panenData, loading: panenLoading } = usePanen();
  const { summary: keuanganSummary, loading: keuanganLoading } = useKeuangan();
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name);
      }
    };
    fetchUser();
  }, []);

  const loading = blokLoading || panenLoading || keuanganLoading;

  // Calculate stats from real data
  const approvedPanen = panenData.filter((p) => p.status === "approved");
  const totalTBS = approvedPanen.reduce((sum, p) => sum + p.berat_kg, 0);
  const luasLahan = blokData.reduce((sum, b) => sum + b.luas_hektar, 0);
  const jumlahPohon = blokData.reduce(
    (sum, b) => sum + (b.jumlah_pohon || 0),
    0,
  );

  // Block status for pie chart
  const statusCounts: Record<string, number> = {};
  blokData.forEach((b) => {
    statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
  });

  const statusColors: Record<string, string> = {
    produktif: "hsl(145, 60%, 45%)",
    pemupukan: "hsl(45, 90%, 55%)",
    perawatan: "hsl(200, 70%, 50%)",
    panen: "hsl(30, 80%, 55%)",
    tidak_aktif: "hsl(0, 0%, 50%)",
  };

  const blockStatus = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
    value: count,
    color: statusColors[status] || "hsl(0, 0%, 50%)",
  }));

  // Monthly production data
  const monthlyProduction = panenData
    .filter((p) => p.status === "approved")
    .reduce(
      (acc, p) => {
        const month = new Date(p.tanggal).toLocaleDateString("id-ID", {
          month: "short",
        });
        const existing = acc.find((d) => d.bulan === month);
        if (existing) {
          existing.produksi += p.berat_kg;
        } else {
          acc.push({ bulan: month, produksi: p.berat_kg });
        }
        return acc;
      },
      [] as { bulan: string; produksi: number }[],
    );

  // Recent activities from panen
  const recentActivities = panenData.slice(0, 4).map((p) => ({
    id: p.id,
    activity: `Panen ${p.blok_lahan?.kode || "Blok"}`,
    detail: `${p.berat_kg} kg TBS`,
    time: new Date(p.tanggal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    }),
    type: "panen",
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang, {userName}! Berikut ringkasan data perkebunan sawit
          Anda.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total TBS Bulan Ini
                </CardTitle>
                <Truck className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(totalTBS)} kg
                </div>
                <p className="text-xs text-muted-foreground">
                  {approvedPanen.length} kali panen
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Luas Lahan Aktif
                </CardTitle>
                <TreePalm className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {luasLahan.toFixed(1)} Hektar
                </div>
                <p className="text-xs text-muted-foreground">
                  {blokData.length} blok, {formatNumber(jumlahPohon)} pohon
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pendapatan
                </CardTitle>
                <TrendingUp className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  Rp {formatNumber(keuanganSummary.pendapatan)}
                </div>
                <p className="text-xs text-muted-foreground">Bulan ini</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Laba Bersih
                </CardTitle>
                <Wallet className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${keuanganSummary.laba >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  Rp {formatNumber(keuanganSummary.laba)}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {keuanganSummary.laba >= 0 ? (
                    <TrendingUp className="size-3 text-green-500" />
                  ) : (
                    <TrendingDown className="size-3 text-red-500" />
                  )}
                  Margin:{" "}
                  {keuanganSummary.pendapatan > 0
                    ? (
                        (keuanganSummary.laba / keuanganSummary.pendapatan) *
                        100
                      ).toFixed(0)
                    : 0}
                  %
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Trend Produksi TBS</CardTitle>
            <CardDescription>
              Produksi Tandan Buah Segar (kg) per bulan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyProduction.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Belum ada data produksi
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyProduction}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="bulan"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [
                        `${value.toLocaleString("id-ID")} kg`,
                        "Produksi",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="produksi"
                      stroke="hsl(145, 60%, 45%)"
                      strokeWidth={2}
                      dot={{ fill: "hsl(145, 60%, 45%)", strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: "hsl(145, 60%, 35%)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Status Blok Lahan</CardTitle>
            <CardDescription>Distribusi status blok saat ini</CardDescription>
          </CardHeader>
          <CardContent>
            {blockStatus.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Belum ada data blok
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={blockStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={false}
                    >
                      {blockStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity & Info Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Log panen terbaru</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Belum ada aktivitas
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 rounded-lg border p-3"
                  >
                    <div className="size-2 mt-2 rounded-full bg-green-500" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.activity}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.detail}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan</CardTitle>
            <CardDescription>Statistik perkebunan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <TreePalm className="size-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Total Blok</p>
                    <p className="text-xs text-muted-foreground">Terdaftar</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">{blokData.length}</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Truck className="size-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Total Panen</p>
                    <p className="text-xs text-muted-foreground">Tercatat</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">{panenData.length}</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Leaf className="size-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Status Produktif</p>
                    <p className="text-xs text-muted-foreground">Blok aktif</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">
                  {blokData.filter((b) => b.status === "produktif").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
