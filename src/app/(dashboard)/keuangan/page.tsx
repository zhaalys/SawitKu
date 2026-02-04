"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Loader2,
} from "lucide-react";
import { useKeuangan } from "@/hooks/use-supabase";
import { createClient } from "@/lib/supabase/client";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatShortCurrency(value: number) {
  if (value >= 1000000) {
    return `Rp ${(value / 1000000).toFixed(1)}Jt`;
  }
  if (value >= 1000) {
    return `Rp ${(value / 1000).toFixed(0)}rb`;
  }
  return `Rp ${value}`;
}

export default function KeuanganPage() {
  const { transactions, summary, loading, refetch } = useKeuangan();
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split("T")[0],
    jenis: "pendapatan" as "pendapatan" | "pengeluaran",
    jumlah: "",
    deskripsi: "",
  });

  const resetForm = () => {
    setFormData({
      tanggal: new Date().toISOString().split("T")[0],
      jenis: "pendapatan",
      jumlah: "",
      deskripsi: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await (
        supabase.from("transaksi_keuangan") as any
      ).insert({
        tanggal: formData.tanggal,
        jenis: formData.jenis,
        jumlah: parseFloat(formData.jumlah),
        deskripsi: formData.deskripsi,
      });

      if (error) throw error;

      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Gagal menyimpan transaksi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    if (activeTab === "all") return true;
    return t.jenis === activeTab;
  });

  const profitMargin =
    summary.pendapatan > 0
      ? ((summary.laba / summary.pendapatan) * 100).toFixed(1)
      : "0";

  // Generate chart data from transactions
  const chartData = transactions.reduce(
    (acc, t) => {
      const date = new Date(t.tanggal).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });
      const existing = acc.find((d) => d.tanggal === date);
      if (existing) {
        if (t.jenis === "pendapatan") {
          existing.pendapatan += t.jumlah;
        } else {
          existing.pengeluaran += t.jumlah;
        }
      } else {
        acc.push({
          tanggal: date,
          pendapatan: t.jenis === "pendapatan" ? t.jumlah : 0,
          pengeluaran: t.jenis === "pengeluaran" ? t.jumlah : 0,
        });
      }
      return acc;
    },
    [] as { tanggal: string; pendapatan: number; pengeluaran: number }[],
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Keuangan</h1>
          <p className="text-muted-foreground">
            Laporan laba rugi dan arus kas perkebunan
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="size-4 mr-2" />
                Transaksi Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Catat Transaksi</DialogTitle>
                  <DialogDescription>
                    Tambahkan transaksi pendapatan atau pengeluaran
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="jenis">Jenis Transaksi *</Label>
                    <Select
                      value={formData.jenis}
                      onValueChange={(value: "pendapatan" | "pengeluaran") =>
                        setFormData({ ...formData, jenis: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendapatan">
                          <span className="flex items-center gap-2">
                            <ArrowUpRight className="size-4 text-green-600" />
                            Pendapatan
                          </span>
                        </SelectItem>
                        <SelectItem value="pengeluaran">
                          <span className="flex items-center gap-2">
                            <ArrowDownRight className="size-4 text-red-600" />
                            Pengeluaran
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tanggal">Tanggal *</Label>
                    <Input
                      id="tanggal"
                      type="date"
                      value={formData.tanggal}
                      onChange={(e) =>
                        setFormData({ ...formData, tanggal: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jumlah">Jumlah (Rp) *</Label>
                    <Input
                      id="jumlah"
                      type="number"
                      placeholder="15000000"
                      value={formData.jumlah}
                      onChange={(e) =>
                        setFormData({ ...formData, jumlah: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deskripsi">Deskripsi *</Label>
                    <Input
                      id="deskripsi"
                      placeholder="Penjualan TBS ke PKS Wilmar"
                      value={formData.deskripsi}
                      onChange={(e) =>
                        setFormData({ ...formData, deskripsi: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      "Simpan Transaksi"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Pendapatan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.pendapatan)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="size-3 text-green-500" />
              Bulan ini
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Pengeluaran</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summary.pengeluaran)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowDownRight className="size-3 text-red-500" />
              Bulan ini
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Laba Bersih</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${summary.laba >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatCurrency(summary.laba)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              {summary.laba >= 0 ? (
                <TrendingUp className="size-3 text-green-500" />
              ) : (
                <TrendingDown className="size-3 text-red-500" />
              )}
              Margin: {profitMargin}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Transaksi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Bulan ini</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Trend Pendapatan vs Pengeluaran</CardTitle>
            <CardDescription>Berdasarkan transaksi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="tanggal"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => formatShortCurrency(value)}
                  />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(value ?? 0)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="pendapatan"
                    name="Pendapatan"
                    fill="hsl(145, 60%, 45%)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="pengeluaran"
                    name="Pengeluaran"
                    fill="hsl(0, 70%, 55%)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Riwayat Transaksi</CardTitle>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="pendapatan">
                  <ArrowUpRight className="size-3 mr-1" />
                  Pendapatan
                </TabsTrigger>
                <TabsTrigger value="pengeluaran">
                  <ArrowDownRight className="size-3 mr-1" />
                  Pengeluaran
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="size-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Belum Ada Transaksi</h3>
              <p className="text-muted-foreground mb-4">
                Mulai dengan mencatat transaksi pertama
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="size-4 mr-2" />
                Catat Transaksi Pertama
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.tanggal).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.deskripsi}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          transaction.jenis === "pendapatan"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }
                      >
                        {transaction.jenis === "pendapatan" ? (
                          <ArrowUpRight className="size-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="size-3 mr-1" />
                        )}
                        {transaction.jenis.charAt(0).toUpperCase() +
                          transaction.jenis.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        transaction.jenis === "pendapatan"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.jenis === "pendapatan" ? "+" : "-"}
                      {formatCurrency(transaction.jumlah)}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTransactions.length === 0 &&
                  transactions.length > 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Tidak ada transaksi
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
