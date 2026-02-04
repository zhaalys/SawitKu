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
  ChevronRight,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-background">
      {/* Left Side - Hero (Desktop Only) */}
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
                Optimalkan <br />
                <span className="text-green-300">Produktivitas</span> <br />
                Perkebunan Anda
              </h1>
              <p className="text-lg text-green-50 max-w-md leading-relaxed opacity-90">
                Solusi digital terpadu untuk efisiensi operasional dan
                pengambilan keputusan berbasis data real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {[
                {
                  icon: Leaf,
                  title: "Precision Agriculture",
                  desc: "Pemantauan blok lahan yang presisi",
                },
                {
                  icon: TrendingUp,
                  title: "Smart Forecasting",
                  desc: "Prediksi panen dengan AI",
                },
                {
                  icon: Shield,
                  title: "Secure Management",
                  desc: "Data transaksi aman & terpusat",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors group"
                >
                  <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <feature.icon className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{feature.title}</h4>
                    <p className="text-xs text-green-100/70">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-green-100/60 font-medium">
            <p>© 2024 SAWITKU ECOSYSTEM</p>
            <div className="flex gap-4">
              <span className="hover:text-white cursor-pointer">Privacy</span>
              <span className="hover:text-white cursor-pointer">Terms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden bg-slate-50 dark:bg-zinc-950">
        {/* Background blobs for aesthetics */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 size-96 bg-green-200/20 dark:bg-green-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 size-96 bg-green-200/20 dark:bg-green-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-sm space-y-10 relative z-10">
          <div className="text-center space-y-2">
            {/* Logo Mobile only centered */}
            <div className="lg:hidden mb-8 inline-block bg-white p-3 rounded-2xl shadow-xl">
              <Image
                src="/logo_sawit.png"
                alt="SawitKu"
                width={48}
                height={48}
                className="rounded-lg"
              />
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight">
              Selamat Datang
            </h2>
            <p className="text-muted-foreground text-sm font-medium">
              Silakan masuk ke akun SawitKu Anda
            </p>
          </div>

          {/* Tab Selection */}
          <div className="bg-muted/50 p-1.5 rounded-xl flex gap-1">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${activeTab === "login" ? "bg-background shadow-md text-green-600 scale-[1.02]" : "text-muted-foreground hover:text-foreground"}`}
            >
              Masuk
            </button>
            <button
              onClick={() => {
                setActiveTab("register");
                router.push("/register");
              }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${activeTab === "register" ? "bg-background shadow-md text-green-600 scale-[1.02]" : "text-muted-foreground hover:text-foreground"}`}
            >
              Daftar
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 rounded-xl bg-destructive/10 p-4 text-xs font-semibold text-destructive animate-in fade-in slide-in-from-top-1 duration-300">
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1.5 focus-within:text-green-600 transition-colors">
              <Label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-wider pl-1"
              >
                Email
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-green-600 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-11 h-12 rounded-xl bg-background/50 border-muted-foreground/20 focus:ring-green-400 focus:border-green-400 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5 focus-within:text-green-600 transition-colors">
              <div className="flex items-center justify-between px-1">
                <Label
                  htmlFor="password"
                  className="text-xs font-bold uppercase tracking-wider"
                >
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-green-600 hover:text-green-700 hover:underline underline-offset-4"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-green-600 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-11 pr-11 h-12 rounded-xl bg-background/50 border-muted-foreground/20 focus:ring-green-400 focus:border-green-400 transition-all text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-green-600 transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pl-1">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <Label
                htmlFor="remember"
                className="text-xs font-bold text-muted-foreground cursor-pointer select-none"
              >
                Biarkan saya tetap masuk
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
                  <span className="text-[10px]">Memproses Autentikasi...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Masuk Dashboard</span>
                  <ChevronRight className="size-4" />
                </div>
              )}
            </Button>
          </form>

          <p className="text-center text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-loose">
            Layanan Terintegrasi <br />
            <span className="text-green-600/50 hover:text-green-600 cursor-pointer transition-colors">
              SawitKu Intelligent Systems
            </span>
          </p>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/4 left-10 size-2 bg-green-500/10 rounded-full blur-xl" />
        <div className="absolute bottom-1/4 right-10 size-4 bg-green-500/10 rounded-full blur-xl" />
      </div>
    </div>
  );
}
