"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, ShoppingCart, Gamepad2, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

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
    description: "Rasakan setiap benturan, tarikan busur, dan permukaan jalanan melalui getaran haptic feedback mikro dan adaptive trigger bertekanan dinamis."
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
    description: "Desain ergonomis terbaik untuk kenyamanan bermain puluhan jam. Kompatibel dengan Xbox Series X|S, Xbox One, Windows PC, Android, dan iOS."
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
    description: "Controller andalan untuk game aksi seperti Zelda dan Super Smash Bros. Dilengkapi sensor gerak gyro, baterai ekstra awet, dan reader Amiibo bawaan."
  }
];

export default function AccessoriesPage() {
  const { addToCart } = useCart();
  const router = useRouter();
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
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
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
                  Stok: {c.stock} Unit
                </div>
              </Link>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <Link href={`/games/${c.slug}`} className="block">
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-sky-600 transition-colors">
                      {c.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {c.description}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {c.features.map((f, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-600">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Buy */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-slate-400 line-through block">
                      Rp {c.originalPrice.toLocaleString("id-ID")}
                    </span>
                    <span className="font-gaming text-xl sm:text-2xl font-bold text-slate-900">
                      Rp {c.price.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(c)}
                      title="Tambah ke Keranjang"
                      className="p-2.5 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-600 rounded-xl transition-all border border-slate-200 cursor-pointer active:scale-95"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDirectBuy(c)}
                      className="px-3 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl flex items-center gap-1 transition-all shadow-xs hover:shadow-md text-xs font-bold cursor-pointer active:scale-95"
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
