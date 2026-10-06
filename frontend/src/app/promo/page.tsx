"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, ShoppingCart, Flame, Tag, Percent, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

interface PromoProduct {
  id: string;
  name: string;
  slug: string;
  platform: string;
  category: string;
  discountPercent: number;
  promoPrice: number;
  originalPrice: number;
  stock: number;
  image: string;
  badge: string;
  description: string;
}

const PROMO_PRODUCTS: PromoProduct[] = [
  {
    id: "promo-spider-man-2",
    name: "Marvel's Spider-Man 2 [Reg 3 Asia]",
    slug: "marvels-spider-man-2-ps5",
    platform: "PlayStation 5",
    category: "Game Disc",
    discountPercent: 30,
    promoPrice: 699000,
    originalPrice: 999000,
    stock: 20,
    image: "/images/games/marvels-spider-man-2-ps5.png",
    badge: "FLASH SALE 30%",
    description: "Petualangan Peter Parker dan Miles Morales melawan Venom di kota New York generasi baru."
  },
  {
    id: "promo-zelda-totk",
    name: "The Legend of Zelda: Tears of the Kingdom",
    slug: "the-legend-of-zelda-tears-of-the-kingdom-switch",
    platform: "Nintendo Switch",
    category: "Game Cartridge",
    discountPercent: 25,
    promoPrice: 599000,
    originalPrice: 799000,
    stock: 20,
    image: "/images/games/the-legend-of-zelda-tears-of-the-kingdom-switch.jpg",
    badge: "BESTSELLER 25%",
    description: "Jelajahi daratan dan langit Hyrule dengan kebebasan berkreasi tak terbatas."
  },
  {
    id: "promo-elden-ring",
    name: "Elden Ring (Xbox Series X Edition)",
    slug: "elden-ring-xbox-series-xbox-series-x",
    platform: "Xbox Series X",
    category: "Game Disc",
    discountPercent: 35,
    promoPrice: 519000,
    originalPrice: 799000,
    stock: 20,
    image: "/images/games/elden-ring-xbox-series-xbox-series-x.jpg",
    badge: "DEAL OF THE WEEK 35%",
    description: "Game of the Year mahakarya Hidetaka Miyazaki dan George R.R. Martin."
  },
  {
    id: "promo-gow-ragnarok",
    name: "God of War Ragnarok [Reg 3 Asia]",
    slug: "god-of-war-ragnarok-ps5",
    platform: "PlayStation 5",
    category: "Game Disc",
    discountPercent: 28,
    promoPrice: 649000,
    originalPrice: 899000,
    stock: 20,
    image: "/images/games/god-of-war-ragnarok-ps5.png",
    badge: "SPECIAL 28%",
    description: "Perjalanan emosional Kratos dan Atreus menghadapi takdir perang sembilan alam mitologi Nordik."
  },
  {
    id: "promo-ps5-bundle",
    name: "PlayStation 5 Slim Disc + Spider-Man 2 Bundle",
    slug: "ps5-disc-edition",
    platform: "PlayStation 5",
    category: "Console Bundle",
    discountPercent: 15,
    promoPrice: 8899000,
    originalPrice: 10499000,
    stock: 20,
    image: "/images/consoles/ps5-console.png",
    badge: "CONSOLE BUNDLE",
    description: "Paket lengkap mesin PS5 Disc Edition resmi beserta kaset fisik Spider-Man 2 siap main."
  },
  {
    id: "promo-dualsense",
    name: "Sony PS5 DualSense Wireless Controller Cobalt Blue",
    slug: "dualsense-wireless-controller",
    platform: "PlayStation 5 Gear",
    category: "Accessories",
    discountPercent: 20,
    promoPrice: 999000,
    originalPrice: 1249000,
    stock: 20,
    image: "/images/consoles/dualsense-controller.png",
    badge: "GEAR SALE 20%",
    description: "Controller nirkabel dengan haptic feedback dan dynamic triggers untuk imersi gaming nyata."
  }
];

export default function PromoPage() {
  const { addToCart } = useCart();
  const router = useRouter();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleAddToCart = (p: PromoProduct) => {
    addToCart({
      variantId: `promo-${p.id}`,
      gameTitle: p.name,
      slug: p.slug,
      coverImage: p.image,
      platform: p.platform,
      region: "Promo Diskon Akhir Pekan",
      condition: "Brand New Sealed",
      price: p.promoPrice,
      weightGrams: 200,
      stock: p.stock
    });
    setToastMsg(`Berhasil menambahkan ${p.name} ke keranjang!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDirectBuy = (p: PromoProduct) => {
    addToCart({
      variantId: `promo-${p.id}`,
      gameTitle: p.name,
      slug: p.slug,
      coverImage: p.image,
      platform: p.platform,
      region: "Promo Diskon Akhir Pekan",
      condition: "Brand New Sealed",
      price: p.promoPrice,
      weightGrams: 200,
      stock: p.stock
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
      <section className="bg-gradient-to-r from-rose-950 via-slate-950 to-amber-950 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5" />
            Promo Kilat & Diskon Spesial
          </div>
          <h1 className="font-gaming text-4xl sm:text-5xl font-bold tracking-wide">
            Katalog Promo & Diskon Cuci Gudang
          </h1>
          <p className="text-slate-400 max-w-2xl text-xs sm:text-sm leading-relaxed">
            Potongan harga spesial hingga 35% untuk judul game kaset fisik pilihan, bundling konsol resmi, dan aksesoris controller original. Stok terbatas 20 unit per penawaran.
          </p>
        </div>
      </section>

      {/* Product List Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROMO_PRODUCTS.map(p => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* Image Box */}
              <Link href={`/games/${p.slug}`} className="block relative aspect-3/4 w-full bg-slate-900/5 p-4 flex items-center justify-center overflow-hidden cursor-pointer">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{p.badge}</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                  {p.platform}
                </div>
              </Link>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {p.category}
                  </span>
                  <Link href={`/games/${p.slug}`} className="block">
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-sky-600 transition-colors">
                      {p.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {p.description}
                  </p>
                </div>

                {/* Price & Buy */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-slate-400 line-through block">
                      Rp {p.originalPrice.toLocaleString("id-ID")}
                    </span>
                    <span className="font-gaming text-xl sm:text-2xl font-bold text-rose-600">
                      Rp {p.promoPrice.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(p)}
                      title="Tambah ke Keranjang"
                      className="p-2.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-xl transition-all border border-slate-200 cursor-pointer active:scale-95"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDirectBuy(p)}
                      className="px-3 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl flex items-center gap-1 transition-all shadow-xs hover:shadow-md text-xs font-bold cursor-pointer active:scale-95"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Beli</span>
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
