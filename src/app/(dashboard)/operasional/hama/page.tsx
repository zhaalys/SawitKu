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
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Bug, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { useHamaPenyakit, useBlokLahan } from "@/hooks/use-supabase";
import { createClient } from "@/lib/supabase/client";

export default function HamaPenyakitPage() {
  const { data, loading, refetch } = useHamaPenyakit();
  const { data: blokList } = useBlokLahan();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    blok_id: "",
    jenis: "",
    tingkat_serangan: "ringan",
    jumlah_pohon_terserang: "",
    tindakan: "",
  });

  const resetForm = () => {
    setFormData({
      blok_id: "",
      jenis: "",
      tingkat_serangan: "ringan",
      jumlah_pohon_terserang: "",
      tindakan: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await (supabase.from("hama_penyakit") as any).insert({
        blok_id: formData.blok_id,
        jenis: formData.jenis,
        tingkat_serangan: formData.tingkat_serangan,
        jumlah_pohon_terserang:
          parseInt(formData.jumlah_pohon_terserang) || null,
        tindakan: formData.tindakan || null,
        status: "dilaporkan",
      });

      if (error) throw error;

      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menyimpan laporan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const seranganColors: Record<string, string> = {
    ringan: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    sedang: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    berat: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const statusColors: Record<string, string> = {
    dilaporkan: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    ditangani:
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    selesai:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hama & Penyakit</h1>
          <p className="text-muted-foreground">
            Laporan dan penanganan serangan hama dan penyakit
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="size-4 mr-2" />
              Laporkan Serangan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Laporan Hama/Penyakit</DialogTitle>
                <DialogDescription>
                  Laporkan serangan hama atau penyakit pada blok lahan
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Blok Lahan *</Label>
                  <Select
                    value={formData.blok_id}
                    onValueChange={(v) =>
                      setFormData({ ...formData, blok_id: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih blok" />
                    </SelectTrigger>
                    <SelectContent>
                      {blokList.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.kode} - {b.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Jenis Hama/Penyakit *</Label>
                  <Input
                    placeholder="Ulat api, Ganoderma, dll"
                    value={formData.jenis}
                    onChange={(e) =>
                      setFormData({ ...formData, jenis: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tingkat Serangan</Label>
                    <Select
                      value={formData.tingkat_serangan}
                      onValueChange={(v) =>
                        setFormData({ ...formData, tingkat_serangan: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ringan">Ringan</SelectItem>
                        <SelectItem value="sedang">Sedang</SelectItem>
                        <SelectItem value="berat">Berat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pohon Terserang</Label>
                    <Input
                      type="number"
                      placeholder="50"
                      value={formData.jumlah_pohon_terserang}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jumlah_pohon_terserang: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tindakan</Label>
                  <Input
                    placeholder="Penyemprotan insektisida"
                    value={formData.tindakan}
                    onChange={(e) =>
                      setFormData({ ...formData, tindakan: e.target.value })
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
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  ) : null}
                  Simpan
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Laporan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Sedang Ditangani</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {data.filter((d) => d.status === "ditangani").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Selesai</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.filter((d) => d.status === "selesai").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="size-5" />
            Daftar Laporan
          </CardTitle>
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
              <Bug className="size-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Tidak Ada Laporan</h3>
              <p className="text-muted-foreground mb-4">
                Belum ada laporan serangan hama atau penyakit
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Blok</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Tingkat</TableHead>
                  <TableHead>Pohon</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.blok_lahan?.kode || "-"}
                    </TableCell>
                    <TableCell>
                      {new Date(item.tanggal_laporan).toLocaleDateString(
                        "id-ID",
                      )}
                    </TableCell>
                    <TableCell>{item.jenis}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          seranganColors[item.tingkat_serangan || "ringan"]
                        }
                      >
                        {item.tingkat_serangan || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.jumlah_pohon_terserang || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={statusColors[item.status]}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
