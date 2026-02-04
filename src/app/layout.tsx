import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SawitKu - Dashboard Pengelolaan Kelapa Sawit",
  description:
    "Sistem manajemen lahan, operasional, panen, dan keuangan untuk perkebunan kelapa sawit",
  icons: {
    icon: [
      { url: "/logo_sawit.png", sizes: "32x32", type: "image/png" },
      { url: "/logo_sawit.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/logo_sawit.png",
    apple: "/logo_sawit.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
