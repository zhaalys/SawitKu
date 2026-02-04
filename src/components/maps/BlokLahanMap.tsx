"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TreePalm } from "lucide-react";
import type { BlokLahan } from "@/types/database";

interface BlokLahanMapProps {
  data: BlokLahan[];
  center: [number, number];
}

export default function BlokLahanMap({ data, center }: BlokLahanMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  if (!isMounted) return null;

  return (
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
      {data.map((blok) => (
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
  );
}
