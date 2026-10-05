"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, ShoppingCart, Sparkles, ChevronRight, CheckCircle2, Zap } from "lucide-react";

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

import { useCart } from "@/context/CartContext";

interface PlatformCategory {
  id: string;
  title: string;
  slug: string;
  badgeBg: string;
  matchSlugs: string[];
}

const CATEGORIES: PlatformCategory[] = [
  {
    id: "ps5",
    title: "PlayStation 5 (PS5)",
    slug: "ps5",
    badgeBg: "bg-slate-900 text-white",
    matchSlugs: ["ps5"],
  },
  {
    id: "ps4",
    title: "PlayStation 4 (PS4)",
    slug: "ps4",
    badgeBg: "bg-blue-700 text-white",
    matchSlugs: ["ps4"],
  },
  {
    id: "ps3",
    title: "PlayStation 3 (PS3 Original BD)",
    slug: "ps3",
    badgeBg: "bg-slate-700 text-white",
    matchSlugs: ["ps3"],
  },
  {
    id: "xbox-series-x",
    title: "Xbox Series X",
    slug: "xbox-series-x",
    badgeBg: "bg-emerald-600 text-white",
    matchSlugs: ["xbox-series-x"],
  },
  {
    id: "xbox-one",
    title: "Xbox One",
    slug: "xbox-one",
    badgeBg: "bg-emerald-800 text-white",
    matchSlugs: ["xbox-one"],
  },
  {
    id: "switch",
    title: "Nintendo Switch",
    slug: "switch",
    badgeBg: "bg-red-600 text-white",
    matchSlugs: ["switch"],
  },
  {
    id: "wii-u",
    title: "Nintendo Wii U",
    slug: "wii-u",
    badgeBg: "bg-cyan-700 text-white",
    matchSlugs: ["wii-u"],
  },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

import staticGamesData from "@/data/staticGames.json";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";

export default function ProductListingSection() {
  const [games, setGames] = useState<Game[]>(staticGamesData as Game[]);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authActionText, setAuthActionText] = useState("memasukkan produk ke keranjang");

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

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
        // Fallback to staticGamesData already set in initial state
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

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-6">
          <div className="h-10 bg-slate-200 rounded-xl w-60 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      )}

      {/* Render Setiap Kategori Platform Sesuai Perintah Awal */}
      {!loading &&
        CATEGORIES.map((cat) => {
          const categoryGames = games.filter((g) =>
            g.variants.some((v) => cat.matchSlugs.includes(v.platform_slug))
          );

          if (categoryGames.length === 0) return null;

          return (
            <div key={cat.id} className="space-y-6">
              
              {/* Header Kategori */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${cat.badgeBg}`}>
                    {cat.title}
                  </span>
                  <h2 className="font-gaming text-2xl sm:text-3xl font-bold tracking-wide text-slate-900">
                    Koleksi Top 10 Game BD
                  </h2>
                </div>

                <Link
                  href={`/games?platform=${cat.slug}`}
                  className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
                >
                  <span>Lihat Semua {categoryGames.length} Game</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Grid 4 Kolom Card Game */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {categoryGames.map((game) => {
                  const firstVariant = game.variants[0];
                  const price = Number(game.min_price || firstVariant?.price || 0);

                  return (
                    <div
                      key={game.id}
                      className="group flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-sky-300 transition-all duration-300 overflow-hidden hover:-translate-y-1.5"
                    >
                      {/* Box Cover Art */}
                      <Link href={`/games/${game.slug}`} className="block relative aspect-3/4 w-full bg-slate-950 overflow-hidden flex items-center justify-center cursor-pointer">
                        <img
                          src={game.cover_image_url}
                          alt={game.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

                        {/* Badges on Top */}
                        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider shadow-xs ${cat.badgeBg}`}>
                            {firstVariant?.platform_name || cat.title}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/90 backdrop-blur-xs text-slate-800 shadow-xs">
                            {firstVariant?.region_display || "Reg 3 (Asia)"}
                          </span>
                        </div>

                        {/* Badges Kondisi & Stok */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between gap-1">
                          <div className="flex gap-1">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold shadow-xs bg-emerald-500 text-white">
                              Baru
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold shadow-xs bg-amber-500 text-white">
                              Bekas
                            </span>
                          </div>
                          
                          {/* Status Stok */}
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
                      </Link>

                      {/* Card Body */}
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

                        {/* Price & Action */}
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

                            {/* Tombol Beli */}
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

            </div>
          );
        })}

      {/* Auth Warning Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        actionText={authActionText}
      />

    </section>
  );
}
