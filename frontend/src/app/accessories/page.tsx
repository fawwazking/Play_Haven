"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, ShoppingCart, Gamepad2, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useSettings, useT } from "@/context/SettingsContext";

interface ControllerProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  originalPrice: number;
  stock: number;
  image: string;
  features: string[];
  description: string;
  description_en?: string;
}

const CONTROLLERS: ControllerProduct[] = [
  {
    id: "dualsense-ps5",
    name: "PlayStation 5 DualSense Wireless Controller (Cobalt Blue)",
    slug: "dualsense-wireless-controller",
    brand: "Sony PlayStation",
    price: 1149000,
    originalPrice: 1299000,
    stock: 20,
    image: "/images/consoles/dualsense-controller.png",
    features: ["Haptic Feedback Imersif", "Adaptive Triggers Dinamis", "Built-in Microphone & Headset Jack", "Motion Sensor 6-axis"],
    description: "Rasakan setiap benturan, tarikan busur, dan permukaan jalanan melalui getaran haptic feedback mikro dan adaptive trigger bertekanan dinamis.",
    description_en: "Feel every impact, bow draw and road surface through micro haptic feedback and pressure-sensitive adaptive triggers.",
  },
  {
    id: "xbox-wireless-controller",
    name: "Xbox Wireless Controller Robot White (Series X|S & PC)",
    slug: "xbox-wireless-controller-robot-white",
    brand: "Microsoft Xbox",
    price: 949000,
    originalPrice: 1099000,
    stock: 20,
    image: "/images/consoles/xbox-controller.png",
    features: ["Hybrid D-pad Akurat", "Textured Grip Pelatuk", "Bluetooth Multi-device Pairing", "Tombol Share Khusus"],
    description: "Desain ergonomis terbaik untuk kenyamanan bermain puluhan jam. Kompatibel dengan Xbox Series X|S, Xbox One, Windows PC, Android, dan iOS.",
    description_en: "An ergonomic design built for hours of comfortable play. Precision hybrid D-pad with multi-device Bluetooth pairing.",
  },
  {
    id: "switch-pro-controller",
    name: "Nintendo Switch Pro Controller (Black)",
    slug: "nintendo-switch-pro-controller-black",
    brand: "Nintendo",
    price: 899000,
    originalPrice: 1049000,
    stock: 20,
    image: "/images/consoles/switch-pro-controller.png",
    features: ["HD Rumble Presisi", "NFC Amiibo Scanner", "Baterai Tahan Hingga 40 Jam", "Stik Analog Premium"],
    description: "Controller andalan untuk game aksi seperti Zelda dan Super Smash Bros. Dilengkapi sensor gerak gyro, baterai ekstra awet, dan reader Amiibo bawaan.",
    description_en: "The go-to controller for action titles like Zelda and Smash. Gyro motion sensor, up to 40-hour battery, and built-in Amiibo reader.",
  }
];

export default function AccessoriesPage() {
  const { addToCart } = useCart();
  const router = useRouter();
  const { lang } = useSettings();
  const t = useT();
  const isEn = lang === "en";
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleAddToCart = (c: ControllerProduct) => {
    addToCart({
      variantId: `acc-${c.id}`,
      gameTitle: c.name,
      slug: c.slug,
      coverImage: c.image,
      platform: c.brand,
      region: "Garansi Resmi Sony/MS/Nintendo",
      condition: "Brand New Sealed",
      price: c.price,
      weightGrams: 500,
      stock: c.stock
    });
    setToastMsg(`Berhasil menambahkan ${c.name} ke keranjang!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDirectBuy = (c: ControllerProduct) => {
    addToCart({
      variantId: `acc-${c.id}`,
      gameTitle: c.name,
      slug: c.slug,
      coverImage: c.image,
      platform: c.brand,
      region: "Garansi Resmi Sony/MS/Nintendo",
      condition: "Brand New Sealed",
      price: c.price,
      weightGrams: 500,
      stock: c.stock
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
            <Gamepad2 className="w-3.5 h-3.5" />
            Gear & Kontroler Resmi
          </div>
          <h1 className="font-gaming text-4xl sm:text-5xl font-bold tracking-wide">
            Wireless Controller & Aksesoris Gaming
          </h1>
          <p className="text-slate-400 max-w-2xl text-xs sm:text-sm leading-relaxed">
            Tingkatkan respon kendali permainan dengan controller resmi original pabrikan Sony PlayStation, Microsoft Xbox, dan Nintendo Switch. Unit 100% baru, segel utuh, dan bergaransi resmi.
          </p>
        </div>
      </section>

      {/* Product List Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CONTROLLERS.map(c => (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* Image */}
              <Link href={`/games/${c.slug}`} className="block relative aspect-4/3 w-full bg-slate-900/5 p-6 flex items-center justify-center overflow-hidden cursor-pointer">
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1 rounded-md">
                  {c.brand}
                </div>
                <div className="absolute bottom-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  {t("inStock")}: {c.stock}
                </div>
              </Link>

              {/* Content */}
              <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Link href={`/games/${c.slug}`} className="block">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {c.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {isEn ? (c.description_en || c.description) : c.description}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {c.features.map((f, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Buy */}
                <div className="pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 line-through block">
                      Rp {c.originalPrice.toLocaleString("id-ID")}
                    </span>
                    <span className="font-gaming text-lg sm:text-2xl font-bold text-slate-900 dark:text-sky-400">
                      Rp {c.price.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="grid grid-cols-[auto_1fr] items-center gap-1.5 w-full">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(c)}
                      title={t("addToCart")}
                      className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 rounded-xl transition-all border border-slate-200 dark:border-slate-700 cursor-pointer active:scale-95 shrink-0"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDirectBuy(c)}
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
