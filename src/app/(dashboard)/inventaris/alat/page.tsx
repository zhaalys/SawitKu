"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Wrench, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

// Data statis alat kerja perkebunan sawit
const ALAT_KERJA = [
  {
    nama: "Egrek",
    kategori: "panen",
    deskripsi: "Alat potong TBS pohon tinggi",
    total: 15,
    baik: 12,
    rusak: 3,
  },
  {
    nama: "Dodos",
    kategori: "panen",
    deskripsi: "Alat potong TBS pohon rendah",
    total: 20,
    baik: 18,
    rusak: 2,
  },
  {
    nama: "Angkong/Gerobak",
    kategori: "panen",
    deskripsi: "Gerobak angkut TBS",
    total: 8,
    baik: 8,
    rusak: 0,
  },
  {
    nama: "Gancu",
    kategori: "panen",
    deskripsi: "Alat angkat TBS",
    total: 25,
    baik: 23,
    rusak: 2,
  },
  {
    nama: "Tojok",
    kategori: "panen",
    deskripsi: "Alat tusuk untuk angkut TBS",
    total: 30,
    baik: 28,
    rusak: 2,
  },
  {
    nama: "Parang",
    kategori: "perawatan",
    deskripsi: "Alat pangkas pelepah",
    total: 20,
    baik: 17,
    rusak: 3,
  },
  {
    nama: "Cangkul",
    kategori: "perawatan",
    deskripsi: "Alat gali dan bersih gulma",
    total: 15,
    baik: 14,
    rusak: 1,
  },
  {
    nama: "Sprayer",
    kategori: "perawatan",
    deskripsi: "Alat semprot pestisida",
    total: 10,
    baik: 9,
    rusak: 1,
  },
  {
    nama: "Ember Pupuk",
    kategori: "pemupukan",
    deskripsi: "Wadah pupuk",
    total: 50,
    baik: 48,
    rusak: 2,
  },
  {
    nama: "Timbangan",
    kategori: "panen",
    deskripsi: "Alat timbang hasil panen",
    total: 5,
    baik: 5,
    rusak: 0,
  },
];

export default function AlatKerjaPage() {
  const totalAlat = ALAT_KERJA.reduce((sum, a) => sum + a.total, 0);
  const totalBaik = ALAT_KERJA.reduce((sum, a) => sum + a.baik, 0);
  const totalRusak = ALAT_KERJA.reduce((sum, a) => sum + a.rusak, 0);

  const kategoriColors: Record<string, string> = {
    panen: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    perawatan: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    pemupukan:
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alat Kerja</h1>
        <p className="text-muted-foreground">
          Daftar alat kerja perkebunan sawit dan kondisinya
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Jenis Alat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ALAT_KERJA.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Unit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAlat}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Kondisi Baik</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
              {totalBaik}
              <CheckCircle2 className="size-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rusak</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 flex items-center gap-2">
              {totalRusak}
              <XCircle className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="size-5" />
            Stok Alat Kerja
          </CardTitle>
          <CardDescription>
            Daftar alat yang digunakan di perkebunan sawit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Alat</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Baik</TableHead>
                <TableHead className="text-right">Rusak</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ALAT_KERJA.map((item) => (
                <TableRow key={item.nama}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Wrench className="size-4 text-primary" />
                      {item.nama}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.deskripsi}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={kategoriColors[item.kategori]}
                    >
                      {item.kategori}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {item.total}
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    {item.baik}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    {item.rusak}
                  </TableCell>
                  <TableCell>
                    {item.rusak > 0 ? (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="size-3 mr-1" />
                        Ada Rusak
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs"
                      >
                        <CheckCircle2 className="size-3 mr-1" />
                        Semua Baik
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
