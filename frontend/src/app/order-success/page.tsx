"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import OrderStruk, { readLastOrder } from "@/components/OrderStruk";
import { ShoppingBag, ArrowLeft } from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const isPending = searchParams.get("status") === "pending";
  const { clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [snapshot] = useState(() => readLastOrder());

  useEffect(() => {
    setMounted(true);
    clearCart();
  }, []);

  if (!mounted) return null;

  if (!orderNumber) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-gaming text-2xl font-bold text-slate-800">Nomor Pesanan Tidak Ditemukan</h1>
        <p className="text-sm text-slate-500">
          Halaman ini butuh parameter <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">?order=PH-XXXXXX</code>.
          Buka dari halaman checkout setelah pembayaran, atau cek riwayat pesanan di akunmu.
        </p>
        <Link href="/games" className="inline-block px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-xl transition-all">
          Belanja Kaset Game
        </Link>
      </div>
    );
  }

  // If the browser session has a matching stashed snapshot, render the full professional struk.
  // Otherwise fall back to a minimal confirmation card (legacy / direct-link access).
  const order = snapshot && snapshot.orderNumber === orderNumber ? snapshot : null;

  if (order) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <OrderStruk order={order} isPending={isPending} />
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 print:hidden">
          <Link href="/" className="w-full sm:flex-1 py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer text-center">
            <ShoppingBag className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <Link href="/games" className="w-full sm:flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-center">
            <ArrowLeft className="w-4 h-4" />
            <span>Belanja Kaset Lain</span>
          </Link>
        </div>
      </div>
    );
  }

  // Minimal fallback (no stashed snapshot — e.g. user opened the URL directly)
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <span className="font-gaming text-2xl font-black">{isPending ? "!" : "✓"}</span>
        </div>
        <h1 className="font-gaming text-2xl font-black text-slate-900">
          {isPending ? "Pesananmu Sudah Dibuat" : "Pembayaran Berhasil"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Nomor pesanan <span className="font-mono font-bold text-slate-700">{orderNumber}</span>.
          Rincian lengkap & resi tersedia di riwayat pesanan akunmu.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <Link href="/" className="w-full sm:flex-1 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-xl text-center">Kembali ke Beranda</Link>
          <Link href="/games" className="w-full sm:flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl text-center">Belanja Lagi</Link>
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
