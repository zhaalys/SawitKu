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
import { Scissors, CheckCircle2 } from "lucide-react";

// Data statis perawatan
const PERAWATAN_DATA = [
  {
    id: 1,
    blok: "A-1",
    tanggal: "2024-01-20",
    jenis: "weeding",
    pekerja: 5,
    biaya: 500000,
    status: "selesai",
  },
  {
    id: 2,
    blok: "A-2",
    tanggal: "2024-01-22",
    jenis: "pruning",
    pekerja: 4,
    biaya: 400000,
    status: "selesai",
  },
  {
    id: 3,
    blok: "B-1",
    tanggal: "2024-01-25",
    jenis: "pembersihan",
    pekerja: 6,
    biaya: 600000,
    status: "selesai",
  },
  {
    id: 4,
    blok: "B-2",
    tanggal: "2024-01-28",
    jenis: "weeding",
    pekerja: 5,
    biaya: 500000,
    status: "selesai",
  },
  {
    id: 5,
    blok: "C-1",
    tanggal: "2024-02-01",
    jenis: "pruning",
    pekerja: 4,
    biaya: 400000,
    status: "dijadwalkan",
  },
];

export default function PerawatanPage() {
  const jenisColors: Record<string, string> = {
    weeding:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    pruning: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    pembersihan:
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    lainnya: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const totalBiaya = PERAWATAN_DATA.reduce((sum, d) => sum + d.biaya, 0);
  const selesai = PERAWATAN_DATA.filter((d) => d.status === "selesai").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Perawatan Lahan</h1>
        <p className="text-muted-foreground">
          Catatan weeding, pruning, dan perawatan lainnya
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Perawatan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{PERAWATAN_DATA.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Selesai</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
              {selesai}
              <CheckCircle2 className="size-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Biaya</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalBiaya)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scissors className="size-5" />
            Riwayat Perawatan
          </CardTitle>
          <CardDescription>
            Daftar kegiatan perawatan lahan sawit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Blok</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead className="text-right">Pekerja</TableHead>
                <TableHead className="text-right">Biaya</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PERAWATAN_DATA.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.blok}</TableCell>
                  <TableCell>
                    {new Date(item.tanggal).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={jenisColors[item.jenis]}
                    >
                      {item.jenis}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.pekerja} orang
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.biaya)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        item.status === "selesai"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {item.status}
                    </Badge>
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
