"use client";

import { Bell, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, Settings, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useNotifikasi } from "@/hooks/use-supabase";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

export function AppHeader() {
  const router = useRouter();
  const supabase = createClient();
  const { data: notifications, unreadCount, markAsRead } = useNotifikasi();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 sm:h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 sm:px-4">
      <div className="flex items-center gap-2">
        {/* Mobile Logo */}
        <Link href="/" className="md:hidden flex items-center gap-2 mr-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white dark:bg-zinc-800 shadow-sm overflow-hidden p-1 border border-sidebar-border">
            <img
              src="/logo_sawit.png"
              alt="SawitKu"
              className="size-full object-contain"
            />
          </div>
          <span className="font-bold text-sm tracking-tight">SawitKu</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>
      </div>

      {/* Search */}
      <div className="relative hidden md:flex flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Cari blok, panen, laporan..."
          className="pl-10 bg-muted/50"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 size-5 rounded-full p-0 text-[10px] flex items-center justify-center bg-green-500 hover:bg-green-600">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <DropdownMenuLabel className="p-4 font-bold flex items-center justify-between">
              <span>Notifikasi</span>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                  {unreadCount} Baru
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="m-0" />
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    className={cn(
                      "flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-muted/50 border-b last:border-0",
                      !n.dibaca && "bg-green-500/5 dark:bg-green-500/10",
                    )}
                    onClick={() => {
                      if (!n.dibaca) markAsRead(n.id);
                      // Navigate if there's a payload link, otherwise just show
                    }}
                  >
                    <div className="flex items-center justify-between w-full gap-2">
                      <span
                        className={cn(
                          "font-semibold text-sm",
                          !n.dibaca && "text-green-600 dark:text-green-400",
                        )}
                      >
                        {n.judul}
                      </span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(n.created_at), {
                          addSuffix: true,
                          locale: localeId,
                        })}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {n.pesan}
                    </span>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Bell className="size-8 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Tidak ada notifikasi
                  </p>
                </div>
              )}
            </div>
            <DropdownMenuSeparator className="m-0" />
            <DropdownMenuItem asChild>
              <Link
                href="/notifikasi"
                className="w-full text-center py-3 text-sm font-medium text-green-600 dark:text-green-400 cursor-pointer hover:bg-muted/50 transition-colors block"
              >
                Lihat semua notifikasi
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator
          orientation="vertical"
          className="mx-1 h-4 hidden sm:block"
        />

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar.png" alt="Admin" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                  AD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@sawitku.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/pengaturan" className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profil Anda</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/pengaturan" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Pengaturan</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
