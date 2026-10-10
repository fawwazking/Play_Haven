"use client";

import React from "react";
import Link from "next/link";
import { LogIn, UserPlus, X, AlertCircle, ShieldAlert } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionText?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  actionText = "melanjutkan pembelian",
}: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-center space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Tutup Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Title & Warning Message */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" />
            Wajib Masuk / Daftar Akun
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-gaming">
            Akun Diperlukan
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            Untuk <span className="font-bold text-slate-800">{actionText}</span>, Anda harus masuk ke akun gamer PlayHaven Anda terlebih dahulu agar pesanan & riwayat transaksi tersimpan aman.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm transition-colors"
            onClick={onClose}
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk ke Akun Saya</span>
          </Link>

          <Link
            href="/register"
            className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            onClick={onClose}
          >
            <UserPlus className="w-4 h-4" />
            <span>Belum Punya Akun? Daftar Baru</span>
          </Link>
        </div>

        {/* Subtle Footnote */}
        <p className="text-[11px] text-slate-400">
          Proses pendaftaran hanya memakan waktu 30 detik & gratis selamanya.
        </p>
      </div>
    </div>
  );
}
