"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag, ShieldCheck, ArrowRight } from "lucide-react";
import { useSettings, useT } from "@/context/SettingsContext";

interface HeroSlide {
  id: string;
  title: string;
  subtitleId: string;
  subtitleEn: string;
  tagId: string;
  tagEn: string;
  badgeId: string;
  badgeEn: string;
  platform: string;
  image: string;
  coverThumb: string;
  price: string;
  originalPrice: string;
  discountPct: number;
  link: string;
}

const slides: HeroSlide[] = [
  {
    id: "spider-man-2",
    title: "Marvel's Spider-Man 2",
    subtitleId: "Dua Spider-Man bersatu menghadapi symbiote mematikan Venom dalam grafis 4K 60FPS ultra mulus.",
    subtitleEn: "Two Spider-Men unite against the lethal symbiote Venom in ultra-smooth 4K 60FPS visuals.",
    tagId: "PS5 Flagship BD",
    tagEn: "PS5 Flagship Disc",
    badgeId: "Paling Laris",
    badgeEn: "Official Best Seller",
    platform: "PlayStation 5",
    image: "/images/banners/banner-spiderman.jpg",
    coverThumb: "/images/games/marvels-spider-man-2-ps5.png",
    price: "Rp 879.000",
    originalPrice: "Rp 1.029.000",
    discountPct: 15,
    link: "/games/marvels-spider-man-2-ps5"
  },
  {
    id: "zelda-totk",
    title: "The Legend of Zelda: Tears of the Kingdom",
    subtitleId: "Jelajahi daratan dan langit tak terbatas kepulauan melayang Hyrule dengan kebebasan tanpa batas.",
    subtitleEn: "Explore the vast skies and endless lands of floating Hyrule with complete creative freedom.",
    tagId: "Switch Cartridge",
    tagEn: "Switch Cartridge",
    badgeId: "Game Terbaik",
    badgeEn: "Game of the Year",
    platform: "Nintendo Switch",
    image: "/images/banners/banner-zelda.jpg",
    coverThumb: "/images/games/the-legend-of-zelda-tears-of-the-kingdom-switch.jpg",
    price: "Rp 799.000",
    originalPrice: "Rp 949.000",
    discountPct: 16,
    link: "/games/the-legend-of-zelda-tears-of-the-kingdom-switch"
  },
  {
    id: "forza-5",
    title: "Forza Horizon 5",
    subtitleId: "Festival balapan mobil eksotis terbesar di dunia dalam bentang alam Meksiko yang spektakuler.",
    subtitleEn: "The premier open-world racing festival across breathtaking, vibrant Mexican landscapes.",
    tagId: "Xbox Series X BD",
    tagEn: "Xbox Series X Disc",
    badgeId: "Performa 12 Teraflops",
    badgeEn: "12 Teraflops Power",
    platform: "Xbox Series X",
    image: "/images/banners/banner-forza.jpg",
    coverThumb: "/images/games/forza-horizon-5-xbox-series-x.jpg",
    price: "Rp 799.000",
    originalPrice: "Rp 899.000",
    discountPct: 11,
    link: "/games/forza-horizon-5-xbox-series-x"
  },
  {
    id: "god-of-war-ragnarok",
    title: "God of War Ragnarok",
    subtitleId: "Perjalanan epik Kratos dan Atreus menembus sembilan alam mitologi Nordik menjelang perang akhir.",
    subtitleEn: "The epic Norse saga of Kratos and Atreus journeying through the Nine Realms as Ragnarok approaches.",
    tagId: "Eksklusif PlayStation",
    tagEn: "PlayStation Exclusive",
    badgeId: "Koleksi Wajib",
    badgeEn: "Masterpiece Action",
    platform: "PlayStation 5",
    image: "/images/banners/banner-gow.jpg",
    coverThumb: "/images/games/god-of-war-ragnarok-ps5.png",
    price: "Rp 849.000",
    originalPrice: "Rp 1.029.000",
    discountPct: 18,
    link: "/games/god-of-war-ragnarok-ps5"
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const { lang } = useSettings();
  const t = useT();
  const isEn = lang === "en";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Container banner bersih, tanpa efek glow/AI-slop */}
      <div className="relative h-[420px] sm:h-[480px] md:h-[520px] w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 group">
        
        {/* Layer Slides: transisi fade in dan fade out murni */}
        {slides.map((s, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={s.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 pointer-events-auto z-10" : "opacity-0 pointer-events-none z-0"
              }`}
            >
              {/* Gambar latar belakang statis */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${s.image})` }}
              />

              {/* Gradient overlay gelap natural gaya PlayStation Store */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/30 flex items-center">
                <div className="w-full px-6 sm:px-12 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
                  
                  {/* Kolom Kiri: Teks & CTA */}
                  <div className="max-w-xl text-white space-y-4 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 bg-sky-500 text-white text-[11px] font-bold rounded-md uppercase tracking-wider">
                        {isEn ? s.tagEn : s.tagId}
                      </span>
                      <span className="px-3 py-1 bg-white/10 text-slate-200 border border-white/15 text-xs font-semibold rounded-md">
                        {isEn ? s.badgeEn : s.badgeId}
                      </span>
                    </div>

                    <h1 className="font-gaming text-3xl sm:text-5xl md:text-6xl font-bold tracking-wide text-white leading-none">
                      {s.title}
                    </h1>

                    <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-lg">
                      {isEn ? s.subtitleEn : s.subtitleId}
                    </p>

                    {/* Harga & Tombol Pesan */}
                    <div className="pt-2 flex flex-wrap items-center gap-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 line-through">
                            {s.originalPrice}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500 text-white">
                            {isEn ? `SAVE ${s.discountPct}%` : `HEMAT ${s.discountPct}%`}
                          </span>
                        </div>
                        <span className="font-gaming text-3xl sm:text-4xl font-bold text-sky-400">
                          {s.price}
                        </span>
                      </div>

                      <Link
                        href={s.link}
                        className="flex items-center gap-2 px-6 py-3.5 bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>{t("heroCta")}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                    <div className="pt-2 flex items-center gap-4 text-[11px] text-slate-300 font-medium">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-sky-400" />
                        {isEn ? "100% Original Physical Disc Guarantee" : "Garansi Kaset 100% Original"}
                      </span>
                      <span>•</span>
                      <span>{t("heroSub")}</span>
                    </div>
                  </div>

                  {/* Kolom Kanan: Box Art Rapi & Minimalis */}
                  <div className="hidden lg:flex flex-col items-center justify-center">
                    <Link href={s.link} className="block cursor-pointer">
                      <div className="w-52 aspect-[3/4] rounded-xl overflow-hidden border border-white/20 bg-slate-900/80 p-2 shadow-xl relative">
                        <img
                          src={s.coverThumb}
                          alt={s.title}
                          className="w-full h-full object-contain rounded-lg"
                        />
                        <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 text-center py-1.5 rounded border border-white/10">
                          <span className="text-[11px] font-bold text-sky-300">
                            {s.platform} BD Edition
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          );
        })}

        {/* Navigasi Panah */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/70 hover:bg-sky-500 text-white border border-white/20 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 cursor-pointer z-20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/70 hover:bg-sky-500 text-white border border-white/20 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 cursor-pointer z-20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots Indikator Slide */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`transition-all rounded-full cursor-pointer ${
                current === idx 
                  ? "w-7 h-2 bg-sky-400" 
                  : "w-2 h-2 bg-white/40 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
