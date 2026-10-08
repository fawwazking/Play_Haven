"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, ShoppingCart, CreditCard, Sparkles, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useSettings, useT } from "@/context/SettingsContext";

interface VoucherProduct {
  id: string;
  name: string;
  slug: string;
  category: "PlayStation" | "Xbox" | "Nintendo" | "Steam";
  denomination: string;
  price: number;
  stock: number;
  image: string;
  region: string;
  description: string;
  description_en?: string;
}

const VOUCHERS: VoucherProduct[] = [
  {
    id: "psn-100k",
    name: "PlayStation Network (PSN) Card Rp 100.000",
    slug: "psn-card-100k",
    category: "PlayStation",
    denomination: "Rp 100.000 Wallet",
    price: 105000,
    stock: 20,
    image: "/images/vouchers/psn-card.svg",
    region: "Indonesia (Reg 3)",
    description: "Kode redeem instan untuk mengisi saldo PlayStation Store Indonesia. Beli game digital, DLC, atau langganan PS Plus.",
    description_en: "Official instant redeem code to top up your Indonesian PlayStation Store balance without a credit card.",
  },
  {
    id: "psn-400k",
    name: "PlayStation Network (PSN) Card Rp 400.000",
    slug: "psn-card-400k",
    category: "PlayStation",
    denomination: "Rp 400.000 Wallet",
    price: 415000,
    stock: 20,
    image: "/images/vouchers/psn-card.svg",
    region: "Indonesia (Reg 3)",
    description: "Saldo resmi PSN Store Indonesia tanpa kartu kredit untuk membeli game AAA digital terbaru dan seasonal passes.",
    description_en: "Official Indonesian PSN Store credit for AAA digital releases, DLC expansions, and seasonal passes.",
  },
  {
    id: "ps-plus-deluxe-3m",
    name: "PlayStation Plus Deluxe Membership 3 Bulan",
    slug: "ps-plus-deluxe-3m",
    category: "PlayStation",
    denomination: "3 Bulan Subscription",
    price: 449000,
    stock: 20,
    image: "/images/vouchers/psn-card.svg",
    region: "Indonesia (Reg 3)",
    description: "Akses ratusan game katalog PS4/PS5, game klasik legendaris PS1/PS2/PSP, uji coba game berbatas waktu, dan cloud saves.",
    description_en: "Access hundreds of PS4/PS5 games, classic catalog, time-limited game trials, and online multiplayer.",
  },
  {
    id: "xbox-gamepass-ultimate",
    name: "Xbox Game Pass Ultimate 1 Bulan (PC / Console)",
    slug: "xbox-game-pass-ultimate-1m",
    category: "Xbox",
    denomination: "1 Bulan Ultimate",
    price: 159000,
    stock: 20,
    image: "/images/vouchers/xbox-game-pass.svg",
    region: "Global / Indonesia",
    description: "Termasuk Xbox Cloud Gaming, ratusan game PC & Xbox konsol, keanggotaan EA Play, dan diskon eksklusif member.",
    description_en: "One month of Xbox Game Pass Ultimate with access to hundreds of console and PC games plus EA Play.",
  },
  {
    id: "nintendo-eshop-20usd",
    name: "Nintendo eShop Card $20 USD",
    slug: "nintendo-eshop-20-usd",
    category: "Nintendo",
    denomination: "$20 USD Balance",
    price: 335000,
    stock: 20,
    image: "/images/vouchers/nintendo-eshop.svg",
    region: "United States (Reg 1)",
    description: "Redeem pada akun Nintendo eShop region US untuk membeli game indie dan game first-party eksklusif Nintendo Switch.",
    description_en: "Top up the wallet of your US-region Nintendo eShop account for games, DLC, and Nintendo Online.",
  },
  {
    id: "nintendo-eshop-50usd",
    name: "Nintendo eShop Card $50 USD",
    slug: "nintendo-eshop-50-usd",
    category: "Nintendo",
    denomination: "$50 USD Balance",
    price: 825000,
    stock: 20,
    image: "/images/vouchers/nintendo-eshop.svg",
    region: "United States (Reg 1)",
    description: "Isi saldo eShop aman dan mudah untuk membeli game blockbuster Switch secara langsung dari console Anda.",
    description_en: "Safe and instant $50 USD Nintendo eShop credit for blockbuster Switch games directly on your console.",
  }
];

export default function VouchersPage() {
  const [selectedCat, setSelectedCat] = useState<string>("ALL");
  const { addToCart } = useCart();
  const router = useRouter();
  const { lang } = useSettings();
  const t = useT();
  const isEn = lang === "en";
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredVouchers = selectedCat === "ALL" 
    ? VOUCHERS 
    : VOUCHERS.filter(v => v.category === selectedCat);

  const handleAddToCart = (v: VoucherProduct) => {
    addToCart({
      variantId: `voucher-${v.id}`,
      gameTitle: v.name,
      slug: v.slug,
      coverImage: v.image,
      platform: `${v.category} Digital`,
      region: v.region,
      condition: "Kode Digital Valid",
      price: v.price,
      weightGrams: 50,
      stock: v.stock
    });
    setToastMsg(`Berhasil menambahkan ${v.name} ke keranjang!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDirectBuy = (v: VoucherProduct) => {
    addToCart({
      variantId: `voucher-${v.id}`,
      gameTitle: v.name,
      slug: v.slug,
      coverImage: v.image,
      platform: `${v.category} Digital`,
      region: v.region,
      condition: "Kode Digital Valid",
      price: v.price,
      weightGrams: 50,
      stock: v.stock
    });
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <section className="bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold uppercase tracking-wider">
            <CreditCard className="w-3.5 h-3.5" />
            Kode Redeem Digital Otomatis
          </div>
          <h1 className="font-gaming text-4xl sm:text-5xl font-bold tracking-wide">
            Gift Cards & Voucher Game
          </h1>
          <p className="text-slate-400 max-w-2xl text-xs sm:text-sm leading-relaxed">
            Beli saldo PlayStation Network (PSN), Xbox Game Pass, dan Nintendo eShop resmi tanpa kartu kredit. Pengiriman kode voucher digital cepat, aman, dan bergaransi 100% valid.
          </p>

          {/* Filter Category */}
          <div className="flex flex-wrap gap-2 pt-4">
            {[
              { label: "Semua Voucher", val: "ALL" },
              { label: "PlayStation Network (PSN)", val: "PlayStation" },
              { label: "Xbox Game Pass", val: "Xbox" },
              { label: "Nintendo eShop", val: "Nintendo" }
            ].map(b => (
              <button
                key={b.val}
                type="button"
                onClick={() => setSelectedCat(b.val)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCat === b.val 
                    ? "bg-sky-500 text-white shadow-md shadow-sky-500/30" 
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product List Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVouchers.map(v => (
            <div
              key={v.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* Image Box */}
              <Link href={`/games/${v.slug}`} className="block relative aspect-16/9 w-full bg-slate-900/5 p-6 flex items-center justify-center overflow-hidden cursor-pointer">
                <img
                  src={v.image}
                  alt={v.name}
                  className="w-28 h-28 object-contain transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1 rounded-md">
                  {v.category}
                </div>
                <div className="absolute bottom-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  {t("inStock")}: {v.stock}
                </div>
              </Link>

              {/* Content */}
              <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">
                    {v.denomination} • {v.region}
                  </div>
                  <Link href={`/games/${v.slug}`} className="block">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {v.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {isEn ? (v.description_en || v.description) : v.description}
                  </p>
                </div>

                {/* Price & Buy */}
                <div className="pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">
                      {t("voucherPrice")}
                    </span>
                    <span className="font-gaming text-lg sm:text-2xl font-bold text-slate-900 dark:text-sky-400">
                      Rp {v.price.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="grid grid-cols-[auto_1fr] items-center gap-1.5 w-full">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(v)}
                      title={t("addToCart")}
                      className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 rounded-xl transition-all border border-slate-200 dark:border-slate-700 cursor-pointer active:scale-95 shrink-0"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDirectBuy(v)}
                      className="w-full py-2.5 px-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl flex items-center justify-center gap-1 transition-all shadow-xs hover:shadow-md text-xs font-bold cursor-pointer active:scale-95 truncate"
                    >
                      <Zap className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{t("buyNow")}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
