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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, CheckCircle2, Clock, Wallet } from "lucide-react";

// Data statis gaji pekerja
const PEKERJA_DATA = [
  {
    id: 1,
    nama: "Ahmad Sudirman",
    nik: "3201234567890001",
    jenis: "tetap",
    gaji: 3500000,
    status: "dibayar",
  },
  {
    id: 2,
    nama: "Budi Santoso",
    nik: "3201234567890002",
    jenis: "tetap",
    gaji: 3500000,
    status: "dibayar",
  },
  {
    id: 3,
    nama: "Citra Dewi",
    nik: "3201234567890003",
    jenis: "harian",
    gaji: 2100000,
    status: "dibayar",
  },
  {
    id: 4,
    nama: "Dedi Kurniawan",
    nik: "3201234567890004",
    jenis: "harian",
    gaji: 1950000,
    status: "pending",
  },
  {
    id: 5,
    nama: "Eko Prasetyo",
    nik: "3201234567890005",
    jenis: "borongan",
    gaji: 2800000,
    status: "pending",
  },
  {
    id: 6,
    nama: "Fajar Hidayat",
    nik: "3201234567890006",
    jenis: "tetap",
    gaji: 3500000,
    status: "dibayar",
  },
];

export default function GajiPekerjaPage() {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const totalGaji = PEKERJA_DATA.reduce((sum, d) => sum + d.gaji, 0);
  const dibayar = PEKERJA_DATA.filter((d) => d.status === "dibayar");
  const pending = PEKERJA_DATA.filter((d) => d.status === "pending");
  const totalDibayar = dibayar.reduce((sum, d) => sum + d.gaji, 0);
  const totalPending = pending.reduce((sum, d) => sum + d.gaji, 0);

  const jenisColors: Record<string, string> = {
    tetap: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    harian: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    borongan:
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gaji Pekerja</h1>
        <p className="text-muted-foreground">
          Kelola penggajian pekerja perkebunan
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Pekerja</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {PEKERJA_DATA.length}
              <Users className="size-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Gaji</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalGaji)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Januari 2024</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Sudah Dibayar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
              {formatCurrency(totalDibayar)}
              <CheckCircle2 className="size-5" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dibayar.length} orang
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Belum Dibayar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 flex items-center gap-2">
              {formatCurrency(totalPending)}
              <Clock className="size-5" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {pending.length} orang
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="size-5" />
            Daftar Penggajian
          </CardTitle>
          <CardDescription>Periode Januari 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>NIK</TableHead>
                <TableHead>Jenis Kontrak</TableHead>
                <TableHead className="text-right">Gaji</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PEKERJA_DATA.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.nama}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.nik}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={jenisColors[item.jenis]}
                    >
                      {item.jenis}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.gaji)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        item.status === "dibayar"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }
                    >
                      {item.status === "dibayar" ? (
                        <CheckCircle2 className="size-3 mr-1" />
                      ) : (
                        <Clock className="size-3 mr-1" />
                      )}
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.status === "pending" && (
                      <Button size="sm" variant="outline">
                        Bayar
                      </Button>
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
