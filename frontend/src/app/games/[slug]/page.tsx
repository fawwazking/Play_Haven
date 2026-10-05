"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { getHardwareProductBySlug, ProductItem } from "@/data/hardwareProducts";
import { 
  Sparkles, 
  ShoppingCart, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CheckCircle2, 
  Tag, 
  Zap,
  Gamepad2,
  PackageCheck
} from "lucide-react";

interface Variant {
  id: string;
  sku: string;
  platform_name: string;
  platform_slug: string;
  region_display: string;
  condition_display: string;
  condition: string;
  price: string;
  stock: number;
}

interface GameDetail {
  id: string;
  title: string;
  slug: string;
  publisher: string;
  release_year: number;
  description?: string;
  cover_image_url: string;
  variants: Variant[];
  min_price: number;
}

export default function UniversalProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { addToCart } = useCart();

  // State untuk Game Kaset BD
  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlatformSlug, setSelectedPlatformSlug] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<"NEW" | "USED">("NEW");
  const [toastMessage, setToastMessage] = useState("");

  // State untuk Non-Game Hardware (Konsol / Controller / Voucher)
  const [hardwareItem, setHardwareItem] = useState<ProductItem | null>(null);

  useEffect(() => {
    async function loadData() {
      // 1. Cek apakah ini produk hardware / voucher lokal
      const hw = getHardwareProductBySlug(slug);
      if (hw) {
        setHardwareItem(hw);
        setLoading(false);
        return;
      }

      // 2. Jika bukan hardware, fetch dari API catalog Django/Supabase
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/games/");
        if (res.ok) {
          const list: GameDetail[] = await res.json();
          const found = list.find((g) => g.slug === slug);
          if (found) {
            setGame(found);
            // Default pilih platform pertama
            if (found.variants && found.variants.length > 0) {
              const firstPlat = found.variants[0].platform_slug;
              setSelectedPlatformSlug(firstPlat);
              setSelectedCondition((found.variants[0].condition as "NEW" | "USED") || "NEW");
            }
          }
        }
      } catch (err) {
        console.error("Gagal load detail game:", err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadData();
    }
  }, [slug]);

  // Handle Game Add to Cart
  const handleAddToCartGame = () => {
    if (!game) return;
    
    // Cari varian yang cocok dengan platform & kondisi yang dipilih
    const matchedVariant = game.variants.find(
      (v) => v.platform_slug === selectedPlatformSlug && v.condition === selectedCondition
    ) || game.variants[0];

    if (!matchedVariant) return;

    addToCart({
      variantId: matchedVariant.id,
      gameTitle: game.title,
      gameSlug: game.slug,
      coverImage: game.cover_image_url,
      platform: matchedVariant.platform_name,
      region: matchedVariant.region_display,
      condition: matchedVariant.condition_display,
      price: Number(matchedVariant.price),
      weightGrams: 150,
      maxStock: matchedVariant.stock,
    });
    setToastMessage(`✓ ${game.title} [${matchedVariant.platform_name} - ${matchedVariant.condition_display}] masuk keranjang!`);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleDirectBuyGame = () => {
    handleAddToCartGame();
    router.push("/checkout");
  };

  // Handle Hardware Add to Cart
  const handleAddToCartHardware = () => {
    if (!hardwareItem) return;
    addToCart({
      variantId: `hw-${hardwareItem.id}`,
      gameTitle: hardwareItem.name,
      slug: hardwareItem.slug,
      coverImage: hardwareItem.image,
      platform: hardwareItem.platform || hardwareItem.category,
      region: hardwareItem.region || "Garansi Resmi",
      condition: "Brand New Sealed",
      price: hardwareItem.price,
      weightGrams: hardwareItem.categoryType === "console" ? 3500 : hardwareItem.categoryType === "accessory" ? 400 : 50,
      stock: hardwareItem.stock,
    });
    setToastMessage(`✓ ${hardwareItem.name} berhasil masuk keranjang!`);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleDirectBuyHardware = () => {
    handleAddToCartHardware();
    router.push("/checkout");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center flex-1">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-semibold">Memuat spesifikasi & ketersediaan produk...</p>
        </div>
        <Footer />
      </main>
    );
  }

  // JIKA TIDAK DITEMUKAN BAIK GAME MAUPUN HARDWARE
  if (!game && !hardwareItem) {
    return (
      <main className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center flex-1 space-y-4">
          <h1 className="font-gaming text-3xl font-bold text-slate-800">Produk Tidak Ditemukan</h1>
          <p className="text-slate-500 text-sm">Produk ini mungkin telah diperbarui atau alamat URL tidak valid.</p>
          <Link href="/" className="inline-block px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-sky-500/20">
            Kembali ke Beranda
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  // ==========================================
  // RENDER UNTUK HARDWARE / KONSOL / AKSESORIS / VOUCHER
  // ==========================================
  if (hardwareItem) {
    return (
      <main className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Header />

        {toastMessage && (
          <div className="fixed top-24 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-800 transition-colors">Beranda</Link>
            <span>/</span>
            <Link href={hardwareItem.categoryType === "console" ? "/consoles" : hardwareItem.categoryType === "accessory" ? "/accessories" : "/vouchers"} className="hover:text-slate-800 transition-colors capitalize">
              {hardwareItem.categoryType}
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold truncate max-w-xs">{hardwareItem.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
            {/* Visual Image */}
            <div className="md:col-span-5 lg:col-span-4 space-y-4">
              <div className="relative aspect-4/3 md:aspect-square rounded-2xl overflow-hidden bg-slate-900/5 border border-slate-200 p-6 flex items-center justify-center">
                <img
                  src={hardwareItem.image}
                  alt={hardwareItem.name}
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1 rounded-md">
                  {hardwareItem.platform || hardwareItem.category}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <div className="space-y-1">
                  <ShieldCheck className="w-5 h-5 mx-auto text-sky-600" />
                  <span className="block text-[10px] font-bold text-slate-700">Resmi 100%</span>
                </div>
                <div className="space-y-1">
                  <Truck className="w-5 h-5 mx-auto text-sky-600" />
                  <span className="block text-[10px] font-bold text-slate-700">Asuransi Kirim</span>
                </div>
                <div className="space-y-1">
                  <PackageCheck className="w-5 h-5 mx-auto text-sky-600" />
                  <span className="block text-[10px] font-bold text-slate-700">QC Passed</span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-sky-600 font-bold uppercase tracking-wider">
                  <span>{hardwareItem.brand || hardwareItem.category}</span>
                  <span>•</span>
                  <span>Stok Siap: {hardwareItem.stock} Unit</span>
                </div>

                <h1 className="font-gaming text-3xl sm:text-4xl font-bold text-slate-900 tracking-wide">
                  {hardwareItem.name}
                </h1>

                {/* Price */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-baseline gap-3">
                  <div>
                    {hardwareItem.originalPrice && (
                      <span className="text-xs text-slate-400 line-through block">
                        Rp {hardwareItem.originalPrice.toLocaleString("id-ID")}
                      </span>
                    )}
                    <span className="font-gaming text-3xl sm:text-4xl font-bold text-slate-900">
                      Rp {hardwareItem.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Garansi Resmi Distributor
                  </span>
                </div>

                {/* Specs / Features */}
                {(hardwareItem.specs || hardwareItem.features) && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase text-slate-500">Spesifikasi Unggulan:</span>
                    <div className="flex flex-wrap gap-2">
                      {(hardwareItem.specs || hardwareItem.features || []).map((sp, i) => (
                        <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200">
                          {sp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 space-y-2">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Deskripsi Produk:</h3>
                  <p>{hardwareItem.description}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddToCartHardware}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-xl border border-sky-500 text-sky-600 hover:bg-sky-50 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>+ Masukkan Keranjang</span>
                </button>

                <button
                  type="button"
                  onClick={handleDirectBuyHardware}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Beli Sekarang &rarr;</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  // ==========================================
  // RENDER UNTUK GAME KASET BD (MULTI-CONSOLE PICKER)
  // ==========================================
  if (!game) return null;

  // Kumpulkan list konsol unik yang tersedia untuk game ini
  const availablePlatforms = Array.from(
    new Map(
      game.variants.map((v) => [v.platform_slug, { slug: v.platform_slug, name: v.platform_name }])
    ).values()
  );

  // Filter varian berdasarkan platform yang sedang aktif
  const platformVariants = game.variants.filter((v) => v.platform_slug === selectedPlatformSlug);

  // Cari varian aktif untuk harga dan stok
  const activeVariant = platformVariants.find((v) => v.condition === selectedCondition) || platformVariants[0] || game.variants[0];
  const currentPrice = activeVariant ? Number(activeVariant.price) : Number(game.min_price);

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-800 transition-colors">Beranda</Link>
          <span>/</span>
          <Link href="/games" className="hover:text-slate-800 transition-colors">Kaset Game Fisik</Link>
          <span>/</span>
          <span className="text-slate-700 font-semibold truncate max-w-xs">{game.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          
          {/* Cover Art Box */}
          <div className="md:col-span-5 lg:col-span-4 space-y-4">
            <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-slate-900/5 border border-slate-200 shadow-md flex items-center justify-center p-3">
              <img
                src={game.cover_image_url}
                alt={game.title}
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1 rounded-md backdrop-blur-xs">
                {activeVariant?.platform_name || "Official BD Disc"}
              </div>
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <div className="space-y-1">
                <ShieldCheck className="w-5 h-5 mx-auto text-sky-600" />
                <span className="block text-[10px] font-bold text-slate-700">100% Original</span>
              </div>
              <div className="space-y-1">
                <Truck className="w-5 h-5 mx-auto text-sky-600" />
                <span className="block text-[10px] font-bold text-slate-700">Bubble Wrap</span>
              </div>
              <div className="space-y-1">
                <RotateCcw className="w-5 h-5 mx-auto text-sky-600" />
                <span className="block text-[10px] font-bold text-slate-700">Garansi Optik</span>
              </div>
            </div>
          </div>

          {/* Details & Variant Selection */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-sky-600 font-bold mb-1 uppercase tracking-wider">
                  <span>{game.publisher}</span>
                  <span>•</span>
                  <span>Rilis {game.release_year}</span>
                </div>
                <h1 className="font-gaming text-3xl sm:text-4xl font-bold text-slate-900 tracking-wide">
                  {game.title}
                </h1>
              </div>

              {/* Price Banner */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold block">Harga Varian Terpilih</span>
                  <div className="font-gaming text-3xl sm:text-4xl font-bold text-slate-900">
                    Rp {currentPrice.toLocaleString("id-ID")}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500 block">Ketersediaan Stok</span>
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mt-1">
                    Stok: {activeVariant?.stock || 20} Unit Siap Kirim
                  </span>
                </div>
              </div>

              {/* 1. FITUR PILIH KATEGORI / KONSOL (PS5, PS4, XBOX, SWITCH, DLL) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  1. Pilih Platform Konsol:
                </label>
                <div className="flex flex-wrap gap-2">
                  {availablePlatforms.map((plat) => {
                    const isPlatActive = selectedPlatformSlug === plat.slug;
                    return (
                      <button
                        key={plat.slug}
                        type="button"
                        onClick={() => setSelectedPlatformSlug(plat.slug)}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                          isPlatActive
                            ? "bg-slate-900 text-white shadow-md ring-2 ring-sky-400"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        <Gamepad2 className="w-4 h-4 text-sky-400" />
                        <span>{plat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. FITUR PILIH KONDISI (BARU SEALED VS BEKAS PRE-OWNED) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. Pilih Kondisi Kaset:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {platformVariants.map((v) => {
                    const isCondActive = selectedCondition === v.condition;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedCondition(v.condition as "NEW" | "USED")}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                          isCondActive
                            ? "border-sky-500 bg-sky-50/50 ring-2 ring-sky-500/20 shadow-xs"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">
                            {v.condition_display}
                          </span>
                          {isCondActive && <CheckCircle2 className="w-4 h-4 text-sky-500" />}
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-500 text-[11px]">{v.region_display}</span>
                          <span className="font-gaming font-bold text-slate-900">
                            Rp {Number(v.price).toLocaleString("id-ID")}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2 border-t border-slate-100">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Sinopsis & Detail Game:</h3>
                <p>
                  {game.description || `Nikmati pengalaman gaming maksimal dengan kaset fisik original ${game.title}. Semua kaset bergaransi terbaca normal di drive optik konsol Anda dengan jaminan originalitas piringan disc resmi.`}
                </p>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleAddToCartGame}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl border border-sky-500 text-sky-600 hover:bg-sky-50 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>+ Masukkan Keranjang</span>
              </button>

              <button
                type="button"
                onClick={handleDirectBuyGame}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Beli Sekarang &rarr;</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      <Footer />
    </main>
  );
}
