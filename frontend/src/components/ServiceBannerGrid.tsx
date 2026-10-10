"use client";

import React from "react";
import Link from "next/link";
import { CreditCard, Truck, ShieldCheck, MessageCircle } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function ServiceBannerGrid() {
  const { lang } = useSettings();
  const isEn = lang === "en";

  const items = [
    {
      icon: ShieldCheck,
      title: isEn ? "Guaranteed Original Discs" : "Kaset Fisik 100% Original",
      desc: isEn ? "Brand new sealed & tested pre-owned with warranty." : "Segel resmi & bekas teruji garansi tukar.",
      link: "/garansi-kaset"
    },
    {
      icon: Truck,
      title: isEn ? "Real-time Courier Rates" : "Cek Ongkir Otomatis",
      desc: isEn ? "Accurate JNE, TIKI & POS rates with bubble wrap." : "Hitung tarif JNE, TIKI & POS akurat gramatur.",
      link: "/cek-ongkir"
    },
    {
      icon: CreditCard,
      title: isEn ? "Midtrans Payment" : "Pembayaran Midtrans",
      desc: isEn ? "Instant QRIS, BCA, Mandiri & Virtual Account." : "QRIS, Virtual Account BCA, Mandiri instan.",
      link: "/metode-pembayaran"
    },
    {
      icon: MessageCircle,
      title: isEn ? "Official WhatsApp Support" : "Customer Support WA",
      desc: isEn ? "Direct assistance for stock & regional queries." : "Bantuan langsung stok, resi & panduan region.",
      link: "https://wa.me/6282269597454"
    }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((item, idx) => {
          const Icon = item.icon;
          const isExternal = item.link.startsWith("http");
          const CardContent = (
            <div className="h-full p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 dark:hover:border-sky-500/50 transition-colors flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">
                  {item.desc}
                </p>
              </div>
            </div>
          );

          return isExternal ? (
            <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer">
              {CardContent}
            </a>
          ) : (
            <Link key={idx} href={item.link}>
              {CardContent}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
