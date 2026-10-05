"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  badge: string;
  platform: string;
  image: string;
  coverThumb: string;
  price: string;
  originalPrice: string;
  link: string;
}

const slides: HeroSlide[] = [
  {
    id: "spider-man-2",
    title: "Marvel's Spider-Man 2",
    subtitle: "Dua Spider-Man bersatu menghadapi symbiote mematikan Venom dalam grafis 4K 60FPS ultra mulus.",
    tag: "PS5 Flagship BD",
    badge: "Official Best Seller",
    platform: "PlayStation 5",
    image: "/images/banners/banner-spiderman.jpg",
    coverThumb: "/images/games/marvels-spider-man-2-ps5.png",
    price: "Rp 879.000",
    originalPrice: "Rp 1.029.000",
    link: "/games/marvels-spider-man-2-ps5"
  },
  {
    id: "zelda-totk",
    title: "The Legend of Zelda: Tears of the Kingdom",
    subtitle: "Jelajahi daratan dan langit tak terbatas kepulauan melayang Hyrule dengan kebebasan tanpa batas.",
    tag: "Switch Cartridge",
    badge: "Game of the Year",
    platform: "Nintendo Switch",
    image: "/images/banners/banner-zelda.jpg",
    coverThumb: "/images/games/the-legend-of-zelda-tears-of-the-kingdom-switch.jpg",
    price: "Rp 799.000",
    originalPrice: "Rp 949.000",
    link: "/games/the-legend-of-zelda-tears-of-the-kingdom-switch"
  },
  {
    id: "forza-5",
    title: "Forza Horizon 5",
    subtitle: "Festival balapan mobil eksotis terbesar di dunia dalam bentang alam Meksiko yang spektakuler.",
    tag: "Xbox Series X BD",
    badge: "12 Teraflops Power",
    platform: "Xbox Series X",
    image: "/images/banners/banner-forza.jpg",
    coverThumb: "/images/games/forza-horizon-5-xbox-series-x.jpg",
    price: "Rp 799.000",
    originalPrice: "Rp 899.000",
    link: "/games/forza-horizon-5-xbox-series-x"
  },
  {
    id: "god-of-war-ragnarok",
    title: "God of War Ragnarok",
    subtitle: "Perjalanan epik Kratos dan Atreus menembus sembilan alam mitologi Nordik menjelang perang akhir.",
    tag: "PlayStation Exclusive",
    badge: "Masterpiece Action",
    platform: "PlayStation 5",
    image: "/images/banners/banner-gow.jpg",
    coverThumb: "/images/games/god-of-war-ragnarok-ps5.png",
    price: "Rp 849.000",
    originalPrice: "Rp 1.029.000",
    link: "/games/god-of-war-ragnarok-ps5"
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

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

  const active = slides[current];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div className="relative h-[420px] sm:h-[480px] md:h-[520px] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 group">
        
        {/* Background Image Slide */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out scale-105"
          style={{ backgroundImage: `url(${active.image})` }}
        >
          {/* Deep Cinematic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent/30 flex items-center">
            
            {/* Content Text & Hero Visual */}
            <div className="w-full px-6 sm:px-12 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8 z-10">
              
              {/* Left Column: Text & CTA */}
              <div className="max-w-xl text-white space-y-4 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3.5 py-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[11px] font-extrabold rounded-full uppercase tracking-wider shadow-md shadow-sky-500/30">
                    {active.tag}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md text-amber-300 border border-white/15 text-xs font-bold rounded-full">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {active.badge}
                  </span>
                </div>

                <h1 className="font-gaming text-3xl sm:text-5xl md:text-6xl font-black tracking-wide text-white leading-none drop-shadow-xl">
                  {active.title}
                </h1>

                <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-lg">
                  {active.subtitle}
                </p>

                {/* Price Tag & Guarantees */}
                <div className="pt-2 flex flex-wrap items-center gap-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 line-through">
                        {active.originalPrice}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500 text-white">
                        HEMAT 18%
                      </span>
                    </div>
                    <span className="font-gaming text-3xl sm:text-4xl font-black text-sky-400">
                      {active.price}
                    </span>
                  </div>

                  <Link
                    href={active.link}
                    className="flex items-center gap-2 px-7 py-4 bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm rounded-2xl transition-all shadow-xl shadow-sky-500/40 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Pesan Kaset Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="pt-2 flex items-center gap-4 text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-sky-400" /> Garansi Kaset 100% Original
                  </span>
                  <span>•</span>
                  <span>Ready Stock Siap Kirim Hari Ini</span>
                </div>
              </div>

              {/* Right Column: Floating 3D Box Art Preview */}
              <div className="hidden lg:flex flex-col items-center justify-center relative">
                <div className="w-56 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900/60 backdrop-blur-md p-2 transform rotate-3 hover:rotate-0 transition-transform duration-500 shadow-sky-500/20">
                  <img
                    src={active.coverThumb}
                    alt={active.title}
                    className="w-full h-full object-contain rounded-xl"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md text-center py-1.5 rounded-lg border border-white/10">
                    <span className="text-[11px] font-bold text-sky-300">
                      Physical Disc Edition
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950/60 hover:bg-sky-500 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer z-20 shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950/60 hover:bg-sky-500 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer z-20 shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicators Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`transition-all rounded-full cursor-pointer ${
                current === idx 
                  ? "w-8 h-2.5 bg-sky-400 shadow-md shadow-sky-400/50" 
                  : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
