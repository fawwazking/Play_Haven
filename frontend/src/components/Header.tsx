"use client";

import React, { useState, useMemo } from "react";
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
  ShieldCheck,
  Sun,
  Moon
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useSettings, useT } from "@/context/SettingsContext";
import SettingsMenu from "@/components/SettingsMenu";
import staticGamesData from "@/data/staticGames.json";
import { ALL_HARDWARE_PRODUCTS } from "@/data/hardwareProducts";

interface SearchItem {
  id: string;
  title: string;
  platform: string;
  slug: string;
  price: string;
  cover: string;
  category: "Game BD" | "Konsol" | "Aksesoris" | "Voucher";
  publisher?: string;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const { totalItems, openDrawer } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme, lang, setLang } = useSettings();
  const t = useT();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Susun katalog lengkap (game BD + hardware konsol/aksesoris/voucher)
  const searchCatalog: SearchItem[] = useMemo(() => {
    interface RawGame {
      id: string;
      title: string;
      slug: string;
      publisher: string;
      cover_image_url: string;
      min_price?: number;
      primary_platform?: string;
      variants?: Array<{ platform_name: string; price: string | number }>;
    }

    const gameItems: SearchItem[] = (staticGamesData as unknown as RawGame[]).map((g) => {
      const firstVariant = g.variants?.[0];
      const priceNum = Number(g.min_price || firstVariant?.price || 0);
      return {
        id: `game-${g.id}`,
        title: g.title,
        platform: firstVariant?.platform_name || g.primary_platform || "Console BD",
        slug: g.slug,
        price: `Rp ${priceNum.toLocaleString("id-ID")}`,
        cover: g.cover_image_url || "/images/consoles/ps5-console.png",
        category: "Game BD",
        publisher: g.publisher,
      };
    });

    const hwItems: SearchItem[] = ALL_HARDWARE_PRODUCTS.map((h) => ({
      id: `hw-${h.id}`,
      title: h.name,
      platform: h.platform || (h.categoryType === "console" ? "Konsol" : h.categoryType === "accessory" ? "Aksesoris" : "Voucher"),
      slug: h.slug,
      price: `Rp ${Number(h.price).toLocaleString("id-ID")}`,
      cover: h.image,
      category: h.categoryType === "console" ? "Konsol" : h.categoryType === "accessory" ? "Aksesoris" : "Voucher",
      publisher: h.brand || h.category,
    }));

    return [...gameItems, ...hwItems];
  }, []);

  // Filter dinamis hasil pencarian
  const filteredSuggestions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      const topSlugs = [
        "ea-sports-fc-26",
        "black-myth-wukong-ps5",
        "marvels-spider-man-2-ps5",
        "the-legend-of-zelda-tears-of-the-kingdom-switch",
        "god-of-war-ragnarok-ps5",
        "ps5-disc-edition",
        "elden-ring-xbox-series-xbox-series-x",
        "dualsense-wireless-controller"
      ];
      return searchCatalog.filter((item) => topSlugs.includes(item.slug)).slice(0, 6);
    }

    return searchCatalog
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(term) ||
          item.platform.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term) ||
          (item.publisher && item.publisher.toLowerCase().includes(term))
        );
      })
      .slice(0, 8);
  }, [searchTerm, searchCatalog]);

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

  // Helper render dropdown suggestions (digunakan untuk desktop dan mobile)
  const renderSuggestionsDropdown = () => (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/10 md:bg-transparent" 
        onClick={() => setShowSuggestions(false)} 
      />
      <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            {searchTerm.trim() ? t("searchQuick") : t("searchPopular")}
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">{t("searchEnter")}</span>
        </div>

        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectSuggestion(item.slug)}
                className="p-2.5 sm:p-3 hover:bg-sky-50/70 flex items-center justify-between cursor-pointer transition-colors group gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Cover Thumbnail Game: ukuran proporsional kaset box art 3:4 */}
                  <div className="relative w-12 h-16 sm:w-13 sm:h-[70px] rounded-xl overflow-hidden bg-slate-900/5 shrink-0 border border-slate-200/90 shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all duration-200 flex items-center justify-center p-0.5">
                    <img
                      src={item.cover}
                      alt={item.title}
                      className={`w-full h-full rounded-lg ${
                        item.category === "Game BD" ? "object-cover" : "object-contain bg-white"
                      }`}
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/consoles/ps5-console.png";
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-sky-600 transition-colors line-clamp-1">
                        {item.title}
                      </p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md shrink-0 border ${
                        item.category === "Game BD"
                          ? "bg-sky-50 text-sky-700 border-sky-200"
                          : item.category === "Konsol"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : item.category === "Aksesoris"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}>
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 truncate">
                      <span className="font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[9px] shrink-0">
                        {item.platform}
                      </span>
                      <span>{t("login")}</span>
                      <span className="truncate">
                        {item.category === "Game BD" ? t("warrantyOptical") : t("warrantyOfficial")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-gaming text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-600">
                    {item.price}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">
              {t("searchEmpty")} &quot;{searchTerm}&quot;
            </div>
          )}
        </div>

        <div 
          onClick={handleSearch}
          className="p-2.5 bg-slate-50 text-center text-xs font-bold text-sky-600 hover:text-sky-700 hover:bg-sky-50 cursor-pointer border-t border-slate-100 transition-colors"
        >
          {t("searchSeeAll")} &quot;{searchTerm || t("searchAll")}&quot; &rarr;
        </div>
      </div>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="PlayHaven Home">
            <div className="w-9 h-9 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900">
              <Gamepad2 className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <span className="font-gaming text-2xl font-bold text-slate-900 dark:text-white leading-none tracking-tight">
              PlayHaven
            </span>
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
                  placeholder={t("searchDesktop")}
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

            {/* Suggestions Dropdown Desktop */}
            {showSuggestions && renderSuggestionsDropdown()}
          </div>

          {/* Right Actions: Cart & Auth */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={openDrawer}
              className="relative p-2.5 text-slate-700 hover:text-sky-500 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="hidden lg:inline text-xs font-semibold">{t("cart")}</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Dark/Light Quick Toggle (matahari/bulan ringkas di pojok kanan navbar) */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === "dark" ? t("switchToLight") : t("switchToDark")}
              aria-label={theme === "dark" ? t("switchToLight") : t("switchToDark")}
              className="p-2.5 rounded-full text-slate-700 hover:text-sky-500 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {theme === "dark" ? (
                <Moon className="w-5 h-5 text-sky-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500" />
              )}
            </button>

            {/* User Profile Trigger -> buka popup Settings (Bahasa & Tema) */}
            <div className="relative hidden sm:block pl-2 border-l border-slate-200">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((o) => !o)}
                aria-expanded={profileMenuOpen}
                aria-label={t("settings")}
                className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer text-left group"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                    isAdmin
                      ? "bg-sky-50 text-sky-600 border-sky-300 group-hover:border-sky-400"
                      : "bg-slate-100 text-slate-700 border-slate-200 group-hover:border-slate-300"
                  }`}
                >
                  {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {isAuthenticated ? (isAdmin ? t("admin") : t("gamer")) : t("gamer")}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[100px]">
                      {user?.first_name || user?.username || t("settings")}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileMenuOpen ? "rotate-180" : ""}`} />
                  </div>
                </div>
              </button>

              <SettingsMenu open={profileMenuOpen} onClose={() => setProfileMenuOpen(false)} align="right" />
            </div>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar with Suggestions */}
        <div className="md:hidden pb-4 relative">
          <form onSubmit={handleSearch}>
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder={t("searchMobile")}
                className="w-full pl-4 pr-10 py-2.5 bg-slate-100 text-sm text-slate-800 rounded-full border border-slate-200 focus:border-sky-500 outline-hidden"
              />
              <button type="submit" className="absolute right-3.5 top-3 text-slate-400">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Suggestions Dropdown Mobile */}
          {showSuggestions && renderSuggestionsDropdown()}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="hidden md:block bg-slate-900 text-white shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            
            {/* All Products Dropdown Button */}
            <div className="relative group">
              <button className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 px-5 h-12 font-gaming font-semibold tracking-wider text-sm text-white transition-colors">
                <Menu className="w-4 h-4" />
                <span>{t("allProducts")}</span>
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
                title={t("homeTitle")}
              >
                <Home className="w-4 h-4 text-sky-400" />
                <span>{t("navHome")}</span>
              </Link>
              <Link href="/games" className="px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                {t("navGames")}
              </Link>
              <Link href="/consoles" className="px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                {t("navConsoles")}
              </Link>
              <Link href="/accessories" className="px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                {t("navAccessories")}
              </Link>
              <Link href="/vouchers" className="px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                {t("navVouchers")}
              </Link>
              <Link href="/promo" className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-400 hover:text-amber-300 hover:bg-slate-800 rounded-md transition-colors">
                <Sparkles className="w-3.5 h-3.5" />
                {t("navPromo")}
              </Link>
            </nav>

            {/* Cek Ongkir Nav Button */}
            <Link 
              href="/cek-ongkir" 
              className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 py-1.5 px-3 bg-slate-800/80 hover:bg-slate-800 rounded-full border border-sky-500/30 transition-all"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{t("navTrack")}</span>
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
                      {isAdmin ? t("admin") : t("gamer")}
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
                    type="button"
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
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-bold bg-sky-500 text-white rounded-xl"
                >
                  {t("register")}
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
            <span>{t("navHome")}</span>
          </Link>
          <Link href="/games" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-200">{t("navGames")}</Link>
          <Link href="/consoles" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-200">{t("navConsoles")}</Link>
          <Link href="/accessories" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-200">{t("navAccessories")}</Link>
          <Link href="/vouchers" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-200">{t("navVouchers")}</Link>
          <Link href="/promo" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-medium text-amber-400">{t("navPromo")}</Link>

          {/* Mobile Settings Row: tema + pemilih bahasa langsung (ID | EN) */}
          <div className="pt-3 mt-2 border-t border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">{t("appearance")}</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 font-bold"
              >
                {theme === "dark" ? <Moon className="w-3.5 h-3.5 text-sky-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                <span>{theme === "dark" ? t("themeDark") : t("themeLight")}</span>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">{t("language")}</span>
              <div className="flex items-center gap-1 rounded-lg bg-slate-800 border border-slate-700 p-0.5">
                {(["id", "en"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLang(l)}
                    aria-pressed={lang === l}
                    className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
                      lang === l ? "bg-sky-500 text-white" : "text-slate-300"
                    }`}
                  >
                    {l === "id" ? "ID" : "EN"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
