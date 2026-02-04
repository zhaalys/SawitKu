"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  MapPin,
  TreePalm,
  Loader2,
} from "lucide-react";
import { useBlokLahan } from "@/hooks/use-supabase";

const statusOptions = [
  { value: "produktif", label: "Produktif" },
  { value: "pemupukan", label: "Pemupukan" },
  { value: "perawatan", label: "Perawatan" },
  { value: "panen", label: "Panen" },
  { value: "tidak_aktif", label: "Tidak Aktif" },
];

const statusColors: Record<string, string> = {
  produktif:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pemupukan:
    "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  perawatan: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  panen:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  tidak_aktif: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export default function LahanPage() {
  const { data, loading, create, update, remove, refetch } = useBlokLahan();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    luas_hektar: "",
    jumlah_pohon: "",
    tahun_tanam: "",
    jenis_bibit: "",
    status: "produktif",
  });

  const resetForm = () => {
    setFormData({
      kode: "",
      nama: "",
      luas_hektar: "",
      jumlah_pohon: "",
      tahun_tanam: "",
      jenis_bibit: "",
      status: "produktif",
    });
    setEditingId(null);
  };

  const handleOpenDialog = (blok?: (typeof data)[0]) => {
    if (blok) {
      setEditingId(blok.id);
      setFormData({
        kode: blok.kode,
        nama: blok.nama,
        luas_hektar: blok.luas_hektar.toString(),
        jumlah_pohon: blok.jumlah_pohon?.toString() || "",
        tahun_tanam: blok.tahun_tanam?.toString() || "",
        jenis_bibit: blok.jenis_bibit || "",
        status: blok.status,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        kode: formData.kode,
        nama: formData.nama,
        luas_hektar: parseFloat(formData.luas_hektar),
        jumlah_pohon: formData.jumlah_pohon
          ? parseInt(formData.jumlah_pohon)
          : null,
        tahun_tanam: formData.tahun_tanam
          ? parseInt(formData.tahun_tanam)
          : null,
        jenis_bibit: formData.jenis_bibit || null,
        status: formData.status as
          | "produktif"
          | "pemupukan"
          | "perawatan"
          | "panen"
          | "tidak_aktif",
      };

      if (editingId) {
        await update(editingId, payload);
      } else {
        await create(payload);
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error
          ? error.message
          : (error as { message?: string })?.message || JSON.stringify(error);
      console.error("Error saving blok:", errMsg);

      // User-friendly error messages
      if (errMsg.includes("duplicate key") && errMsg.includes("kode")) {
        alert(
          `Kode blok "${formData.kode}" sudah digunakan. Silakan gunakan kode yang berbeda.`,
        );
      } else {
        alert(`Gagal menyimpan data: ${errMsg}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus blok ini?")) return;

    try {
      await remove(id);
    } catch (error) {
      console.error("Error deleting blok:", error);
      alert("Gagal menghapus data.");
    }
  };

  const filteredData = data.filter(
    (blok) =>
      blok.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blok.kode.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalLuas = data.reduce((sum, b) => sum + b.luas_hektar, 0);
  const totalPohon = data.reduce((sum, b) => sum + (b.jumlah_pohon || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Lahan</h1>
          <p className="text-muted-foreground">
            Kelola data blok lahan dan pohon sawit Anda
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/lahan/peta">
              <MapPin className="size-4 mr-2" />
              Peta Lahan
            </Link>
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="size-4 mr-2" />
                Tambah Blok
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Edit Blok Lahan" : "Tambah Blok Baru"}
                  </DialogTitle>
                  <DialogDescription>
                    Isi data blok lahan dengan lengkap
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="kode">Kode Blok *</Label>
                      <Input
                        id="kode"
                        placeholder="A-1"
                        value={formData.kode}
                        onChange={(e) =>
                          setFormData({ ...formData, kode: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="luas">Luas (Ha) *</Label>
                      <Input
                        id="luas"
                        type="number"
                        step="0.01"
                        placeholder="2.5"
                        value={formData.luas_hektar}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            luas_hektar: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nama">Nama Blok *</Label>
                    <Input
                      id="nama"
                      placeholder="Blok Utara 1"
                      value={formData.nama}
                      onChange={(e) =>
                        setFormData({ ...formData, nama: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pohon">Jumlah Pohon</Label>
                      <Input
                        id="pohon"
                        type="number"
                        placeholder="350"
                        value={formData.jumlah_pohon}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            jumlah_pohon: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tahun">Tahun Tanam</Label>
                      <Input
                        id="tahun"
                        type="number"
                        placeholder="2020"
                        value={formData.tahun_tanam}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tahun_tanam: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bibit">Jenis Bibit</Label>
                      <Input
                        id="bibit"
                        placeholder="Tenera DxP"
                        value={formData.jenis_bibit}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            jenis_bibit: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
                    ) : editingId ? (
                      "Simpan Perubahan"
                    ) : (
                      "Tambah Blok"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Blok</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Luas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLuas.toFixed(1)} Ha</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Pohon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPohon.toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rata-rata/Blok</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.length > 0 ? Math.round(totalPohon / data.length) : 0} pohon
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Daftar Blok Lahan</CardTitle>
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
              <TreePalm className="size-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Belum Ada Data Blok</h3>
              <p className="text-muted-foreground mb-4">
                Mulai dengan menambahkan blok lahan pertama Anda
              </p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="size-4 mr-2" />
                Tambah Blok Pertama
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Blok</TableHead>
                  <TableHead className="text-right">Luas (Ha)</TableHead>
                  <TableHead className="text-right">Pohon</TableHead>
                  <TableHead>Tahun Tanam</TableHead>
                  <TableHead>Bibit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((blok) => (
                  <TableRow key={blok.id}>
                    <TableCell className="font-medium">{blok.kode}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TreePalm className="size-4 text-primary" />
                        {blok.nama}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {blok.luas_hektar}
                    </TableCell>
                    <TableCell className="text-right">
                      {blok.jumlah_pohon?.toLocaleString("id-ID") || "-"}
                    </TableCell>
                    <TableCell>{blok.tahun_tanam || "-"}</TableCell>
                    <TableCell>{blok.jenis_bibit || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={statusColors[blok.status] || ""}
                      >
                        {blok.status.charAt(0).toUpperCase() +
                          blok.status.slice(1).replace("_", " ")}
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
                          <DropdownMenuItem
                            onClick={() => handleOpenDialog(blok)}
                          >
                            <Edit className="size-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(blok.id)}
                          >
                            <Trash2 className="size-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && data.length > 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
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
