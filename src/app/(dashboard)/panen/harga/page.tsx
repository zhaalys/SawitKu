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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

// Data statis harga TBS
const HARGA_DATA = [
  { tanggal: "2024-01-01", harga: 2100, sumber: "PTPN" },
  { tanggal: "2024-01-08", harga: 2150, sumber: "PTPN" },
  { tanggal: "2024-01-15", harga: 2200, sumber: "PTPN" },
  { tanggal: "2024-01-22", harga: 2180, sumber: "PTPN" },
  { tanggal: "2024-01-29", harga: 2250, sumber: "PTPN" },
  { tanggal: "2024-02-05", harga: 2300, sumber: "PTPN" },
];

const chartData = HARGA_DATA.map((d) => ({
  tanggal: new Date(d.tanggal).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
  }),
  harga: d.harga,
}));

export default function HargaTBSPage() {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const latestPrice = HARGA_DATA[HARGA_DATA.length - 1]?.harga || 0;
  const previousPrice = HARGA_DATA[HARGA_DATA.length - 2]?.harga || 0;
  const priceChange = latestPrice - previousPrice;
  const priceChangePercent =
    previousPrice > 0 ? ((priceChange / previousPrice) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Harga TBS</h1>
        <p className="text-muted-foreground">
          Harga Tandan Buah Segar mingguan dari PTPN
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Harga Terkini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(latestPrice)}/kg
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Update: {HARGA_DATA[HARGA_DATA.length - 1]?.tanggal}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Perubahan</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold flex items-center gap-2 ${priceChange >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {priceChange >= 0 ? (
                <TrendingUp className="size-5" />
              ) : (
                <TrendingDown className="size-5" />
              )}
              {priceChange >= 0 ? "+" : ""}
              {formatCurrency(priceChange)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {priceChange >= 0 ? "+" : ""}
              {priceChangePercent}% dari minggu lalu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Sumber</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PTPN</div>
            <p className="text-xs text-muted-foreground mt-1">
              Harga acuan mingguan
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trend Harga TBS</CardTitle>
          <CardDescription>Pergerakan harga 6 minggu terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="tanggal"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(v) => `${v}`}
                />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Harga/kg",
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="harga"
                  stroke="hsl(145, 60%, 45%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(145, 60%, 45%)", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="size-5" />
            Riwayat Harga
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Harga/kg</TableHead>
                <TableHead>Sumber</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...HARGA_DATA].reverse().map((item, i) => (
                <TableRow key={i}>
                  <TableCell>
                    {new Date(item.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.harga)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.sumber}
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
