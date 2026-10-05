"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import { Sparkles, ShoppingCart, Filter, Search, Zap, CheckCircle2 } from "lucide-react";

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

interface Game {
  id: string;
  title: string;
  slug: string;
  publisher: string;
  release_year: number;
  cover_image_url: string;
  variants: Variant[];
  min_price: number;
  total_stock?: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

import staticGamesData from "@/data/staticGames.json";

function GamesContent() {
  const searchParams = useSearchParams();
  const platformParam = searchParams.get("platform");
  const queryParam = searchParams.get("search");

  const [games, setGames] = useState<Game[]>(staticGamesData as Game[]);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState(queryParam || "");
  const [selectedPlatform, setSelectedPlatform] = useState(platformParam || "ALL");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authActionText, setAuthActionText] = useState("memasukkan produk ke keranjang");

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (platformParam) {
      setSelectedPlatform(platformParam);
    }
  }, [platformParam]);

  useEffect(() => {
    if (queryParam !== null) {
      setSearchQuery(queryParam);
    }
  }, [queryParam]);

  useEffect(() => {
    async function loadGames() {
      try {
        const res = await fetch(`${API_BASE}/api/v1/games/`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setGames(data);
          }
        }
      } catch (e) {
        // Fallback to staticGamesData
      } finally {
        setLoading(false);
      }
    }
    loadGames();
  }, []);

  const handleAddToCart = (game: Game, variant?: Variant) => {
    if (!isAuthenticated) {
      setAuthActionText(`menambahkan ${game.title} ke keranjang`);
      setIsAuthModalOpen(true);
      return;
    }

    const v = variant || game.variants[0];
    if (!v) return;

    addToCart({
      variantId: v.id,
      gameTitle: game.title,
      gameSlug: game.slug,
      coverImage: game.cover_image_url,
      platform: v.platform_name,
      region: v.region_display,
      condition: v.condition_display,
      price: Number(v.price),
      weightGrams: 150,
      maxStock: v.stock,
    });

    setToastMsg(`✓ ${game.title} ditambahkan ke keranjang!`);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleDirectBuy = (game: Game, variant?: Variant) => {
    if (!isAuthenticated) {
      setAuthActionText(`membeli ${game.title}`);
      setIsAuthModalOpen(true);
      return;
    }

    const v = variant || game.variants[0];
    if (!v) return;

    addToCart({
      variantId: v.id,
      gameTitle: game.title,
      gameSlug: game.slug,
      coverImage: game.cover_image_url,
      platform: v.platform_name,
      region: v.region_display,
      condition: v.condition_display,
      price: Number(v.price),
      weightGrams: 150,
      maxStock: v.stock,
    });

    router.push("/checkout");
  };

  const filteredGames = games.filter((g) => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.publisher.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedPlatform === "ALL") return true;

    return g.variants.some((v) => {
      if (selectedPlatform === "ps5") return v.platform_slug === "ps5";
      if (selectedPlatform === "ps4") return v.platform_slug === "ps4";
      if (selectedPlatform === "ps3") return v.platform_slug === "ps3";
      if (selectedPlatform.includes("xbox")) return v.platform_slug.includes("xbox");
      if (selectedPlatform === "switch") return v.platform_slug === "switch";
      if (selectedPlatform === "wii-u") return v.platform_slug === "wii-u";
      return v.platform_slug === selectedPlatform;
    });
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-gaming text-3xl sm:text-4xl font-bold tracking-wide text-slate-900">
            Katalog Lengkap Kaset Game Fisik
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Menampilkan {filteredGames.length} judul game kaset BD original bergaransi.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Cari judul game..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:border-sky-500 outline-hidden shadow-2xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
        </div>
      </div>

      {/* Platform Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { label: "Semua Platform", val: "ALL" },
          { label: "PlayStation 5", val: "ps5" },
          { label: "PlayStation 4", val: "ps4" },
          { label: "PlayStation 3 (Classic)", val: "ps3" },
          { label: "Xbox Series X / One", val: "xbox" },
          { label: "Nintendo Switch", val: "switch" },
        ].map((tab) => (
          <button
            key={tab.val}
            onClick={() => setSelectedPlatform(tab.val)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedPlatform === tab.val
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid Products */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 py-10">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="py-20 text-center space-y-2">
          <p className="text-slate-500 text-sm">Tidak ada game yang sesuai filter Anda.</p>
          <button
            onClick={() => { setSelectedPlatform("ALL"); setSearchQuery(""); }}
            className="text-xs font-bold text-sky-600 hover:underline"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredGames.map((game) => {
            const firstVariant = game.variants[0];
            const platformName = firstVariant?.platform_name || "Console";
            const price = Number(game.min_price || firstVariant?.price || 0);

            return (
              <div
                key={game.id}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
              >
                <div className="relative aspect-3/4 w-full bg-slate-900/5 overflow-hidden flex items-center justify-center">
                  <img
                    src={game.cover_image_url}
                    alt={game.title}
                    className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider bg-slate-900 text-white shadow-xs">
                      {platformName}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between gap-1">
                    <div className="flex gap-1">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold shadow-xs bg-emerald-500 text-white">
                        Baru
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold shadow-xs bg-amber-500 text-white">
                        Bekas
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold shadow-xs ${
                      (game.total_stock ?? 20) > 5 
                        ? 'bg-emerald-600/90 text-white backdrop-blur-xs' 
                        : (game.total_stock ?? 20) > 0 
                          ? 'bg-amber-600/90 text-white backdrop-blur-xs' 
                          : 'bg-rose-600 text-white'
                    }`}>
                      {(game.total_stock ?? 20) > 0 ? `Stok: ${game.total_stock ?? 20}` : 'Habis'}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>{game.publisher}</span>
                      <span>{game.release_year}</span>
                    </div>
                    <Link href={`/games/${game.slug}`}>
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug">
                        {game.title}
                      </h3>
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-end justify-between gap-2">
                    <div>
                      <span className="block text-[10px] uppercase font-semibold text-slate-400">
                        Mulai dari
                      </span>
                      <span className="font-gaming text-lg sm:text-xl font-bold text-slate-900 leading-none">
                        Rp {price.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Tombol Keranjang */}
                      <button
                        type="button"
                        onClick={() => handleAddToCart(game, firstVariant)}
                        title="Tambah ke Keranjang"
                        className="p-2 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-600 rounded-xl transition-all border border-slate-200 cursor-pointer active:scale-95"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>

                      {/* Tombol Beli Langsung */}
                      <button
                        type="button"
                        onClick={() => handleDirectBuy(game, firstVariant)}
                        className="px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl flex items-center gap-1 transition-all shadow-xs hover:shadow-md text-xs font-bold cursor-pointer active:scale-95"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Beli</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Auth Modal Warning */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        actionText={authActionText}
      />
    </div>
  );
}

export default function GamesPage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <Suspense fallback={<div className="p-10 text-center">Memuat...</div>}>
        <GamesContent />
      </Suspense>
      <Footer />
    </main>
  );
}
