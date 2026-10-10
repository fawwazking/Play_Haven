"use client";

import React from "react";
import Link from "next/link";
import { useT } from "@/context/SettingsContext";
import { Gamepad2, Heart, Shield, Clock, MapPin } from "lucide-react";

export default function Footer() {
  const t = useT();
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-900">
                <Gamepad2 className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className="font-gaming text-2xl font-bold text-white tracking-tight">
                PlayHaven
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {t("footerAbout")}
            </p>
          </div>

          {/* Navigasi Katalog */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              {t("footerCatalog")}
            </h4>
            <ul className="space-y-2">
              <li><Link href="/games?platform=ps5" className="hover:text-white transition-colors">PlayStation 5 Games</Link></li>
              <li><Link href="/games?platform=ps4" className="hover:text-white transition-colors">PlayStation 4 Games</Link></li>
              <li><Link href="/games?platform=ps3" className="hover:text-white transition-colors">PlayStation 3 BD Klasik</Link></li>
              <li><Link href="/games?platform=xbox-series-x" className="hover:text-white transition-colors">Xbox Series X|S</Link></li>
              <li><Link href="/games?platform=switch" className="hover:text-white transition-colors">Nintendo Switch</Link></li>
            </ul>
          </div>

          {/* Layanan & Keamanan */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              {t("footerCustomerService")}
            </h4>
            <ul className="space-y-2">
              <li><Link href="/cek-ongkir" className="hover:text-white transition-colors">Tarif Ongkir RajaOngkir</Link></li>
              <li><Link href="/panduan-region" className="hover:text-white transition-colors">Panduan Region DLC (Reg 1, 2, 3)</Link></li>
              <li><Link href="/garansi-kaset" className="hover:text-white transition-colors">Standar Kaset Brand New vs Bekas</Link></li>
              <li><Link href="/metode-pembayaran" className="hover:text-white transition-colors">Midtrans Payment Guide</Link></li>
            </ul>
          </div>

          {/* Jam Operasional & Layanan */}
          <div className="space-y-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t("footerHours")}
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Layanan CS & Pengiriman Paket siap melayani setiap hari untuk memastikan pesanan Anda sampai tepat waktu.
            </p>
            <div className="pt-2 border-t border-slate-700 text-[11px] text-slate-400 space-y-1">
              <div>{t("footerDays")}</div>
              <div>{t("footerShipping")}</div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} PlayHaven Game Store. {t("footerRights")}
          </div>
          <div className="text-slate-500">
            {t("footerTagline")}
          </div>
        </div>

      </div>
    </footer>
  );
}
