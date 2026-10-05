"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, ShoppingCart, Zap, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

interface ConsoleProduct {
  id: string;
  name: string;
  slug: string;
  platform: string;
  category: "PlayStation" | "Xbox" | "Nintendo";
  price: number;
  originalPrice: number;
  stock: number;
  image: string;
  specs: string[];
  description: string;
}

const CONSOLES: ConsoleProduct[] = [
  {
    id: "ps5-disc",
    name: "Sony PlayStation 5 Disc Edition (Slim)",
    slug: "ps5-disc-edition",
    platform: "PlayStation 5",
    category: "PlayStation",
    price: 8499000,
    originalPrice: 9199000,
    stock: 20,
    image: "/images/consoles/ps5-console.png",
    specs: ["1TB Custom NVMe SSD", "Ultra HD Blu-ray Drive", "Tempest 3D AudioTech", "DualSense Controller Included"],
    description: "Nikmati visual grafis memukau hingga 4K 120Hz dan load time instan. Kompatibel penuh dengan seluruh kaset fisik PS5 & ribuan judul kaset PS4."
  },
  {
    id: "ps4-pro",
    name: "Sony PlayStation 4 Pro 1TB Jet Black",
    slug: "ps4-pro-1tb",
    platform: "PlayStation 4",
    category: "PlayStation",
    price: 3899000,
    originalPrice: 4299000,
    stock: 20,
    image: "/images/consoles/ps4-pro-console.png",
    specs: ["1TB HDD Storage", "Dynamic 4K Gaming", "HDR Support", "DualShock 4 V2 Included"],
    description: "Mesin gaming tangguh untuk memutar seluruh library game fisik PS4 terbaik dengan framerate lebih stabil dan opsi resolusi 4K."
  },
  {
    id: "ps3-cecha",
    name: "Sony PlayStation 3 Classic CECHA 60GB (Back-compat)",
    slug: "ps3-classic-60gb",
    platform: "PlayStation 3",
    category: "PlayStation",
    price: 2199000,
    originalPrice: 2499000,
    stock: 20,
    image: "/images/consoles/ps3-console.png",
    specs: ["60GB HDD", "Hardware PS2/PS1 Back-compat", "4x USB + Multi-card Reader", "Blu-ray Disc Drive"],
    description: "Konsol legendaris incaran para kolektor game fisik retro. Memiliki chip Emotion Engine bawaan untuk memutar CD PS1, DVD PS2, dan BD PS3 secara native."
  },
  {
    id: "ps-vita",
    name: "Sony PlayStation Vita OLED Crystal Black (PCH-1000)",
    slug: "ps-vita-oled-1000",
    platform: "PlayStation Vita",
    category: "PlayStation",
    price: 1899000,
    originalPrice: 2299000,
    stock: 15,
    image: "/images/consoles/ps-vita-console.jpg",
    specs: ["5-inch Vibrant OLED Screen", "Dual Analog Sticks", "Rear Multi-touch Pad", "Full PS Vita Physical Card Slot"],
    description: "Konsol genggam legendaris dengan layar OLED brilian 5 inci. Menjalankan seluruh kartu fisik game PS Vita dan koleksi retro PSP/PS1."
  },
  {
    id: "xbox-series-x",
    name: "Microsoft Xbox Series X 1TB Carbon Black",
    slug: "xbox-series-x-1tb",
    platform: "Xbox Series X",
    category: "Xbox",
    price: 7999000,
    originalPrice: 8799000,
    stock: 20,
    image: "/images/consoles/xbox-series-x-console.png",
    specs: ["12 Teraflops GPU", "1TB Custom NVMe SSD", "4K UHD Blu-ray Drive", "Quick Resume Multiple Games"],
    description: "Konsol paling bertenaga di generasi ini. Dukungan Smart Delivery memastikan Anda selalu memainkan versi kaset fisik terbaik tanpa biaya tambahan."
  },
  {
    id: "xbox-series-s",
    name: "Microsoft Xbox Series S 512GB Robot White Set",
    slug: "xbox-series-s-512gb",
    platform: "Xbox Series S",
    category: "Xbox",
    price: 4599000,
    originalPrice: 5199000,
    stock: 18,
    image: "/images/consoles/xbox-series-s-console.png",
    specs: ["Custom NVMe SSD Architecture", "1440p up to 120 FPS", "Xbox Velocity Architecture", "Xbox Wireless Controller Included"],
    description: "Konsol next-gen paling ringkas dan hemat daya. Menikmati kecepatan load instan, Quick Resume, dan ratusan game generasi terbaru."
  },
  {
    id: "xbox-one-s",
    name: "Microsoft Xbox One S 1TB White Edition",
    slug: "xbox-one-s-1tb",
    platform: "Xbox One",
    category: "Xbox",
    price: 2699000,
    originalPrice: 2999000,
    stock: 20,
    image: "/images/consoles/xbox-one-s-console.png",
    specs: ["1TB Storage", "4K UHD Blu-ray Player", "HDR10 Video", "Xbox Wireless Controller Included"],
    description: "Desain ramping elegan dengan internal power supply dan drive 4K Ultra HD Blu-ray untuk gaming fisik hemat energi dan hiburan sinematik."
  },
  {
    id: "switch-oled",
    name: "Nintendo Switch OLED Model with Dock & Joy-Con",
    slug: "nintendo-switch-oled-white",
    platform: "Nintendo Switch",
    category: "Nintendo",
    price: 4399000,
    originalPrice: 4799000,
    stock: 20,
    image: "/images/consoles/switch-docked-console.jpg",
    specs: ["7-inch Vibrant OLED Screen", "Enhanced Audio System", "TV Dock with LAN Port", "Joy-Con Neon Red/Blue Included"],
    description: "Layar OLED 7 inci menghadirkan warna pekat dan kontras tajam. Mainkan ribuan kaset cartridge Switch di mana saja atau sambungkan ke TV ruang keluarga."
  },
  {
    id: "switch-lite",
    name: "Nintendo Switch Lite Compact Handheld Grey Edition",
    slug: "nintendo-switch-lite-grey",
    platform: "Nintendo Switch",
    category: "Nintendo",
    price: 2499000,
    originalPrice: 2899000,
    stock: 15,
    image: "/images/consoles/switch-lite-console.jpg",
    specs: ["5.5-inch Touchscreen", "Ultra-lightweight 275g", "Integrated D-Pad Controls", "Full Switch Cartridge Compatibility"],
    description: "Didesain khusus untuk handheld gaming portabel yang ringan dan praktis. Kompatibel dengan semua game cartridge Nintendo Switch dalam mode genggam."
  },
  {
    id: "wii-classic",
    name: "Nintendo Wii Sports Deluxe Console Set White",
    slug: "nintendo-wii-sports-deluxe",
    platform: "Nintendo Wii",
    category: "Nintendo",
    price: 1599000,
    originalPrice: 1999000,
    stock: 12,
    image: "/images/consoles/wii-classic-console.jpg",
    specs: ["Motion Sensing Wii Remote", "GameCube Hardware Back-compat", "4x GameCube Controller Ports", "Optical Disc Drive"],
    description: "Konsol revolusioner yang mempopulerkan motion gaming di seluruh dunia. Memutar langsung kaset disc Nintendo Wii dan game disc Nintendo GameCube."
  },
  {
    id: "wii-u-deluxe",
    name: "Nintendo Wii U Deluxe Set 32GB Black Edition",
    slug: "wii-u-deluxe-32gb",
    platform: "Nintendo Wii U",
    category: "Nintendo",
    price: 2499000,
    originalPrice: 2899000,
    stock: 20,
    image: "/images/consoles/wii-u-console.png",
    specs: ["32GB Deluxe Storage", "Wii U Touch GamePad", "Full Wii Disc Backward Compatibility", "HDMI 1080p Support"],
    description: "Unit konsol dual-screen inovatif Nintendo. Sangat dicari untuk memainkan disc eksklusif Wii U serta kompatibel dengan seluruh kaset game Nintendo Wii."
  }
];

export default function ConsolesPage() {
  const [selectedBrand, setSelectedBrand] = useState<string>("ALL");
  const { addToCart } = useCart();
  const router = useRouter();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredConsoles = selectedBrand === "ALL" 
    ? CONSOLES 
    : CONSOLES.filter(c => c.category === selectedBrand);

  const handleAddToCart = (c: ConsoleProduct) => {
    addToCart({
      variantId: `console-${c.id}`,
      gameTitle: c.name,
      slug: c.slug,
      coverImage: c.image,
      platform: c.platform,
      region: "Garansi Resmi 1 Tahun",
      condition: "Brand New Sealed",
      price: c.price,
      weightGrams: 3500,
      stock: c.stock
    });
    setToastMsg(`Berhasil menambahkan ${c.name} ke keranjang!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDirectBuy = (c: ConsoleProduct) => {
    addToCart({
      variantId: `console-${c.id}`,
      gameTitle: c.name,
      slug: c.slug,
      coverImage: c.image,
      platform: c.platform,
      region: "Garansi Resmi 1 Tahun",
      condition: "Brand New Sealed",
      price: c.price,
      weightGrams: 3500,
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
            <Zap className="w-3.5 h-3.5" />
            Mesin Konsol Fisik Resmi
          </div>
          <h1 className="font-gaming text-4xl sm:text-5xl font-bold tracking-wide">
            Katalog Hardware Konsol Game
          </h1>
          <p className="text-slate-400 max-w-2xl text-xs sm:text-sm leading-relaxed">
            Unit mesin konsol original bergaransi resmi, siap memutar koleksi kaset Blu-ray Disc dan Cartridge fisik Anda. Setiap unit melewati uji fungsi optical drive dan sistem sebelum dikirim.
          </p>

          {/* Filter Brand */}
          <div className="flex flex-wrap gap-2 pt-4">
            {[
              { label: "Semua Konsol", val: "ALL" },
              { label: "PlayStation (PS5 / PS4 / PS3)", val: "PlayStation" },
              { label: "Xbox (Series X / One)", val: "Xbox" },
              { label: "Nintendo (Switch / Wii U)", val: "Nintendo" }
            ].map(b => (
              <button
                key={b.val}
                type="button"
                onClick={() => setSelectedBrand(b.val)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedBrand === b.val 
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
          {filteredConsoles.map(c => (
            <div
              key={c.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* Image Box */}
              <Link href={`/games/${c.slug}`} className="block relative aspect-4/3 w-full bg-slate-900/5 p-6 flex items-center justify-center overflow-hidden cursor-pointer">
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1 rounded-md">
                  {c.platform}
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

                  {/* Quick Specs */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {c.specs.map((sp, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-600">
                        {sp}
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
