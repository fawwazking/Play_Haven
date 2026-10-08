"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "id" | "en";
export type Theme = "light" | "dark";

interface SettingsCtx {
  lang: Lang;
  theme: Theme;
  setLang: (l: Lang) => void;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const Ctx = createContext<SettingsCtx | null>(null);

const LANG_KEY = "ph-lang";
const THEME_KEY = "ph-theme";

// ponytail: inline dictionary, no i18n lib. Split per-locale files when a 3rd language lands.
const DICT = {
  id: {
    // nav / header
    officialStore: "Toko Resmi",
    cart: "Keranjang",
    login: "Masuk",
    register: "Daftar",
    logout: "Keluar",
    admin: "Administrator",
    gamer: "Anggota Gamer",
    allProducts: "SEMUA PRODUK",
    navHome: "Beranda",
    navGames: "Kaset Game BD",
    navConsoles: "Konsol Game",
    navAccessories: "Controller & Aksesoris",
    navVouchers: "Gift Card & Voucher",
    navPromo: "Promo & Flash Sale",
    navTrack: "Cek Ongkir",
    homeTitle: "Kembali ke Menu Utama",
    // search
    searchDesktop: "Cari kaset BD game, konsol, aksesoris (misal: Spider-Man, Zelda)...",
    searchMobile: "Cari game, kaset BD, konsol...",
    searchQuick: "Hasil Pencarian Cepat",
    searchPopular: "Game & Produk Terpopuler",
    searchEnter: "Tekan Enter untuk semua hasil",
    searchEmpty: "Tidak ada produk yang cocok dengan",
    searchSeeAll: "Lihat Semua Hasil untuk",
    searchAll: "Semua Produk",
    catGame: "Kaset Game BD",
    catConsole: "Konsol",
    catAccessory: "Aksesoris",
    catVoucher: "Voucher",
    warrantyOptical: "Kaset Fisik Original • Garansi Optik",
    warrantyOfficial: "Resmi & Bergaransi",
    // settings
    settings: "Pengaturan",
    settingsTitle: "Pengaturan",
    language: "Bahasa",
    appearance: "Tampilan",
    themeLight: "Terang",
    themeDark: "Gelap",
    langIndonesian: "Indonesia",
    langEnglish: "English",
    closeSettings: "Tutup pengaturan",
    switchToDark: "Beralih ke mode gelap",
    switchToLight: "Beralih ke mode terang",
    // footer
    footerAbout:
      "Toko spesialis Blu-ray Disc game konsol multi-platform (PlayStation, Xbox, Nintendo) original terlengkap dengan garansi region dan transparansi kondisi fisik.",
    footerCatalog: "Katalog Konsol",
    footerService: "Layanan Pelanggan",
    footerHours: "Jam Operasional & Bantuan",
    footerHoursDesc:
      "Layanan CS & Pengiriman Paket siap melayani setiap hari untuk memastikan pesanan Anda sampai tepat waktu.",
    footerHoursTime: "Senin - Minggu: 09:00 - 21:00 WIB",
    footerHoursShip: "Pengiriman Instan & Reguler Seluruh Indonesia",
    footerCopy: "Hak Cipta Dilindungi.",
    footerTagline: "Pusat Game Fisik, Konsol & Voucher Digital Indonesia",
    // cart
    cartTitle: "Keranjang Belanja",
    cartItems: "item kaset / produk",
    cartEmpty: "Keranjang masih kosong",
    cartEmptyDesc: "Pilih kaset game favoritmu atau konsol impian dan masukkan ke keranjang belanja.",
    cartBrowse: "Mulai Jelajah Kaset",
    cartSubtotal: "Subtotal Belanja",
    cartShippingNote: "Pengiriman dilindungi Bubble Wrap & Asuransi Kaset",
    cartCheckout: "Lanjut ke Pembayaran",
    cartRemove: "Hapus",
    remove: "Hapus",
    cartDrawerTitle: "Keranjang Belanja",
    cartItemsSuffix: "item kaset / produk",
    cartEmptyHint: "Pilih kaset game favoritmu atau konsol impian dan masukkan ke keranjang belanja.",
    cartStartShopping: "Mulai Jelajah Kaset",
    cartShippingCalc: "Estimasi Pengiriman",
    cartShippingAtCheckout: "Dihitung saat checkout",
    cartSafePackaging: "Pengiriman dilindungi Bubble Wrap & Asuransi Kaset",
    footerCustomerService: "Layanan Pelanggan",
    footerDays: "Senin - Minggu: 09:00 - 21:00 WIB",
    footerShipping: "Pengiriman Instan & Reguler Seluruh Indonesia",
    footerRights: "Hak Cipta Dilindungi.",
    // whatsapp
    waSupport: "PlayHaven Support",
    waSubtitle: "Online • CS Game & Kaset",
    waDesk: "PlayHaven Help Desk",
    waJustNow: "Baru saja",
    waReply: "Respon rata-rata di bawah 5 menit",
    waAsk: "Tanya CS",
    // hero
    heroCta: "Pesan Kaset Sekarang",
    heroSub: "Stok siap kirim hari ini",
    // kartu produk & katalog
    startingFrom: "Mulai dari",
    addToCart: "Tambah Keranjang",
    buyNow: "Beli",
    buyNowFull: "Beli Sekarang",
    conditionNew: "Baru",
    conditionUsed: "Bekas",
    inStock: "Stok",
    outOfStock: "Habis",
    topCollection: "Koleksi Top 10 Game BD",
    viewAllGames: "Lihat Semua",
    addedToCart: "ditambahkan ke keranjang!",
    // detail produk
    synopsisTitle: "Sinopsis & Detail Game:",
    descTitle: "Deskripsi Produk:",
    selectConsole: "Pilih Platform Konsol:",
    selectCondition: "Pilih Kondisi Kaset:",
    specsTitle: "Spesifikasi Utama:",
    voucherPrice: "Harga Voucher",
    catalogTitle: "Katalog Lengkap Kaset Game Fisik",
    displaying: "Menampilkan",
    catalogCount: "judul game kaset BD original bergaransi.",
    catalogSearch: "Cari judul game...",
    tabAllPlatforms: "Semua Platform",
    tabPs3: "PlayStation 3 (Classic)",
    tabXbox: "Xbox Series X / One",
    noMatch: "Tidak ada game yang sesuai filter Anda.",
    resetFilters: "Reset Semua Filter",
    cartAdded: "ditambahkan ke keranjang!",
    // generic
    buy: "Beli",
    new: "Baru",
    search: "Cari",
    stock: "Stok",
  },
  en: {
    officialStore: "Official Store",
    cart: "Cart",
    login: "Sign In",
    register: "Sign Up",
    logout: "Log Out",
    admin: "Administrator",
    gamer: "Gamer Member",
    allProducts: "ALL PRODUCTS",
    navHome: "Home",
    navGames: "Game Discs",
    navConsoles: "Consoles",
    navAccessories: "Controllers & Accessories",
    navVouchers: "Gift Cards & Vouchers",
    navPromo: "Promo & Flash Sale",
    navTrack: "Shipping Tracker",
    homeTitle: "Back to main menu",
    searchDesktop: "Search game discs, consoles, accessories (e.g. Spider-Man, Zelda)...",
    searchMobile: "Search games, discs, consoles...",
    searchQuick: "Quick Results",
    searchPopular: "Popular Games & Products",
    searchEnter: "Press Enter for all results",
    searchEmpty: "No products match",
    searchSeeAll: "See all results for",
    searchAll: "All Products",
    catGame: "Game Disc",
    catConsole: "Console",
    catAccessory: "Accessory",
    catVoucher: "Voucher",
    warrantyOptical: "Original Physical Disc • Optical Warranty",
    warrantyOfficial: "Official & Guaranteed",
    settings: "Settings",
    settingsTitle: "Settings",
    language: "Language",
    appearance: "Appearance",
    themeLight: "Light",
    themeDark: "Dark",
    langIndonesian: "Indonesia",
    langEnglish: "English",
    closeSettings: "Close settings",
    switchToDark: "Switch to dark mode",
    switchToLight: "Switch to light mode",
    footerAbout:
      "Specialist multi-platform game console Blu-ray Disc store (PlayStation, Xbox, Nintendo) with original products, region warranty, and full condition transparency.",
    footerCatalog: "Console Catalog",
    footerService: "Customer Service",
    footerHours: "Operating Hours & Support",
    footerHoursDesc:
      "Our team and parcel delivery are ready every day to make sure your order arrives on time.",
    footerHoursTime: "Mon - Sun: 09:00 - 21:00 (GMT+7)",
    footerHoursShip: "Instant & Regular Delivery Across Indonesia",
    footerCopy: "All Rights Reserved.",
    footerTagline: "Physical Games, Consoles & Digital Vouchers Indonesia",
    cartTitle: "Shopping Cart",
    cartItems: "items / products",
    cartEmpty: "Your cart is empty",
    cartEmptyDesc: "Pick your favorite game disc or dream console and add it to your cart.",
    cartBrowse: "Start Browsing",
    cartSubtotal: "Subtotal",
    cartShippingNote: "Shipping protected by Bubble Wrap & Disc Insurance",
    cartCheckout: "Proceed to Checkout",
    cartRemove: "Remove",
    remove: "Remove",
    cartDrawerTitle: "Shopping Cart",
    cartItemsSuffix: "items / products",
    cartEmptyHint: "Pick your favorite game discs or dream console and add them to your cart.",
    cartStartShopping: "Start Exploring Discs",
    cartShippingCalc: "Estimated Shipping",
    cartShippingAtCheckout: "Calculated at checkout",
    cartSafePackaging: "Protected with Bubble Wrap & Disc Insurance",
    footerCustomerService: "Customer Service",
    footerDays: "Mon - Sun: 09:00 - 21:00 WIB",
    footerShipping: "Instant & Regular Delivery across Indonesia",
    footerRights: "All Rights Reserved.",
    waSupport: "PlayHaven Support",
    waSubtitle: "Online • Game & Disc Helpdesk",
    waDesk: "PlayHaven Help Desk",
    waJustNow: "Just now",
    waReply: "Average reply under 5 minutes",
    waAsk: "Chat Now",
    heroCta: "Order Your Disc Now",
    heroSub: "In stock, ships today",
    // product cards & catalog
    startingFrom: "Starting from",
    addToCart: "Add to Cart",
    buyNow: "Buy",
    buyNowFull: "Buy Now",
    conditionNew: "New",
    conditionUsed: "Pre-owned",
    inStock: "Stock",
    outOfStock: "Sold Out",
    topCollection: "Top 10 Game BD Collection",
    viewAllGames: "View All",
    addedToCart: "added to your cart!",
    // product details
    synopsisTitle: "Game Synopsis & Details:",
    descTitle: "Product Description:",
    selectConsole: "Select Console Platform:",
    selectCondition: "Select Disc Condition:",
    specsTitle: "Key Specifications:",
    voucherPrice: "Voucher Price",
    catalogTitle: "Complete Physical Game Disc Catalog",
    displaying: "Displaying",
    catalogCount: "guaranteed original physical BD game titles.",
    catalogSearch: "Search game titles...",
    tabAllPlatforms: "All Platforms",
    tabPs3: "PlayStation 3 (Classic)",
    tabXbox: "Xbox Series X / One",
    noMatch: "No games match your selected filters.",
    resetFilters: "Reset All Filters",
    cartAdded: "added to cart!",
    buy: "Buy",
    new: "New",
    search: "Search",
    stock: "Stock",
  },
} as const;

export type TKey = keyof (typeof DICT)["id"];

export function useT() {
  const { lang } = useSettings();
  const dict = DICT[lang] as Record<TKey, string>;
  return (k: TKey) => dict[k] ?? k;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("id");
  const [theme, setThemeState] = useState<Theme>("light");

  // Read persisted prefs before first paint to avoid a flash of the wrong theme.
  useEffect(() => {
    const savedLang = localStorage.getItem(LANG_KEY) as Lang | null;
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    const nextLang: Lang = savedLang === "en" || savedLang === "id" ? savedLang : "id";
    const nextTheme: Theme =
      savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    setLangState(nextLang);
    setThemeState(nextTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.lang = lang;
  }, [theme, lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(LANG_KEY, l);
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem(THEME_KEY, t);
  };

  const value = useMemo(
    () => ({ lang, theme, setLang, setTheme, toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark") }),
    [lang, theme]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSettings must be used inside <SettingsProvider>");
  return c;
}