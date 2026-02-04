"use client";

import { useState, useEffect } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Check,
  X,
  Truck,
  Calendar,
  Loader2,
} from "lucide-react";
import { usePanen, useBlokLahan } from "@/hooks/use-supabase";
import { createClient } from "@/lib/supabase/client";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export default function PanenPage() {
  const { data, loading, create, approve, reject, refetch } = usePanen();
  const { data: blokList } = useBlokLahan();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    blok_id: "",
    tanggal: new Date().toISOString().split("T")[0],
    jumlah_janjang: "",
    berat_kg: "",
    catatan: "",
  });

  const resetForm = () => {
    setFormData({
      blok_id: "",
      tanggal: new Date().toISOString().split("T")[0],
      jumlah_janjang: "",
      berat_kg: "",
      catatan: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await create({
        blok_id: formData.blok_id,
        tanggal: formData.tanggal,
        jumlah_janjang: parseInt(formData.jumlah_janjang),
        berat_kg: parseFloat(formData.berat_kg),
        catatan: formData.catatan || null,
        status: "pending",
      });

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving panen:", error);
      alert("Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (id: string) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await approve(id, user.id);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Alasan penolakan (opsional):");
    await reject(id, reason || undefined);
  };

  const filteredData = data.filter((panen) => {
    const matchesSearch =
      (panen.blok_lahan?.kode || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (panen.blok_lahan?.nama || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === "all" || panen.status === activeTab;

    return matchesSearch && matchesTab;
  });

  const totalBerat = data
    .filter((p) => p.status === "approved")
    .reduce((sum, p) => sum + p.berat_kg, 0);

  const totalJanjang = data
    .filter((p) => p.status === "approved")
    .reduce((sum, p) => sum + p.jumlah_janjang, 0);

  const pendingCount = data.filter((p) => p.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catatan Panen</h1>
          <p className="text-muted-foreground">
            Kelola data hasil panen TBS (Tandan Buah Segar)
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="size-4 mr-2" />
              Input Panen
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Input Panen Baru</DialogTitle>
                <DialogDescription>
                  Catat hasil panen TBS dari blok lahan
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="blok">Blok Lahan *</Label>
                  <Select
                    value={formData.blok_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, blok_id: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih blok" />
                    </SelectTrigger>
                    <SelectContent>
                      {blokList.map((blok) => (
                        <SelectItem key={blok.id} value={blok.id}>
                          {blok.kode} - {blok.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggal">Tanggal Panen *</Label>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="janjang">Jumlah Janjang *</Label>
                    <Input
                      id="janjang"
                      type="number"
                      placeholder="150"
                      value={formData.jumlah_janjang}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jumlah_janjang: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="berat">Berat (kg) *</Label>
                    <Input
                      id="berat"
                      type="number"
                      step="0.1"
                      placeholder="750"
                      value={formData.berat_kg}
                      onChange={(e) =>
                        setFormData({ ...formData, berat_kg: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="catatan">Catatan</Label>
                  <Input
                    id="catatan"
                    placeholder="Catatan tambahan (opsional)"
                    value={formData.catatan}
                    onChange={(e) =>
                      setFormData({ ...formData, catatan: e.target.value })
                    }
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
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.blok_id}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Panen"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Panen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Berat (Approved)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBerat.toLocaleString("id-ID")} kg
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Janjang</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalJanjang.toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Menunggu Approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {pendingCount}
              {pendingCount > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-800"
                >
                  Pending
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Daftar Panen</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Cari blok..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Disetujui</TabsTrigger>
                <TabsTrigger value="rejected">Ditolak</TabsTrigger>
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
          ) : data.length === 0 ? (
            <div className="text-center py-12">
              <Truck className="size-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Belum Ada Data Panen</h3>
              <p className="text-muted-foreground mb-4">
                Mulai dengan mencatat hasil panen pertama
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="size-4 mr-2" />
                Input Panen Pertama
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Blok</TableHead>
                  <TableHead className="text-right">Janjang</TableHead>
                  <TableHead className="text-right">Berat (kg)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((panen) => (
                  <TableRow key={panen.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        {new Date(panen.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Truck className="size-4 text-primary" />
                        <div>
                          <div className="font-medium">
                            {panen.blok_lahan?.kode || "-"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {panen.blok_lahan?.nama || "-"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {panen.jumlah_janjang}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {panen.berat_kg.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={statusColors[panen.status] || ""}
                      >
                        {panen.status === "pending"
                          ? "Pending"
                          : panen.status === "approved"
                            ? "Disetujui"
                            : "Ditolak"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {panen.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                className="text-green-600"
                                onClick={() => handleApprove(panen.id)}
                              >
                                <Check className="size-4 mr-2" />
                                Setujui
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleReject(panen.id)}
                              >
                                <X className="size-4 mr-2" />
                                Tolak
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && data.length > 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Tidak ada data yang ditemukan
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
