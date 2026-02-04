"use client";

import { useNotifikasi } from "@/hooks/use-supabase";
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
  Bell,
  CheckCircle2,
  Clock,
  Info,
  Trash2,
  CheckCheck,
  Package,
  Truck,
  AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function NotifikasiPage() {
  const {
    data: notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  } = useNotifikasi();

  const getIcon = (type: string) => {
    switch (type) {
      case "stok":
        return <Package className="size-4 text-orange-500" />;
      case "panen":
        return <Truck className="size-4 text-blue-500" />;
      case "bahaya":
        return <AlertTriangle className="size-4 text-red-500" />;
      default:
        return <Info className="size-4 text-green-500" />;
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifikasi</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0
              ? `Anda memiliki ${unreadCount} pesan belum dibaca`
              : "Semua pesan sudah dibaca"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="w-full sm:w-auto text-xs"
          >
            <CheckCheck className="size-3.5 mr-2" />
            Tandai semua dibaca
          </Button>
        )}
      </div>

      <Card className="border-none bg-transparent sm:bg-card sm:border shadow-none sm:shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center space-y-3">
              <div className="size-10 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">
                Memuat notifikasi...
              </p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "flex gap-4 p-4 transition-colors relative group",
                    !n.dibaca && "bg-green-500/[0.03] dark:bg-green-500/[0.05]",
                  )}
                >
                  <div
                    className={cn(
                      "size-10 rounded-full flex items-center justify-center shrink-0 border",
                      !n.dibaca
                        ? "bg-white dark:bg-zinc-900 border-green-200 dark:border-green-900/50 shadow-sm"
                        : "bg-muted/50 border-transparent",
                    )}
                  >
                    {getIcon(n.jenis || "info")}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={cn(
                          "text-sm font-semibold truncate",
                          !n.dibaca
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {n.judul}
                      </h4>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap flex items-center gap-1 shrink-0">
                        <Clock className="size-3" />
                        {formatDistanceToNow(new Date(n.created_at), {
                          addSuffix: true,
                          locale: localeId,
                        })}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-xs leading-relaxed",
                        !n.dibaca
                          ? "text-zinc-600 dark:text-zinc-400"
                          : "text-muted-foreground/80",
                      )}
                    >
                      {n.pesan}
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      {!n.dibaca && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="text-[10px] font-bold text-green-600 dark:text-green-500 uppercase tracking-wider hover:underline"
                        >
                          Tandai dibaca
                        </button>
                      )}
                    </div>
                  </div>

                  {!n.dibaca && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center sm:relative sm:top-0 sm:translate-y-0">
                      <div className="size-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center">
              <div className="size-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 grayscale opacity-20">
                <Bell className="size-8" />
              </div>
              <h3 className="font-semibold text-lg">Hening Sekali...</h3>
              <p className="text-sm text-muted-foreground max-w-[250px] mx-auto mt-2">
                Tidak ada notifikasi baru untuk Anda saat ini.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
