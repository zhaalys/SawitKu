"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Package,
  ClipboardList,
  Truck,
  Wallet,
  FileText,
  Settings,
  TreePalm,
  Leaf,
  Bug,
  Scissors,
  Calendar,
  DollarSign,
  Users,
  ChevronDown,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Manajemen Lahan",
    icon: Map,
    items: [
      { title: "Daftar Blok", href: "/lahan", icon: TreePalm },
      { title: "Peta Lahan", href: "/lahan/peta", icon: Map },
    ],
  },
  {
    title: "Inventaris",
    icon: Package,
    items: [
      { title: "Pupuk", href: "/inventaris/pupuk", icon: Leaf },
      { title: "Alat Kerja", href: "/inventaris/alat", icon: Package },
    ],
  },
  {
    title: "Operasional",
    icon: ClipboardList,
    items: [
      { title: "Pemupukan", href: "/operasional/pemupukan", icon: Calendar },
      { title: "Hama & Penyakit", href: "/operasional/hama", icon: Bug },
      { title: "Perawatan", href: "/operasional/perawatan", icon: Scissors },
    ],
  },
  {
    title: "Panen & Penjualan",
    icon: Truck,
    items: [
      { title: "Catatan Panen", href: "/panen", icon: Truck },
      { title: "Transportasi", href: "/panen/transportasi", icon: Truck },
      { title: "Harga TBS", href: "/panen/harga", icon: DollarSign },
    ],
  },
  {
    title: "Keuangan",
    icon: Wallet,
    items: [
      { title: "Laba Rugi", href: "/keuangan", icon: Wallet },
      { title: "Prediksi Panen", href: "/keuangan/prediksi", icon: FileText },
      { title: "Gaji Pekerja", href: "/keuangan/gaji", icon: Users },
    ],
  },
  {
    title: "Laporan",
    icon: FileText,
    href: "/laporan",
  },
  {
    title: "Pengaturan",
    icon: Settings,
    href: "/pengaturan",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-white dark:bg-zinc-800 shadow-sm overflow-hidden p-1.5 border border-sidebar-border shrink-0">
                  <img
                    src="/logo_sawit.png"
                    alt="SawitKu"
                    className="size-full object-contain"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none overflow-hidden">
                  <span className="font-semibold">SawitKu</span>
                  <span className="text-xs text-sidebar-foreground/60">
                    Palm Oil Management
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) =>
                item.items ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.items.some((sub) =>
                      pathname.startsWith(sub.href),
                    )}
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.href}
                              >
                                <Link href={subItem.href}>
                                  <subItem.icon className="size-3.5" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href!}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Avatar className="size-8">
                <AvatarImage src="/avatar.png" alt="Admin" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="text-sm font-medium">Admin</span>
                <span className="text-xs text-sidebar-foreground/60">
                  admin@sawitku.com
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
