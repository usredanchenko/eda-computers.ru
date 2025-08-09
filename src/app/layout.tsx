import type { Metadata } from "next";
import "./globals.css";
import { Orbitron, Inter } from "next/font/google";
import LenisProvider from "@/components/providers/LenisProvider";
import NotchNav from "@/components/ui/NotchNav";

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron", display: "swap" });
const inter = Inter({ subsets: ["latin","cyrillic"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "EDA Computers — Кастомные ПК",
  description: "Киберпанк-лендинг и конфигуратор",
  viewport: { width: "device-width", initialScale: 1, userScalable: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${orbitron.variable} ${inter.variable}`}>
      <body className="min-h-dvh antialiased">
        <LenisProvider />
        <NotchNav />
        {children}
      </body>
    </html>
  );
}