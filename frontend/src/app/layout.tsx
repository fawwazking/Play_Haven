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
import { SettingsProvider } from "@/context/SettingsContext";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import CartDrawer from "@/components/CartDrawer";

// Apply saved theme/lang before paint so there is no flash of the wrong mode.
const settingsInit = `(function(){try{var r=document.documentElement;var t=localStorage.getItem("ph-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}if(t==="dark")r.classList.add("dark");var l=localStorage.getItem("ph-lang");if(l==="en"||l==="id")r.lang=l;}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${rajdhani.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: settingsInit }} />
      </head>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
        <AuthProvider>
          <SettingsProvider>
            <CartProvider>
              {children}
              <CartDrawer />
              <WhatsAppFloating />
            </CartProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
