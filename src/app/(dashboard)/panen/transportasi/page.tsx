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
import { Truck, CheckCircle2, Clock, MapPin } from "lucide-react";

// Data statis transportasi
const TRANSPORTASI_DATA = [
  {
    id: 1,
    tanggal: "2024-01-28",
    kendaraan: "B 1234 CD",
    supir: "Budi",
    pks: "PKS Wilmar",
    berat: 5200,
    status: "selesai",
  },
  {
    id: 2,
    tanggal: "2024-01-27",
    kendaraan: "B 5678 EF",
    supir: "Ahmad",
    pks: "PKS Sinar Mas",
    berat: 4800,
    status: "selesai",
  },
  {
    id: 3,
    tanggal: "2024-01-26",
    kendaraan: "B 1234 CD",
    supir: "Budi",
    pks: "PKS Wilmar",
    berat: 5500,
    status: "selesai",
  },
  {
    id: 4,
    tanggal: "2024-01-25",
    kendaraan: "B 9012 GH",
    supir: "Dedi",
    pks: "PKS Musim Mas",
    berat: 4200,
    status: "selesai",
  },
  {
    id: 5,
    tanggal: "2024-01-29",
    kendaraan: "B 5678 EF",
    supir: "Ahmad",
    pks: "PKS Wilmar",
    berat: 5000,
    status: "dikirim",
  },
];

export default function TransportasiPage() {
  const formatNumber = (value: number) => value.toLocaleString("id-ID");

  const totalBerat = TRANSPORTASI_DATA.reduce((sum, d) => sum + d.berat, 0);
  const selesai = TRANSPORTASI_DATA.filter(
    (d) => d.status === "selesai",
  ).length;
  const enRoute = TRANSPORTASI_DATA.filter(
    (d) => d.status === "dikirim",
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transportasi</h1>
        <p className="text-muted-foreground">
          Pengiriman TBS ke Pabrik Kelapa Sawit (PKS)
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Pengiriman</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{TRANSPORTASI_DATA.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Berat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(totalBerat)} kg
            </div>
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
            <CardDescription>Dalam Perjalanan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              {enRoute}
              <Clock className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="size-5" />
            Riwayat Pengiriman
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Kendaraan</TableHead>
                <TableHead>Supir</TableHead>
                <TableHead>Tujuan PKS</TableHead>
                <TableHead className="text-right">Berat (kg)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TRANSPORTASI_DATA.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {new Date(item.tanggal).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.kendaraan}
                  </TableCell>
                  <TableCell>{item.supir}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="size-3 text-muted-foreground" />
                      {item.pks}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatNumber(item.berat)}
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
                      {item.status === "selesai" ? (
                        <CheckCircle2 className="size-3 mr-1" />
                      ) : (
                        <Clock className="size-3 mr-1" />
                      )}
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
