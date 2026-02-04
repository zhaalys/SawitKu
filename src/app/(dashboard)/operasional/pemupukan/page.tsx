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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Check,
  Calendar,
  Leaf,
  TreePalm,
} from "lucide-react";
import { usePemupukan } from "@/hooks/use-supabase";

const statusColors: Record<string, string> = {
  dijadwalkan: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  selesai: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  tertunda: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
};

// Sample data for demo mode
const samplePemupukanData = [
  {
    id: "1",
    blok_lahan: { kode: "A-1", nama: "Blok Utara 1" },
    tanggal_jadwal: "2026-02-05",
    status: "dijadwalkan" as const,
    dosis_per_pohon: 0.5,
    total_digunakan: 175,
  },
  {
    id: "2",
    blok_lahan: { kode: "A-2", nama: "Blok Utara 2" },
    tanggal_jadwal: "2026-02-08",
    status: "dijadwalkan" as const,
    dosis_per_pohon: 0.5,
    total_digunakan: 140,
  },
  {
    id: "3",
    blok_lahan: { kode: "B-1", nama: "Blok Tengah 1" },
    tanggal_jadwal: "2026-02-01",
    tanggal_realisasi: "2026-02-01",
    status: "selesai" as const,
    dosis_per_pohon: 0.5,
    total_digunakan: 210,
  },
  {
    id: "4",
    blok_lahan: { kode: "B-2", nama: "Blok Tengah 2" },
    tanggal_jadwal: "2026-02-03",
    status: "tertunda" as const,
    dosis_per_pohon: 0.5,
    total_digunakan: 175,
  },
  {
    id: "5",
    blok_lahan: { kode: "C-1", nama: "Blok Selatan 1" },
    tanggal_jadwal: "2026-01-28",
    tanggal_realisasi: "2026-01-29",
    status: "selesai" as const,
    dosis_per_pohon: 0.5,
    total_digunakan: 245,
  },
];

export default function PemupukanPage() {
  const { data, loading } = usePemupukan();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Use sample data if no data from Supabase
  const displayData = data.length > 0 ? data : samplePemupukanData;

  const filteredData = displayData.filter((item) => {
    const matchesSearch =
      (item.blok_lahan?.kode || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (item.blok_lahan?.nama || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || item.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const dijadwalkanCount = displayData.filter(
    (p) => p.status === "dijadwalkan",
  ).length;
  const selesaiCount = displayData.filter((p) => p.status === "selesai").length;
  const totalPupuk = displayData
    .filter((p) => p.status === "selesai")
    .reduce((sum, p) => sum + (p.total_digunakan || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Jadwal Pemupukan
          </h1>
          <p className="text-muted-foreground">
            Kelola jadwal dan realisasi pemupukan per blok
          </p>
        </div>
        <Button>
          <Plus className="size-4 mr-2" />
          Buat Jadwal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Jadwal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Akan Datang</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {dijadwalkanCount}
              {dijadwalkanCount > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  Dijadwalkan
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Selesai Bulan Ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selesaiCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pupuk Digunakan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPupuk.toLocaleString("id-ID")} kg
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Daftar Pemupukan</CardTitle>
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
                <TabsTrigger value="dijadwalkan">Dijadwalkan</TabsTrigger>
                <TabsTrigger value="selesai">Selesai</TabsTrigger>
                <TabsTrigger value="tertunda">Tertunda</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Blok</TableHead>
                <TableHead>Jadwal</TableHead>
                <TableHead>Realisasi</TableHead>
                <TableHead className="text-right">Dosis/Pohon</TableHead>
                <TableHead className="text-right">Total (kg)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TreePalm className="size-4 text-primary" />
                      <div>
                        <div className="font-medium">
                          {item.blok_lahan?.kode}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.blok_lahan?.nama}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-muted-foreground" />
                      {new Date(item.tanggal_jadwal).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.tanggal_realisasi ? (
                      new Date(item.tanggal_realisasi).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                        },
                      )
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.dosis_per_pohon} kg
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {(item.total_digunakan || 0).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusColors[item.status] || ""}
                    >
                      {item.status === "dijadwalkan"
                        ? "Dijadwalkan"
                        : item.status === "selesai"
                          ? "Selesai"
                          : "Tertunda"}
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
                        <DropdownMenuItem>
                          <Eye className="size-4 mr-2" />
                          Detail
                        </DropdownMenuItem>
                        {item.status === "dijadwalkan" && (
                          <DropdownMenuItem className="text-green-600">
                            <Check className="size-4 mr-2" />
                            Tandai Selesai
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Tidak ada data yang ditemukan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
