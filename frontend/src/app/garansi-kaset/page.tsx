"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShieldCheck, Disc, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function GaransiKasetPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        
        {/* Banner Title */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-8 rounded-3xl shadow-xl space-y-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Quality Control Kaset PlayHaven
          </span>
          <h1 className="font-gaming text-3xl sm:text-4xl font-bold tracking-wide">
            Standar Kaset Brand New (Baru) vs Bekas (Pre-owned)
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Di PlayHaven, kejujuran kondisi kaset adalah komitmen utama kami. Setiap kaset yang Anda beli memiliki standar pengecekan ketat dengan garansi tukar unit.
          </p>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Brand New Box */}
          <div className="bg-white p-6 rounded-3xl border-2 border-emerald-500/40 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                Kondisi Baru (Brand New Sealed)
              </span>
              <Disc className="w-5 h-5 text-emerald-600" />
            </div>

            <h3 className="font-bold text-lg text-slate-900">Segel Pabrik 100% Utuh</h3>
            
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Masih terbungkus segel plastik resmi (*Y-Fold factory seal* asli PlayStation / Nintendo).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Seluruh voucher DLC, bonus skin, dan booklet di dalam box kaset 100% belum pernah di-redeem.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Piringan disc Blu-ray / Cartridge Switch murni pabrik tanpa sentuhan jari.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Garansi Toko:</strong> 7 Hari ganti baru jika cacat produksi pabrik.</span>
              </li>
            </ul>
          </div>

          {/* Pre-owned Box */}
          <div className="bg-white p-6 rounded-3xl border-2 border-amber-500/40 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                Kondisi Bekas (Pre-owned Grade A)
              </span>
              <Disc className="w-5 h-5 text-amber-600" />
            </div>

            <h3 className="font-bold text-lg text-slate-900">Teruji Optik & Mulus</h3>
            
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Piringan disc optik Blu-ray diuji instalasi 100% tuntas di mesin konsol PlayHaven sebelum dikirim.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Kondisi fisik piringan minim goresan (Grade A 95%+ mulus, tanpa retak holder tengah).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Box casing asli original, bukan casing replika murahan.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Garansi Toko:</strong> 14 Hari jaminan tukar jika disc tidak terbaca konsol.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Quality Seal Assurance */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-1 text-xs text-slate-600">
            <h4 className="font-bold text-slate-900 text-sm">Segel Garansi Khusus PlayHaven Pre-Owned</h4>
            <p className="leading-relaxed">
              Kaset bekas yang telah lulus inspeksi kami segel kembali dengan plastik shrink wrap rapi berstiker hologram PlayHaven Quality Passed, sehingga tetap higienis dan terasa seperti kaset baru saat Anda membukanya.
            </p>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
