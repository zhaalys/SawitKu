"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  Truck,
  Wallet,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

const LAPORAN_TERSEDIA = [
  {
    title: "Laporan Produksi Bulanan",
    description: "Ringkasan produksi TBS per blok selama 1 bulan",
    icon: Truck,
    periode: "Januari 2024",
  },
  {
    title: "Laporan Keuangan",
    description: "Laba rugi dan arus kas perkebunan",
    icon: Wallet,
    periode: "Januari 2024",
  },
  {
    title: "Laporan Pemupukan",
    description: "Realisasi pemupukan dan penggunaan pupuk",
    icon: Calendar,
    periode: "Januari 2024",
  },
  {
    title: "Laporan Inventaris",
    description: "Stok barang dan transaksi keluar masuk",
    icon: BarChart3,
    periode: "Januari 2024",
  },
];

export default function LaporanPage() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string | null>(null);

  const handleDownload = (title: string, format: string) => {
    const id = `${title}-${format}`;
    setDownloading(id);

    // Simulate download delay
    setTimeout(() => {
      setDownloading(null);
      setCompleted(id);

      // Reset success state after 3 seconds
      setTimeout(() => {
        setCompleted(null);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Laporan</h1>
        <p className="text-muted-foreground">
          Download laporan perkebunan dalam format PDF/Excel
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {LAPORAN_TERSEDIA.map((laporan) => (
          <Card key={laporan.title}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <laporan.icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{laporan.title}</CardTitle>
                    <CardDescription>{laporan.description}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Periode: {laporan.periode}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={downloading === `${laporan.title}-pdf`}
                    onClick={() => handleDownload(laporan.title, "pdf")}
                  >
                    {downloading === `${laporan.title}-pdf` ? (
                      <Loader2 className="size-4 mr-2 animate-spin" />
                    ) : completed === `${laporan.title}-pdf` ? (
                      <CheckCircle2 className="size-4 mr-2 text-green-500" />
                    ) : (
                      <Download className="size-4 mr-2" />
                    )}
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={downloading === `${laporan.title}-excel`}
                    onClick={() => handleDownload(laporan.title, "excel")}
                  >
                    {downloading === `${laporan.title}-excel` ? (
                      <Loader2 className="size-4 mr-2 animate-spin" />
                    ) : completed === `${laporan.title}-excel` ? (
                      <CheckCircle2 className="size-4 mr-2 text-green-500" />
                    ) : (
                      <Download className="size-4 mr-2" />
                    )}
                    Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            Riwayat Laporan
          </CardTitle>
          <CardDescription>Laporan yang pernah di-generate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="size-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada laporan yang di-generate</p>
            <p className="text-sm mt-1">
              Klik tombol Download untuk membuat laporan
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
