import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Rajdhani } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-gaming",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PlayHaven - Toko Game BD Fisik, Konsol & Aksesoris Terlengkap",
  description: "Belanja kaset Blu-ray Disc PS5, PS4, PS3, Xbox Series X/One, dan Nintendo Switch terlengkap dengan kalkulasi ongkir akurat dan garansi region.",
};

import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import CartDrawer from "@/components/CartDrawer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${rajdhani.variable} antialiased`}
    >
      <body className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            <WhatsAppFloating />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
