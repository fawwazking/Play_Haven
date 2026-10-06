"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import { getHardwareProductBySlug, ProductItem } from "@/data/hardwareProducts";
import staticGamesData from "@/data/staticGames.json";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
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
  const rawSlug = (Array.isArray(params?.slug) ? params.slug[0] : params?.slug) || "";
  const slug = decodeURIComponent(rawSlug).trim().toLowerCase();
  const { addToCart } = useCart();

  // State untuk Game Kaset BD
  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlatformSlug, setSelectedPlatformSlug] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<"NEW" | "USED">("NEW");
  const [toastMessage, setToastMessage] = useState("");

  // State untuk Non-Game Hardware (Konsol / Controller / Voucher)
  const [hardwareItem, setHardwareItem] = useState<ProductItem | null>(null);

  // State Auth Modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authActionText, setAuthActionText] = useState("melanjutkan transaksi");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      setGame(null);
      setHardwareItem(null);

      // 1. Cek apakah ini produk hardware / voucher lokal
      const hw = getHardwareProductBySlug(slug);
      if (hw) {
        setHardwareItem(hw);
        setLoading(false);
        return;
      }

      // Helper pencarian game statis yang toleran terhadap format slug
      const findGameInStatic = (targetSlug: string): GameDetail | undefined => {
        const norm = targetSlug.toLowerCase().trim();
        const list = (staticGamesData as unknown) as GameDetail[];

        // Direct match
        const exact = list.find((g) => g.slug.toLowerCase() === norm);
        if (exact) return exact;

        // Platform suffix variations
        const cleanNorm = norm
          .replace(/-nintendo-switch$/, "-switch")
          .replace(/-(ps[345]|xbox[a-z0-9\-]*|switch|wii-?u?)$/i, "");

        const suffixMatched = list.find((g) => {
          const gClean = g.slug.toLowerCase().replace(/-(ps[345]|xbox[a-z0-9\-]*|switch|wii-?u?)$/i, "");
          return g.slug.toLowerCase() === cleanNorm || gClean === cleanNorm || g.slug.toLowerCase().startsWith(cleanNorm + "-");
        });
        if (suffixMatched) return suffixMatched;

        // Hyphen-less match
        const stripped = norm.replace(/[^a-z0-9]/g, "");
        return list.find((g) => g.slug.toLowerCase().replace(/[^a-z0-9]/g, "") === stripped);
      };

      // 2. Jika bukan hardware, cari di data statis lokal
      try {
        const staticFound = findGameInStatic(slug);
        if (staticFound) {
          setGame(staticFound);
          if (staticFound.variants && staticFound.variants.length > 0) {
            setSelectedPlatformSlug(staticFound.variants[0].platform_slug);
            setSelectedCondition((staticFound.variants[0].condition as "NEW" | "USED") || "NEW");
          }
        }

        // 3. Coba fetch ke API backend untuk data realtime (jika backend aktif)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        try {
          // Coba retrieve endpoint spesifik slug terlebih dahulu
          const detailRes = await fetch(`${API_BASE}/api/v1/games/${encodeURIComponent(slug)}/`, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (detailRes.ok) {
            const detail: GameDetail = await detailRes.json();
            if (detail && detail.id) {
              setGame((prev) => ({
                ...detail,
                description: detail.description?.trim() || prev?.description || staticFound?.description || ""
              }));
              if (detail.variants && detail.variants.length > 0) {
                setSelectedPlatformSlug(detail.variants[0].platform_slug);
                setSelectedCondition((detail.variants[0].condition as "NEW" | "USED") || "NEW");
              }
            }
          } else {
            // Fallback cari di list
            const listRes = await fetch(`${API_BASE}/api/v1/games/`, { signal: controller.signal });
            if (listRes.ok) {
              const list: GameDetail[] = await listRes.json();
              const found = list.find((g) => g.slug.toLowerCase() === slug.toLowerCase() || g.slug.toLowerCase().startsWith(slug.toLowerCase()));
              if (found) {
                setGame((prev) => ({
                  ...found,
                  description: found.description?.trim() || prev?.description || staticFound?.description || ""
                }));
                if (found.variants && found.variants.length > 0) {
                  setSelectedPlatformSlug(found.variants[0].platform_slug);
                  setSelectedCondition((found.variants[0].condition as "NEW" | "USED") || "NEW");
                }
              }
            }
          }
        } catch {
          // Backend offline atau timeout, data statis sudah terpasang
        }
      } catch (err) {
        console.error("Gagal load detail game:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  // Handle Game Add to Cart
  const handleAddToCartGame = () => {
    if (!isAuthenticated) {
      setAuthActionText(`menambahkan ${game?.title || "produk"} ke keranjang`);
      setIsAuthModalOpen(true);
      return;
    }

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
    if (!isAuthenticated) {
      setAuthActionText(`membeli ${game?.title || "produk"}`);
      setIsAuthModalOpen(true);
      return;
    }
    handleAddToCartGame();
    router.push("/checkout");
  };

  // Handle Hardware Add to Cart
  const handleAddToCartHardware = () => {
    if (!isAuthenticated) {
      setAuthActionText(`menambahkan ${hardwareItem?.name || "produk"} ke keranjang`);
      setIsAuthModalOpen(true);
      return;
    }

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
    if (!isAuthenticated) {
      setAuthActionText(`membeli ${hardwareItem?.name || "produk"}`);
      setIsAuthModalOpen(true);
      return;
    }
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
                  <p>
                    {hardwareItem.description?.trim() 
                      ? hardwareItem.description 
                      : `Unit resmi ${hardwareItem.name} original bergaransi resmi PlayHaven Store. Kondisi 100% Brand New Sealed & siap kirim.`}
                  </p>
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
            <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl flex items-center justify-center">
              <img
                src={game.cover_image_url}
                alt={game.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/10 pointer-events-none" />
              <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1 rounded-md backdrop-blur-xs border border-white/10 shadow-sm">
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
                  {game.description?.trim() 
                    ? game.description 
                    : `Nikmati pengalaman gaming maksimal dengan kaset fisik original ${game.title}. Semua kaset bergaransi terbaca normal di drive optik konsol Anda dengan jaminan originalitas piringan disc resmi.`}
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

      {/* Auth Modal Warning */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        actionText={authActionText}
      />
    </main>
  );
}
