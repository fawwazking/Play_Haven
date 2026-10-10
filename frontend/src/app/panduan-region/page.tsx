"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Globe2, HelpCircle, AlertCircle, CheckCircle2, Info } from "lucide-react";
import PageBanner from "@/components/PageBanner";

export default function PanduanRegionPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        
        <PageBanner
          icon={<Globe2 className="w-5 h-5" />}
          titleId="Panduan Lengkap Region Kaset & Kompatibilitas DLC"
          titleEn="Complete Disc Region & DLC Compatibility Guide"
          descId="Pelajari perbedaan Region 1 (US), Region 2 (EU/JPN), dan Region 3 (Asia/Indo). Semua konsol modern adalah Region Free untuk gameplay; region akun PSN menentukan klaim DLC."
          descEn="Understand Region 1 (US), Region 2 (EU/JPN), and Region 3 (Asia/Indo). All modern consoles are region-free for disc playback; PSN account region governs DLC redemptions."
        />

        {/* Region Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Reg 3 Asia */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-gaming text-xl font-bold">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900">Region 3 (Asia / Indo)</h3>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Paling Direkomendasikan
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mencakup Indonesia, Singapura, Malaysia, Thailand, Hong Kong, dan Taiwan. Teks game berbahasa Inggris / Subtitle Indo.
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
              <strong>Klaim DLC:</strong> Menggunakan Akun PSN / Nintendo ID region Indonesia atau Singapura.
            </div>
          </div>

          {/* Reg 1 USA */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-gaming text-xl font-bold">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900">Region 1 (USA / Amerika)</h3>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              ESRB Rating (E/T/M)
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kaset versi rilis Amerika Serikat dan Kanada. Bahasa default full English (Audio & Teks).
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
              <strong>Klaim DLC:</strong> Memerlukan Akun PSN / Nintendo eShop region United States (US).
            </div>
          </div>

          {/* Reg 2 Europe / Japan */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-gaming text-xl font-bold">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900">Region 2 (Eropa / UK / Jepang)</h3>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              PEGI / CERO Rating
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kaset versi rilis Inggris, Uni Eropa, dan Jepang. Cocok bagi kolektor edisi Steelbook dan Collector’s Edition Eropa.
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
              <strong>Klaim DLC:</strong> Memerlukan Akun region UK / Eropa atau Jepang.
            </div>
          </div>

        </div>

        {/* FAQ Table */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-sky-600" />
            <span>Pertanyaan yang Sering Diajukan (FAQ Region)</span>
          </h3>

          <div className="space-y-4 text-xs text-slate-600">
            <div className="p-4 bg-slate-50 rounded-2xl space-y-1 border border-slate-100">
              <p className="font-bold text-slate-800">Q: Apakah kaset Region 1 (US) bisa dimainkan di mesin PS5 Region 3 (Indonesia)?</p>
              <p>A: <strong>BISA 100%</strong>. Semua mesin konsol saat ini bersifat Region-Free. Kaset fisik dari belahan dunia mana pun dapat dimasukkan dan dimainkan langsung tanpa kendala.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1 border border-slate-100">
              <p className="font-bold text-slate-800">Q: Bagaimana cara menukarkan voucher bonus preorder kaset Reg 1 jika akun saya Reg 3 Indo?</p>
              <p>A: Cukup buat 1 akun PSN baru dengan region United States di konsol Anda (gratis), redeem kodenya di akun US tersebut, dan konten DLC dapat dinikmati bersama oleh semua akun di konsol yang sama.</p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
