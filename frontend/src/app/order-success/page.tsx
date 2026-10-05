"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { CheckCircle2, ShoppingBag, ArrowLeft, PackageCheck, Truck, ShieldCheck, Printer } from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || `PH-${Math.floor(100000 + Math.random() * 900000)}`;
  const { clearCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Bersihkan keranjang karena pesanan sudah berhasil dibayar
    clearCart();
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
      {/* Success Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Banner Top */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <span className="px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-extrabold uppercase tracking-widest text-emerald-100">
            Pembayaran Berhasil Diverifikasi
          </span>
          <h1 className="font-gaming text-3xl sm:text-4xl font-black mt-3">
            Terima Kasih Atas Pesananmu!
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            Kaset game fisik pesananmu sedang kami siapkan, dikemas aman dengan bubble wrap ganda, dan segera diserahkan ke kurir.
          </p>
        </div>

        {/* Invoice Summary */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 font-medium">Nomor Faktur / Pesanan</span>
              <p className="font-gaming text-xl font-black text-slate-800 tracking-wider">
                #{orderNumber}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                LUNAS (Midtrans Snap)
              </span>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak</span>
              </button>
            </div>
          </div>

          {/* Stepper Status */}
          <div className="py-4 border-y border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Status Pengiriman
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold mb-1.5 shadow-md shadow-emerald-500/30">
                  ✓
                </div>
                <span className="text-xs font-bold text-slate-800">Pembayaran</span>
                <span className="text-[10px] text-slate-400">Terverifikasi</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-bold mb-1.5 shadow-md shadow-sky-500/30 animate-pulse">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">Quality Check</span>
                <span className="text-[10px] text-slate-400">Optik & Kemasan</span>
              </div>
              <div className="flex flex-col items-center opacity-40">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold mb-1.5">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">Diserahkan Kurir</span>
                <span className="text-[10px] text-slate-400">Ekspedisi JNE/TIKI</span>
              </div>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <p className="font-bold text-slate-800 mb-0.5">Garansi Toko PlayHaven</p>
              Setiap kaset game fisik melewati pengujian pembacaan optik kaset di konsol sebelum dikirim. Garansi penukaran 7 hari berlaku jika kaset mengalami kendala saat dimainkan.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/"
              className="w-full sm:flex-1 py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-500/30 cursor-pointer text-center"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>
            <Link
              href="/games"
              className="w-full sm:flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Belanja Kaset Lain</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Memuat status pesanan...</div>}>
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
}
