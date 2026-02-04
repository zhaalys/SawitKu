"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Leaf,
  TrendingUp,
  Shield,
  User,
  ChevronRight,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("register");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter");
      setLoading(false);
      return;
    }

    if (!agreeTerms) {
      setError("Anda harus menyetujui syarat dan ketentuan");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/login?registered=true");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-background">
      {/* Left Side - Hero (Desktop Only - Inverted compared to Login if needed, or same for consistency) */}
      <div className="hidden lg:flex w-[45%] relative overflow-hidden">
        <Image
          src="/sawit_img.jpg"
          alt="Perkebunan Sawit"
          fill
          className="object-cover transition-transform duration-10000 hover:scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/80 via-green-700/70 to-green-900/90 mix-blend-multiply" />

        {/* Decorative Patterns */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="bg-white p-2 rounded-xl shadow-lg transform group-hover:rotate-12 transition-transform">
              <Image
                src="/logo_sawit.png"
                alt="SawitKu"
                width={32}
                height={32}
                className="rounded-md"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">SawitKu</h2>
              <p className="text-xs text-green-100 font-medium opacity-80 uppercase tracking-widest">
                Enterprise Platform
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
                Bergabung <br />
                Bersama <span className="text-green-300">Ekosistem</span> <br />
                Modern Sawit
              </h1>
              <p className="text-lg text-green-50 max-w-md leading-relaxed opacity-90">
                Mulai perjalanan digital perkebunan Anda sekarang. Daftarkan
                akun untuk akses dashboard penuh.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Pantau Blok Lahan Real-time",
                "Analisis Keuangan Mendalam",
                "Manajemen Pekerja Efisien",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="size-5 rounded-full bg-green-400/20 flex items-center justify-center border border-green-400/40">
                    <ChevronRight className="size-3 text-green-300" />
                  </div>
                  <span className="text-sm font-medium text-green-50 uppercase tracking-wide">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-green-100/60 font-medium tracking-widest">
            <p>ADVANCING AGRICULTURE SINCE 2024</p>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden bg-slate-50 dark:bg-zinc-950">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 size-96 bg-green-200/20 dark:bg-green-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 size-96 bg-green-200/20 dark:bg-green-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="text-center space-y-2">
            <div className="lg:hidden mb-6 inline-block bg-white p-3 rounded-2xl shadow-xl">
              <Image
                src="/logo_sawit.png"
                alt="SawitKu"
                width={48}
                height={48}
                className="rounded-lg"
              />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Daftar Akun
            </h2>
            <p className="text-muted-foreground text-sm font-medium">
              Buat akun untuk mulai mengelola perkebunan
            </p>
          </div>

          <div className="bg-muted/50 p-1.5 rounded-xl flex gap-1">
            <button
              onClick={() => {
                setActiveTab("login");
                router.push("/login");
              }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${activeTab === "login" ? "bg-background shadow-md text-green-600" : "text-muted-foreground hover:text-foreground"}`}
            >
              Masuk
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${activeTab === "register" ? "bg-background shadow-md text-green-600 scale-[1.02]" : "text-muted-foreground hover:text-foreground"}`}
            >
              Daftar
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="flex items-center gap-3 rounded-xl bg-destructive/10 p-4 text-xs font-semibold text-destructive animate-in fade-in slide-in-from-top-1 duration-300">
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs font-bold uppercase tracking-wider pl-1"
              >
                Nama Lengkap
              </Label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-green-600 transition-colors" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Budi Setiawan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-11 h-12 rounded-xl bg-background/50 border-muted-foreground/20 focus:ring-green-400 focus:border-green-400 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-wider pl-1"
              >
                Email Kerja
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-green-600 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="budi@kebun.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-11 h-12 rounded-xl bg-background/50 border-muted-foreground/20 focus:ring-green-400 focus:border-green-400 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-xs font-bold uppercase tracking-wider pl-1"
                >
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-green-600 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pl-11 h-12 rounded-xl bg-background/50 border-muted-foreground/20 focus:ring-green-400 focus:border-green-400 transition-all text-sm font-medium"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="confirm"
                  className="text-xs font-bold uppercase tracking-wider pl-1"
                >
                  Konfirmasi
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-green-600 transition-colors" />
                  <Input
                    id="confirm"
                    type="password"
                    placeholder="Min. 8"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pl-11 h-12 rounded-xl bg-background/50 border-muted-foreground/20 focus:ring-green-400 focus:border-green-400 transition-all text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 pl-1 py-1">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                className="mt-0.5 rounded-md border-muted-foreground/30 data-[state=checked]:bg-green-600"
              />
              <Label
                htmlFor="terms"
                className="text-xs font-bold text-muted-foreground cursor-pointer leading-tight select-none"
              >
                Saya menyetujui{" "}
                <span className="text-green-600">Syarat Layanan</span> dan{" "}
                <span className="text-green-600">Kebijakan Privasi</span>{" "}
                SawitKu.
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20 rounded-xl font-bold uppercase tracking-widest text-xs transition-all active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span>Mendaftar...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Buat Akun Perkebunan</span>
                  <ChevronRight className="size-4" />
                </div>
              )}
            </Button>
          </form>

          <p className="text-center text-xs font-medium text-muted-foreground">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-green-600 font-bold hover:underline underline-offset-4"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
