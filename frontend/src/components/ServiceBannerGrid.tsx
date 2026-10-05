import React from "react";
import Link from "next/link";
import { CreditCard, Truck, Wrench, MessageSquare, ShieldCheck, Zap } from "lucide-react";

export default function ServiceBannerGrid() {
  const banners = [
    {
      title: "Pembayaran Midtrans",
      subtitle: "BCA, BNI, Mandiri, QRIS & Kartu",
      tag: "Instant & Aman",
      icon: CreditCard,
      color: "from-blue-600 to-indigo-600",
      accent: "text-blue-600",
      bgLight: "bg-blue-50/80",
      link: "#"
    },
    {
      title: "Cek Ongkir Otomatis",
      subtitle: "Tarif JNE, TIKI & POS akurat gramatur",
      tag: "RajaOngkir Ready",
      icon: Truck,
      color: "from-sky-500 to-cyan-500",
      accent: "text-sky-600",
      bgLight: "bg-sky-50/80",
      link: "/cek-ongkir"
    },
    {
      title: "Jasa Servis Konsol",
      subtitle: "Ganti pasta, stik drift & cleaning",
      tag: "Teknisi Handal",
      icon: Wrench,
      color: "from-amber-500 to-orange-500",
      accent: "text-amber-600",
      bgLight: "bg-amber-50/80",
      link: "#"
    },
    {
      title: "Customer Support 24/7",
      subtitle: "Bantuan klaim DLC & konsultasi kaset",
      tag: "Respon Cepat",
      icon: MessageSquare,
      color: "from-emerald-500 to-teal-500",
      accent: "text-emerald-600",
      bgLight: "bg-emerald-50/80",
      link: "#"
    }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {banners.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.link}
              className="group p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 flex items-start gap-4"
            >
              <div className={`p-3 rounded-xl ${item.bgLight} ${item.accent} group-hover:scale-110 transition-transform shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.bgLight} ${item.accent}`}>
                    {item.tag}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 group-hover:text-sky-600 transition-colors truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                  {item.subtitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
