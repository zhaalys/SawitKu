"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  FileText,
  Truck,
  Map,
  Wallet,
  Package,
  ClipboardList,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    label: "Lahan",
    icon: Map,
    href: "/lahan",
  },
  {
    label: "Inventaris",
    icon: Package,
    href: "/inventaris/pupuk",
  },
  {
    label: "Panen",
    icon: Truck,
    href: "/panen",
  },
  {
    label: "Keuangan",
    icon: Wallet,
    href: "/keuangan",
  },
  {
    label: "Laporan",
    icon: FileText,
    href: "/laporan",
  },
];

const quickActions = [
  {
    label: "Input Panen",
    icon: Truck,
    href: "/panen/input",
    color: "bg-orange-500",
  },
  { label: "Tambah Blok", icon: Map, href: "/lahan", color: "bg-blue-500" },
  {
    label: "Transaksi",
    icon: Wallet,
    href: "/keuangan",
    color: "bg-emerald-500",
  },
  {
    label: "Update Stok",
    icon: Package,
    href: "/inventaris/pupuk",
    color: "bg-purple-500",
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  // Split nav items into two halves to place the center button in between
  const leftItems = navItems.slice(0, 3);
  const rightItems = navItems.slice(3);

  return (
    <>
      {/* Quick Action Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Quick Action Menu */}
      <div
        className={cn(
          "fixed bottom-24 left-1/2 -translate-x-1/2 z-[46] flex flex-col items-center gap-4 transition-all duration-500 ease-out pb-4",
          isOpen
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-20 opacity-0 scale-75 pointer-events-none",
        )}
      >
        <div className="grid grid-cols-2 gap-3 p-4 bg-zinc-900/90 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl max-w-[280px]">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              href={action.href}
              onClick={() => setIsOpen(false)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/5 transition-colors group"
            >
              <div
                className={cn(
                  "size-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-active:scale-90",
                  action.color,
                )}
              >
                <action.icon className="size-5" />
              </div>
              <span className="text-[10px] font-bold text-zinc-100 uppercase tracking-tight">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
        <div className="w-0.5 h-6 bg-gradient-to-t from-green-500/50 to-transparent" />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-2 pb-3">
        <div className="relative flex items-center justify-between bg-zinc-950/95 dark:bg-black/95 backdrop-blur-xl border border-white/5 shadow-[0_-8px_40px_rgb(0,0,0,0.5)] rounded-[24px] h-16 px-1">
          {/* Left Side Items */}
          <div className="flex flex-1 justify-around items-center px-1">
            {leftItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-0.5 transition-all duration-300 min-w-0 flex-1",
                    isActive
                      ? "text-green-500 scale-105"
                      : "text-zinc-400 hover:text-zinc-200",
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-5",
                      isActive ? "stroke-[3px]" : "stroke-[1.5px]",
                    )}
                  />
                  <span className="text-[7.5px] font-[900] uppercase tracking-[-0.05em] truncate w-full text-center leading-none mt-0.5">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Floating Center Button */}
          <div className="relative -mt-9 mx-0.5">
            <div
              className={cn(
                "absolute inset-0 bg-green-500/40 blur-2xl rounded-full transition-all duration-500",
                isOpen ? "scale-150 opacity-100" : "scale-110 opacity-60",
              )}
            />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "relative flex items-center justify-center size-13.5 rounded-full shadow-[0_0_20px_rgb(34,197,94,0.6)] border-[3.5px] border-zinc-950 transition-all duration-500 active:scale-90 overflow-hidden",
                isOpen
                  ? "bg-zinc-100 text-black rotate-[135deg]"
                  : "bg-green-500 text-black",
              )}
            >
              <Plus className="size-7.5 stroke-[3.5px]" />
              {!isOpen && (
                <div className="absolute inset-x-0 top-0 h-1/2 bg-white/20 pointer-events-none" />
              )}
            </button>
          </div>

          {/* Right Side Items */}
          <div className="flex flex-1 justify-around items-center px-0.5">
            {rightItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-0.5 transition-all duration-300 min-w-0 flex-1",
                    isActive
                      ? "text-green-500 scale-105"
                      : "text-zinc-400 hover:text-zinc-200",
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-5",
                      isActive ? "stroke-[3px]" : "stroke-[1.5px]",
                    )}
                  />
                  <span className="text-[7.5px] font-[900] uppercase tracking-[-0.05em] truncate w-full text-center leading-none mt-0.5">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
