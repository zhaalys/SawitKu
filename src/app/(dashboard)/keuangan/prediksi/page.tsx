"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FileText, TrendingUp, Calendar } from "lucide-react";

// Data prediksi panen
const PREDIKSI_DATA = [
  { bulan: "Feb 2024", blok: "A-1", estimasi_kg: 2500 },
  { bulan: "Feb 2024", blok: "A-2", estimasi_kg: 2200 },
  { bulan: "Feb 2024", blok: "B-1", estimasi_kg: 2800 },
  { bulan: "Mar 2024", blok: "A-1", estimasi_kg: 2600 },
  { bulan: "Mar 2024", blok: "A-2", estimasi_kg: 2400 },
  { bulan: "Mar 2024", blok: "B-1", estimasi_kg: 3000 },
];

const chartData = [
  { bulan: "Feb", estimasi: 7500 },
  { bulan: "Mar", estimasi: 8000 },
  { bulan: "Apr", estimasi: 8500 },
  { bulan: "Mei", estimasi: 9000 },
  { bulan: "Jun", estimasi: 8800 },
];

export default function PrediksiPanenPage() {
  const formatNumber = (value: number) => value.toLocaleString("id-ID");

  const totalPrediksi = PREDIKSI_DATA.reduce(
    (sum, d) => sum + d.estimasi_kg,
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prediksi Panen</h1>
        <p className="text-muted-foreground">
          Estimasi hasil panen berdasarkan data historis
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Prediksi Bulan Ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(7500)} kg</div>
            <p className="text-xs text-muted-foreground mt-1">Februari 2024</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Prediksi Bulan Depan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
              {formatNumber(8000)} kg
              <TrendingUp className="size-5" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +6.7% dari bulan ini
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Akurasi Prediksi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Berdasarkan 6 bulan terakhir
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Proyeksi Panen 5 Bulan</CardTitle>
          <CardDescription>Estimasi produksi TBS per bulan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="bulan"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: any) => [
                    `${formatNumber(value ?? 0)} kg`,
                    "Estimasi",
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="estimasi"
                  fill="hsl(145, 60%, 45%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            Detail Prediksi per Blok
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bulan</TableHead>
                <TableHead>Blok</TableHead>
                <TableHead className="text-right">Estimasi (kg)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PREDIKSI_DATA.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.bulan}</TableCell>
                  <TableCell className="font-medium">{item.blok}</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(item.estimasi_kg)}
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
