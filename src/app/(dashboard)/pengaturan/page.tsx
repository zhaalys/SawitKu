"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  User,
  Bell,
  Shield,
  Palette,
  LogOut,
  Save,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Moon,
  Sun,
  Monitor,
  Loader2,
  CheckCircle2,
  Database,
  Download,
  Upload,
  Trash2,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function PengaturanPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    nama: "Admin SawitKu",
    email: "admin@sawitku.com",
    telepon: "08123456789",
    jabatan: "Administrator",
  });

  // Company state
  const [company, setCompany] = useState({
    nama: "PT Sawit Makmur",
    alamat: "Jl. Perkebunan No. 123, Pekanbaru",
    telepon: "0761-123456",
    email: "info@sawitmakmur.com",
    website: "www.sawitmakmur.com",
    luasTotal: "500",
    tahunBerdiri: "2010",
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    stokRendah: true,
    jadwalPemupukan: true,
    laporanMingguan: false,
    laporanBulanan: true,
    panenSelesai: true,
    pengirimanSelesai: true,
  });

  // Display state
  const [display, setDisplay] = useState({
    language: "id",
    currency: "IDR",
    dateFormat: "dd/MM/yyyy",
    itemsPerPage: "10",
  });

  // Security state
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactor: false,
    sessionTimeout: "30",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = async (section: string) => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChangePassword = async () => {
    if (security.newPassword !== security.confirmPassword) {
      alert("Password baru tidak cocok!");
      return;
    }
    if (security.newPassword.length < 8) {
      alert("Password minimal 8 karakter!");
      return;
    }
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSecurity({
      ...security,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    alert("Password berhasil diubah!");
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!mounted) return null;

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Pengaturan
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola akun dan preferensi aplikasi
          </p>
        </div>
        {saveSuccess && (
          <Badge className="w-fit bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle2 className="size-3 mr-1" />
            Tersimpan
          </Badge>
        )}
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        {/* Mobile-friendly scrollable tabs */}
        <div className="overflow-x-auto pb-2 -mx-1 px-1">
          <TabsList className="inline-flex h-10 w-max min-w-full sm:w-full sm:grid sm:grid-cols-6 gap-1 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger
              value="profile"
              className="flex-1 gap-1.5 px-2.5 py-1.5 text-xs sm:text-sm data-[state=active]:bg-background rounded-md"
            >
              <User className="size-3.5 sm:size-4" />
              <span>Profil</span>
            </TabsTrigger>
            <TabsTrigger
              value="company"
              className="flex-1 gap-1.5 px-2.5 py-1.5 text-xs sm:text-sm data-[state=active]:bg-background rounded-md"
            >
              <Building2 className="size-3.5 sm:size-4" />
              <span>Usaha</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex-1 gap-1.5 px-2.5 py-1.5 text-xs sm:text-sm data-[state=active]:bg-background rounded-md"
            >
              <Bell className="size-3.5 sm:size-4" />
              <span>Notif</span>
            </TabsTrigger>
            <TabsTrigger
              value="display"
              className="flex-1 gap-1.5 px-2.5 py-1.5 text-xs sm:text-sm data-[state=active]:bg-background rounded-md"
            >
              <Palette className="size-3.5 sm:size-4" />
              <span>Tema</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex-1 gap-1.5 px-2.5 py-1.5 text-xs sm:text-sm data-[state=active]:bg-background rounded-md"
            >
              <Shield className="size-3.5 sm:size-4" />
              <span>Keamanan</span>
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="flex-1 gap-1.5 px-2.5 py-1.5 text-xs sm:text-sm data-[state=active]:bg-background rounded-md"
            >
              <Database className="size-3.5 sm:size-4" />
              <span>Data</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 mt-0">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="size-5" />
                Profil Pengguna
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Informasi akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="size-16 sm:size-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="size-8 sm:size-10 text-primary" />
                </div>
                <div>
                  <Button variant="outline" size="sm" className="text-xs">
                    Ubah Foto
                  </Button>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                    JPG, PNG. Max 2MB
                  </p>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="nama" className="text-xs sm:text-sm">
                    Nama Lengkap
                  </Label>
                  <Input
                    id="nama"
                    value={profile.nama}
                    onChange={(e) =>
                      setProfile({ ...profile, nama: e.target.value })
                    }
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs sm:text-sm">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      className="h-9 pl-8 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="telepon" className="text-xs sm:text-sm">
                      Telepon
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                      <Input
                        id="telepon"
                        value={profile.telepon}
                        onChange={(e) =>
                          setProfile({ ...profile, telepon: e.target.value })
                        }
                        className="h-9 pl-8 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="jabatan" className="text-xs sm:text-sm">
                      Jabatan
                    </Label>
                    <Select
                      value={profile.jabatan}
                      onValueChange={(v) =>
                        setProfile({ ...profile, jabatan: v })
                      }
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Administrator">Admin</SelectItem>
                        <SelectItem value="Manajer">Manajer</SelectItem>
                        <SelectItem value="Mandor">Mandor</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleSave("profile")}
                disabled={isSaving}
                className="w-full sm:w-auto"
                size="sm"
              >
                {isSaving ? (
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Save className="size-3.5 mr-1.5" />
                )}
                Simpan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company" className="space-y-4 mt-0">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="size-5" />
                Info Perusahaan
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Data perkebunan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm">
                      Nama Perusahaan
                    </Label>
                    <Input
                      value={company.nama}
                      onChange={(e) =>
                        setCompany({ ...company, nama: e.target.value })
                      }
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm">Tahun Berdiri</Label>
                    <Input
                      type="number"
                      value={company.tahunBerdiri}
                      onChange={(e) =>
                        setCompany({ ...company, tahunBerdiri: e.target.value })
                      }
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Alamat</Label>
                  <Textarea
                    value={company.alamat}
                    onChange={(e) =>
                      setCompany({ ...company, alamat: e.target.value })
                    }
                    className="min-h-[70px] text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm">Telepon</Label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                      <Input
                        value={company.telepon}
                        onChange={(e) =>
                          setCompany({ ...company, telepon: e.target.value })
                        }
                        className="h-9 pl-8 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                      <Input
                        type="email"
                        value={company.email}
                        onChange={(e) =>
                          setCompany({ ...company, email: e.target.value })
                        }
                        className="h-9 pl-8 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                      <Input
                        value={company.website}
                        onChange={(e) =>
                          setCompany({ ...company, website: e.target.value })
                        }
                        className="h-9 pl-8 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm">
                      Luas Lahan (Ha)
                    </Label>
                    <Input
                      type="number"
                      value={company.luasTotal}
                      onChange={(e) =>
                        setCompany({ ...company, luasTotal: e.target.value })
                      }
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleSave("company")}
                disabled={isSaving}
                className="w-full sm:w-auto"
                size="sm"
              >
                {isSaving ? (
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Save className="size-3.5 mr-1.5" />
                )}
                Simpan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4 mt-0">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="size-5" />
                Notifikasi
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Atur preferensi notifikasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Notification Items - Mobile Optimized */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Metode
                </p>
                {[
                  {
                    key: "email",
                    label: "Email",
                    desc: "Via email",
                  },
                  {
                    key: "push",
                    label: "Push",
                    desc: "Di browser",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <Switch
                      checked={
                        notifications[item.key as keyof typeof notifications]
                      }
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          [item.key]: checked,
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Jenis Notifikasi
                </p>
                {[
                  {
                    key: "stokRendah",
                    label: "Stok Rendah",
                    desc: "Pupuk/pestisida menipis",
                  },
                  {
                    key: "jadwalPemupukan",
                    label: "Jadwal Pupuk",
                    desc: "3 hari sebelum",
                  },
                  {
                    key: "panenSelesai",
                    label: "Panen Selesai",
                    desc: "Setelah pencatatan",
                  },
                  {
                    key: "pengirimanSelesai",
                    label: "Pengiriman",
                    desc: "TBS sampai PKS",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <Switch
                      checked={
                        notifications[item.key as keyof typeof notifications]
                      }
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          [item.key]: checked,
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Laporan Berkala
                </p>
                {[
                  {
                    key: "laporanMingguan",
                    label: "Mingguan",
                    desc: "Setiap Senin",
                  },
                  {
                    key: "laporanBulanan",
                    label: "Bulanan",
                    desc: "Awal bulan",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <Switch
                      checked={
                        notifications[item.key as keyof typeof notifications]
                      }
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          [item.key]: checked,
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handleSave("notifications")}
                disabled={isSaving}
                className="w-full sm:w-auto"
                size="sm"
              >
                {isSaving ? (
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Save className="size-3.5 mr-1.5" />
                )}
                Simpan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value="display" className="space-y-4 mt-0">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="size-5" />
                Tampilan
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Tema dan format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Theme Selector - Mobile Optimized */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Tema
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "light", icon: Sun, label: "Light" },
                    { value: "dark", icon: Moon, label: "Dark" },
                    { value: "system", icon: Monitor, label: "Auto" },
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                        theme === t.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <t.icon className="size-5 mb-1" />
                      <span className="text-xs font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Other Settings */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm">Bahasa</Label>
                    <Select
                      value={display.language}
                      onValueChange={(v) =>
                        setDisplay({ ...display, language: v })
                      }
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">Indonesia</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm">Mata Uang</Label>
                    <Select
                      value={display.currency}
                      onValueChange={(v) =>
                        setDisplay({ ...display, currency: v })
                      }
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IDR">IDR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm">Format Tanggal</Label>
                    <Select
                      value={display.dateFormat}
                      onValueChange={(v) =>
                        setDisplay({ ...display, dateFormat: v })
                      }
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm">Item/Halaman</Label>
                    <Select
                      value={display.itemsPerPage}
                      onValueChange={(v) =>
                        setDisplay({ ...display, itemsPerPage: v })
                      }
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4 mt-0">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="size-5" />
                Ubah Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Password Saat Ini</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={security.currentPassword}
                    onChange={(e) =>
                      setSecurity({
                        ...security,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                    className="h-9 text-sm pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Password Baru</Label>
                  <Input
                    type="password"
                    value={security.newPassword}
                    onChange={(e) =>
                      setSecurity({ ...security, newPassword: e.target.value })
                    }
                    placeholder="••••••••"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Konfirmasi</Label>
                  <Input
                    type="password"
                    value={security.confirmPassword}
                    onChange={(e) =>
                      setSecurity({
                        ...security,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                    className="h-9 text-sm"
                  />
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Minimal 8 karakter
              </p>
              <Button
                onClick={handleChangePassword}
                disabled={isSaving}
                size="sm"
                className="w-full sm:w-auto"
              >
                Ubah Password
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="size-5" />
                Keamanan Lanjutan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">2FA</p>
                  <p className="text-xs text-muted-foreground">
                    Autentikasi 2 faktor
                  </p>
                </div>
                <Switch
                  checked={security.twoFactor}
                  onCheckedChange={(checked) =>
                    setSecurity({ ...security, twoFactor: checked })
                  }
                />
              </div>
              <Separator />
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Session Timeout</Label>
                <Select
                  value={security.sessionTimeout}
                  onValueChange={(v) =>
                    setSecurity({ ...security, sessionTimeout: v })
                  }
                >
                  <SelectTrigger className="h-9 text-sm w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 menit</SelectItem>
                    <SelectItem value="30">30 menit</SelectItem>
                    <SelectItem value="60">1 jam</SelectItem>
                    <SelectItem value="120">2 jam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Logout */}
          <Card className="border-destructive/30">
            <CardContent className="pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-medium text-destructive text-sm">Logout</p>
                  <p className="text-xs text-muted-foreground">
                    Keluar dari akun
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowConfirmLogout(true)}
                  className="w-full sm:w-auto"
                >
                  <LogOut className="size-3.5 mr-1.5" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data" className="space-y-4 mt-0">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="size-5" />
                Backup Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Export Data</p>
                  <p className="text-xs text-muted-foreground">
                    Download backup JSON
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert("Fitur dalam pengembangan")}
                  className="w-full sm:w-auto"
                >
                  <Download className="size-3.5 mr-1.5" />
                  Export
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Import Data</p>
                  <p className="text-xs text-muted-foreground">
                    Restore dari backup
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert("Fitur dalam pengembangan")}
                  className="w-full sm:w-auto"
                >
                  <Upload className="size-3.5 mr-1.5" />
                  Import
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                <AlertTriangle className="size-5" />
                Zona Bahaya
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border border-destructive/30 rounded-lg bg-destructive/5">
                <div>
                  <p className="text-sm font-medium text-destructive">
                    Hapus Akun
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Hapus permanen semua data
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="size-3.5 mr-1.5" />
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Keluar Akun - Always Visible */}
      <Card className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                <LogOut className="size-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Keluar Akun</p>
                <p className="text-xs text-muted-foreground">
                  Logout dari aplikasi SawitKu
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirmLogout(true)}
              className="w-full sm:w-auto border-amber-500/50 hover:bg-amber-100 dark:hover:bg-amber-900/30"
            >
              <LogOut className="size-3.5 mr-1.5" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logout Dialog */}
      <AlertDialog open={showConfirmLogout} onOpenChange={setShowConfirmLogout}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">Logout?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Anda akan keluar dari akun.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="mt-0">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Ya, Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg text-destructive">
              Hapus Akun?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Semua data akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="mt-0">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowDeleteConfirm(false);
                alert("Hubungi admin untuk hapus akun.");
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
