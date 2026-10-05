"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Truck, 
  Gamepad2, 
  Sparkles,
  Home,
  Flame,
  ArrowRight,
  LogIn,
  LogOut,
  ShieldCheck
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const { totalItems, openDrawer } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const POPULAR_SUGGESTIONS = [
    { title: "EA Sports FC 26", platform: "PS5 / PS4 / Xbox / Switch", slug: "ea-sports-fc-26", price: "Rp 899.000", tag: "Hot New" },
    { title: "Black Myth: Wukong", platform: "PS5", slug: "black-myth-wukong-ps5", price: "Rp 849.000", tag: "Trending" },
    { title: "Marvel's Spider-Man 2", platform: "PS5", slug: "marvels-spider-man-2-ps5", price: "Rp 879.000", tag: "Hot" },
    { title: "The Legend of Zelda: Tears of the Kingdom", platform: "Switch", slug: "the-legend-of-zelda-tears-of-the-kingdom-nintendo-switch", price: "Rp 799.000", tag: "Best Seller" },
    { title: "God of War Ragnarok", platform: "PS5", slug: "god-of-war-ragnarok-ps5", price: "Rp 849.000", tag: "Popular" },
    { title: "Silent Hill 2 Remake", platform: "PS5", slug: "silent-hill-2-remake-ps5", price: "Rp 799.000", tag: "Horror" },
    { title: "Tekken 8", platform: "PS5", slug: "tekken-8-ps5", price: "Rp 799.000", tag: "Fighting" },
    { title: "Forza Horizon 5", platform: "Xbox", slug: "forza-horizon-5-xbox-series-x", price: "Rp 799.000", tag: "Racing" },
    { title: "Elden Ring", platform: "PS5 / Xbox", slug: "elden-ring-ps5", price: "Rp 749.000", tag: "GOTY" },
    { title: "Super Mario Bros. Wonder", platform: "Switch", slug: "super-mario-bros-wonder-switch", price: "Rp 699.000", tag: "New" },
  ];

  const filteredSuggestions = searchTerm.trim()
    ? POPULAR_SUGGESTIONS.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.platform.toLowerCase().includes(searchTerm.toLowerCase()))
    : POPULAR_SUGGESTIONS.slice(0, 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchTerm.trim()) {
      router.push(`/games?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/games");
    }
  };

  const handleSelectSuggestion = (slug: string) => {
    setShowSuggestions(false);
    setSearchTerm("");
    router.push(`/games/${slug}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-gaming text-3xl font-bold tracking-wider text-slate-900 leading-none">
                PLAY<span className="text-sky-500">HAVEN</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-400">
                Official Game Store
              </span>
            </div>
          </Link>

          {/* Search Bar Desktop with Suggestions */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-6 relative">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Cari kaset BD game, konsol, aksesoris (misal: Spider-Man, Zelda)..."
                  className="w-full pl-5 pr-12 py-3 bg-slate-100 hover:bg-slate-50 focus:bg-white text-sm text-slate-800 rounded-full border border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all outline-hidden"
                />
                <button 
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowSuggestions(false)} 
                />
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      {searchTerm.trim() ? "Hasil Pencarian Cepat" : "Game Paling Banyak Dicari"}
                    </span>
                    <span className="text-[10px] text-slate-400">Tekan Enter untuk semua hasil</span>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectSuggestion(item.slug)}
                          className="p-3 hover:bg-sky-50/70 flex items-center justify-between cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 group-hover:bg-sky-100 text-slate-600 group-hover:text-sky-700">
                              {item.platform}
                            </span>
                            <div>
                              <p className="text-xs font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                                {item.title}
                              </p>
                              <span className="text-[10px] text-slate-400">Kaset Fisik Original • Siap Kirim</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-gaming text-xs font-bold text-slate-900">
                              {item.price}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-400">
                        Tidak ada kaset yang cocok dengan &quot;{searchTerm}&quot;
                      </div>
                    )}
                  </div>

                  <div 
                    onClick={handleSearch}
                    className="p-2.5 bg-slate-50 text-center text-xs font-bold text-sky-600 hover:text-sky-700 hover:bg-sky-50 cursor-pointer border-t border-slate-100 transition-colors"
                  >
                    Lihat Semua Hasil untuk &quot;{searchTerm || "Semua Game"}&quot; &rarr;
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Actions: Cart & Auth */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={openDrawer}
              className="relative p-2.5 text-slate-700 hover:text-sky-500 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="hidden lg:inline text-xs font-semibold">Troli</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Profile / Admin Bar */}
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200">
              {isAuthenticated ? (
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${
                    isAdmin 
                      ? "bg-sky-50 text-sky-600 border-sky-300" 
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}>
                    {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {isAdmin ? "Administrator" : "Gamer Member"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800 truncate max-w-[100px]">
                        {user?.first_name || user?.username}
                      </span>
                      {isAdmin && (
                        <Link 
                          href="/admin-dashboard" 
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500 text-white hover:bg-sky-400 transition-colors"
                        >
                          Dashboard
                        </Link>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    title="Keluar / Logout"
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer ml-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-sky-600 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Masuk</span>
                  </Link>
                  <Link
                    href="/register"
                    className="text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white px-3 py-2 rounded-xl transition-all shadow-xs shadow-sky-500/20"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari game, kaset BD, konsol..."
              className="w-full pl-4 pr-10 py-2.5 bg-slate-100 text-sm text-slate-800 rounded-full border border-slate-200 focus:border-sky-500 outline-hidden"
            />
            <button type="submit" className="absolute right-3.5 top-3 text-slate-400">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Main Navigation Bar */}
      <div className="hidden md:block bg-slate-900 text-white shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            
            {/* All Products Dropdown Button */}
            <div className="relative group">
              <button className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 px-5 h-12 font-gaming font-semibold tracking-wider text-sm text-white transition-colors">
                <Menu className="w-4 h-4" />
                <span>SEMUA PRODUK</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              
              <div className="absolute left-0 top-full w-56 bg-white text-slate-800 rounded-b-xl shadow-xl border border-slate-100 hidden group-hover:block transition-all z-50 py-2">
                <Link href="/games?platform=ps5" className="flex items-center px-4 py-2.5 text-xs font-semibold hover:bg-sky-50 hover:text-sky-600">
                  PlayStation 5 (BD & Console)
                </Link>
                <Link href="/games?platform=ps4" className="flex items-center px-4 py-2.5 text-xs font-semibold hover:bg-sky-50 hover:text-sky-600">
                  PlayStation 4 Games
                </Link>
                <Link href="/games?platform=ps3" className="flex items-center px-4 py-2.5 text-xs font-semibold hover:bg-sky-50 hover:text-sky-600">
                  PlayStation 3 Classic BD
                </Link>
                <div className="h-px bg-slate-100 my-1"></div>
                <Link href="/games?platform=xbox-series-x" className="flex items-center px-4 py-2.5 text-xs font-semibold hover:bg-sky-50 hover:text-sky-600">
                  Xbox Series X Games
                </Link>
                <Link href="/games?platform=xbox-one" className="flex items-center px-4 py-2.5 text-xs font-semibold hover:bg-sky-50 hover:text-sky-600">
                  Xbox One Games
                </Link>
                <div className="h-px bg-slate-100 my-1"></div>
                <Link href="/games?platform=switch" className="flex items-center px-4 py-2.5 text-xs font-semibold hover:bg-sky-50 hover:text-sky-600">
                  Nintendo Switch Games
                </Link>
                <Link href="/games?platform=wii-u" className="flex items-center px-4 py-2.5 text-xs font-semibold hover:bg-sky-50 hover:text-sky-600">
                  Nintendo Wii U Discs
                </Link>
              </div>
            </div>

            {/* Menu Links */}
            <nav className="flex items-center gap-1 lg:gap-2">
              <Link 
                href="/" 
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                title="Kembali ke Menu Utama"
              >
                <Home className="w-4 h-4 text-sky-400" />
                <span>Home</span>
              </Link>
              <Link href="/games" className="px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                Kaset Game BD
              </Link>
              <Link href="/consoles" className="px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                Konsol Game
              </Link>
              <Link href="/accessories" className="px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                Controller & Aksesoris
              </Link>
              <Link href="/vouchers" className="px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                Gift Cards & Voucher
              </Link>
              <Link href="/promo" className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-400 hover:text-amber-300 hover:bg-slate-800 rounded-md transition-colors">
                <Sparkles className="w-3.5 h-3.5" />
                Promo & Flash Sale
              </Link>
            </nav>

            {/* Cek Ongkir Nav Button */}
            <Link 
              href="/cek-ongkir" 
              className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 py-1.5 px-3 bg-slate-800/80 hover:bg-slate-800 rounded-full border border-sky-500/30 transition-all"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Tracking & Cek Ongkir</span>
            </Link>

          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 text-white px-4 pt-3 pb-6 space-y-2 border-t border-slate-800">
          
          {/* Mobile Auth Bar */}
          <div className="pb-3 mb-2 border-b border-slate-800">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                    isAdmin ? "bg-sky-500/20 text-sky-400 border-sky-500/30" : "bg-slate-800 text-slate-300 border-slate-700"
                  }`}>
                    {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      {isAdmin ? "Admin" : "Gamer"}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {user?.first_name || user?.username}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <Link
                      href="/admin-dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs font-bold px-2.5 py-1 bg-sky-500 text-white rounded-lg"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="p-1.5 text-rose-400 hover:text-rose-300"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-bold bg-slate-800 text-white rounded-xl border border-slate-700"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-bold bg-sky-500 text-white rounded-xl"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm font-bold text-sky-400"
          >
            <Home className="w-4 h-4" />
            <span>Home (Menu Utama)</span>
          </Link>
          <Link href="/games" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-200">Kaset Game BD</Link>
          <Link href="/consoles" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-200">Konsol Game</Link>
          <Link href="/accessories" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-200">Controller & Aksesoris</Link>
          <Link href="/vouchers" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-200">Gift Cards & Voucher</Link>
          <Link href="/promo" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-amber-400">Promo & Flash Sale</Link>
        </div>
      )}
    </header>
  );
}
