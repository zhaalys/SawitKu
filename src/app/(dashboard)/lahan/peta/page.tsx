"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, TreePalm } from "lucide-react";
import { useBlokLahan } from "@/hooks/use-supabase";

// Dynamically import map to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
import L from "leaflet";

const statusColors: Record<string, string> = {
  produktif: "bg-green-500",
  pemupukan: "bg-amber-500",
  perawatan: "bg-blue-500",
  panen: "bg-orange-500",
  tidak_aktif: "bg-gray-500",
};

export default function PetaLahanPage() {
  const { data, loading } = useBlokLahan();

  // Filter blok with coordinates
  const blokWithCoords = data.filter((b) => b.latitude && b.longitude);

  // Calculate center (default to Indonesia if no data)
  const center: [number, number] =
    blokWithCoords.length > 0
      ? [
          blokWithCoords.reduce((sum, b) => sum + (b.latitude || 0), 0) /
            blokWithCoords.length,
          blokWithCoords.reduce((sum, b) => sum + (b.longitude || 0), 0) /
            blokWithCoords.length,
        ]
      : [-2.5, 117.0]; // Indonesia center

  // Custom icon
  const createIcon = (status: string) => {
    const color =
      status === "produktif"
        ? "#22c55e"
        : status === "pemupukan"
          ? "#f59e0b"
          : status === "perawatan"
            ? "#3b82f6"
            : status === "panen"
              ? "#f97316"
              : "#6b7280";

    return L.divIcon({
      className: "custom-marker",
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/lahan">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Peta Lahan</h1>
            <p className="text-muted-foreground">
              Visualisasi lokasi blok lahan di peta
            </p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(statusColors).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2">
            <div className={`size-3 rounded-full ${color}`} />
            <span className="text-sm capitalize">
              {status.replace("_", " ")}
            </span>
          </div>
        ))}
      </div>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-5" />
            Peta Lokasi Blok
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[500px] w-full rounded-lg" />
          ) : blokWithCoords.length === 0 ? (
            <div className="h-[500px] flex flex-col items-center justify-center bg-muted/30 rounded-lg">
              <MapPin className="size-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Belum Ada Lokasi Blok
              </h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                Untuk menampilkan blok di peta, tambahkan koordinat latitude dan
                longitude pada data blok lahan.
              </p>
              <Button asChild>
                <Link href="/lahan">Kelola Blok Lahan</Link>
              </Button>
            </div>
          ) : (
            <div className="h-[500px] rounded-lg overflow-hidden">
              <MapContainer
                center={center}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {blokWithCoords.map((blok) => (
                  <Marker
                    key={blok.id}
                    position={[blok.latitude!, blok.longitude!]}
                    icon={createIcon(blok.status)}
                  >
                    <Popup>
                      <div className="p-1">
                        <div className="flex items-center gap-2 mb-2">
                          <TreePalm className="size-4 text-green-600" />
                          <span className="font-bold">{blok.kode}</span>
                        </div>
                        <p className="text-sm font-medium">{blok.nama}</p>
                        <div className="mt-2 space-y-1 text-xs text-gray-600">
                          <p>Luas: {blok.luas_hektar} Ha</p>
                          {blok.jumlah_pohon && (
                            <p>Pohon: {blok.jumlah_pohon.toLocaleString()}</p>
                          )}
                          <p className="capitalize">
                            Status: {blok.status.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blok List */}
      {blokWithCoords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Blok dengan Lokasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {blokWithCoords.map((blok) => (
                <div
                  key={blok.id}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <div
                    className={`size-3 rounded-full ${statusColors[blok.status]}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{blok.kode}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {blok.nama}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {blok.luas_hektar} Ha
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
