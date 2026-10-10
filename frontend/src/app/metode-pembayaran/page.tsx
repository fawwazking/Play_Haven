"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CreditCard, QrCode, Building2, ShieldCheck, Zap, Lock } from "lucide-react";
import PageBanner from "@/components/PageBanner";

export default function MetodePembayaranPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        
        <PageBanner
          icon={<CreditCard className="w-5 h-5" />}
          titleId="Panduan Pembayaran & Keamanan Transaksi"
          titleEn="Payment Guide & Transaction Security"
          descId="Transaksi di PlayHaven diproses secara realtime dan terenkripsi menggunakan Midtrans Snap. Konfirmasi pembayaran instan otomatis tanpa perlu kirim bukti transfer manual."
          descEn="Transactions on PlayHaven are processed in real-time and encrypted via Midtrans Snap. Instant confirmation without manual transfer receipts."
        />

        {/* Supported Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* QRIS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">QRIS (Semua E-Wallet)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bisa di-scan menggunakan GoPay, ShopeePay, OVO, Dana, LinkAja, serta mobile banking BCA, Mandiri, BRI, dan CIMB Niaga.
            </p>
            <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-emerald-600">
              ✓ Verifikasi Otomatis Detik Itu Juga
            </div>
          </div>

          {/* Virtual Account */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Bank Virtual Account</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tersedia nomor VA unik otomatis untuk Bank BCA, Mandiri, BNI, BRI, Permata, dan Bank Lainnya.
            </p>
            <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-emerald-600">
              ✓ Bebas Antre & Konfirmasi 24 Jam
            </div>
          </div>

          {/* Kartu Kredit / Debit Online */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Kartu Kredit & Debit</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Menerima kartu Visa, MasterCard, JCB, dan American Express dengan proteksi otentikasi 3D-Secure OTP SMS.
            </p>
            <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-emerald-600">
              ✓ Enkripsi SSL 256-bit Standar PCI-DSS
            </div>
          </div>

        </div>

        {/* Cara Bayar Step by Step */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="font-bold text-lg text-slate-900">Cara Melakukan Pembayaran di PlayHaven</h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center mx-auto text-xs">
                1
              </div>
              <h5 className="font-bold text-xs text-slate-800">Pilih Kaset / Item</h5>
              <p className="text-[11px] text-slate-500">Pilih game favorit dan klik tombol Checkout.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center mx-auto text-xs">
                2
              </div>
              <h5 className="font-bold text-xs text-slate-800">Isi Alamat & Ongkir</h5>
              <p className="text-[11px] text-slate-500">Pilih kota tujuan dan tarif kurir RajaOngkir.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center mx-auto text-xs">
                3
              </div>
              <h5 className="font-bold text-xs text-slate-800">Popup Midtrans Snap</h5>
              <p className="text-[11px] text-slate-500">Pilih QRIS atau VA lalu bayar melalui aplikasi bank Anda.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center mx-auto text-xs">
                4
              </div>
              <h5 className="font-bold text-xs text-slate-800">Faktur & Pengiriman</h5>
              <p className="text-[11px] text-slate-500">Faktur otomatis terbit dan kaset siap dikirim.</p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
