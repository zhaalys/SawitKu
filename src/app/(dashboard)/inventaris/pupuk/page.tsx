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
  Edit,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Leaf,
  Package,
  Loader2,
} from "lucide-react";
import { useInventaris } from "@/hooks/use-supabase";
import { createClient } from "@/lib/supabase/client";

export default function InventarisPage() {
  const { data, loading, addStock, removeStock, refetch } = useInventaris();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stockAction, setStockAction] = useState<"masuk" | "keluar">("masuk");
  const [selectedItem, setSelectedItem] = useState<(typeof data)[0] | null>(
    null,
  );

  const [formData, setFormData] = useState({
    nama: "",
    satuan: "kg",
    stok_saat_ini: "",
    stok_minimum: "",
    harga_per_satuan: "",
    kategori: "pupuk",
  });

  const [stockFormData, setStockFormData] = useState({
    jumlah: "",
    keterangan: "",
  });

  const resetForm = () => {
    setFormData({
      nama: "",
      satuan: "kg",
      stok_saat_ini: "",
      stok_minimum: "",
      harga_per_satuan: "",
      kategori: "pupuk",
    });
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Get category ID first
      const { data: catData } = await supabase
        .from("kategori_inventaris")
        .select("id")
        .eq("jenis", formData.kategori)
        .single();

      if (!catData) throw new Error(`Category ${formData.kategori} not found`);

      const { error } = await (supabase.from("inventaris") as any).insert({
        nama: formData.nama,
        satuan: formData.satuan,
        stok_saat_ini: parseFloat(formData.stok_saat_ini) || 0,
        stok_minimum: parseFloat(formData.stok_minimum) || 0,
        harga_per_satuan: parseFloat(formData.harga_per_satuan) || 0,
        kategori_id: (catData as any).id,
      });

      if (error) throw error;

      setIsAddDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Gagal menambah item. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStockTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setIsSubmitting(true);

    try {
      const jumlah = parseFloat(stockFormData.jumlah);
      if (stockAction === "masuk") {
        await addStock(selectedItem.id, jumlah, stockFormData.keterangan);
      } else {
        await removeStock(selectedItem.id, jumlah, stockFormData.keterangan);
      }

      setIsStockDialogOpen(false);
      setStockFormData({ jumlah: "", keterangan: "" });
      setSelectedItem(null);
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Gagal mengupdate stok. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openStockDialog = (
    item: (typeof data)[0],
    action: "masuk" | "keluar",
  ) => {
    setSelectedItem(item);
    setStockAction(action);
    setStockFormData({ jumlah: "", keterangan: "" });
    setIsStockDialogOpen(true);
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = item.nama
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const lowStockItems = data.filter(
    (item) => item.stok_saat_ini <= item.stok_minimum,
  );
  const totalValue = data.reduce(
    (sum, item) => sum + item.stok_saat_ini * item.harga_per_satuan,
    0,
  );

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventaris</h1>
          <p className="text-muted-foreground">
            Kelola stok pupuk, pestisida, dan alat kerja
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="size-4 mr-2" />
              Tambah Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <form onSubmit={handleAddItem}>
              <DialogHeader>
                <DialogTitle>Tambah Item Inventaris</DialogTitle>
                <DialogDescription>
                  Tambahkan item baru ke inventaris
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Item *</Label>
                  <Input
                    id="nama"
                    placeholder="NPK 16-16-16"
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="satuan">Satuan</Label>
                    <Select
                      value={formData.satuan}
                      onValueChange={(value) =>
                        setFormData({ ...formData, satuan: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                        <SelectItem value="liter">Liter</SelectItem>
                        <SelectItem value="unit">Unit</SelectItem>
                        <SelectItem value="botol">Botol</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="harga">Harga/Satuan</Label>
                    <Input
                      id="harga"
                      type="number"
                      placeholder="12000"
                      value={formData.harga_per_satuan}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          harga_per_satuan: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stok">Stok Awal</Label>
                    <Input
                      id="stok"
                      type="number"
                      placeholder="100"
                      value={formData.stok_saat_ini}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stok_saat_ini: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minimum">Stok Minimum</Label>
                    <Input
                      id="minimum"
                      type="number"
                      placeholder="20"
                      value={formData.stok_minimum}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stok_minimum: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
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
                    "Tambah Item"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stock Transaction Dialog */}
      <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <form onSubmit={handleStockTransaction}>
            <DialogHeader>
              <DialogTitle>
                {stockAction === "masuk" ? "Stok Masuk" : "Stok Keluar"}
              </DialogTitle>
              <DialogDescription>{selectedItem?.nama}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="jumlah">
                  Jumlah ({selectedItem?.satuan}) *
                </Label>
                <Input
                  id="jumlah"
                  type="number"
                  placeholder="50"
                  value={stockFormData.jumlah}
                  onChange={(e) =>
                    setStockFormData({
                      ...stockFormData,
                      jumlah: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keterangan">Keterangan</Label>
                <Input
                  id="keterangan"
                  placeholder="Pembelian baru, dll"
                  value={stockFormData.keterangan}
                  onChange={(e) =>
                    setStockFormData({
                      ...stockFormData,
                      keterangan: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsStockDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : stockAction === "masuk" ? (
                  "Tambah Stok"
                ) : (
                  "Kurangi Stok"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Item</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Nilai Inventaris</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalValue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Stok Menipis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {lowStockItems.length}
              {lowStockItems.length > 0 && (
                <Badge variant="destructive" className="text-[10px]">
                  <AlertTriangle className="size-3 mr-1" />
                  Perlu Restock
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Transaksi Hari Ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Daftar Inventaris</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Cari item..."
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
              <Package className="size-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Belum Ada Data Inventaris
              </h3>
              <p className="text-muted-foreground mb-4">
                Mulai dengan menambahkan item pertama
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="size-4 mr-2" />
                Tambah Item Pertama
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Item</TableHead>
                  <TableHead className="text-right">Stok</TableHead>
                  <TableHead className="text-right">Min. Stok</TableHead>
                  <TableHead className="text-right">Harga/Satuan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => {
                  const isLowStock = item.stok_saat_ini <= item.stok_minimum;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nama}</TableCell>
                      <TableCell className="text-right">
                        {item.stok_saat_ini} {item.satuan}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {item.stok_minimum} {item.satuan}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.harga_per_satuan)}
                      </TableCell>
                      <TableCell>
                        {isLowStock ? (
                          <Badge variant="destructive" className="text-[10px]">
                            <AlertTriangle className="size-3 mr-1" />
                            Menipis
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          >
                            Cukup
                          </Badge>
                        )}
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
                              onClick={() => openStockDialog(item, "masuk")}
                            >
                              <ArrowUp className="size-4 mr-2" />
                              Stok Masuk
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openStockDialog(item, "keluar")}
                            >
                              <ArrowDown className="size-4 mr-2" />
                              Stok Keluar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
