"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Truck, Calculator, MapPin, ShieldCheck, ArrowRight, Package } from "lucide-react";
import PageBanner from "@/components/PageBanner";

const SAMPLE_RATES = [
  { city: "Jakarta Barat / Pusat / Selatan", service: "JNE Regular (1-2 hari)", cost: 10000 },
  { city: "Bogor, Depok, Tangerang, Bekasi", service: "JNE Regular (1-2 hari)", cost: 11000 },
  { city: "Bandung & Jawa Barat", service: "JNE Regular (2-3 hari)", cost: 13000 },
  { city: "Semarang, Solo, Yogyakarta", service: "JNE Regular (2-3 hari)", cost: 18000 },
  { city: "Surabaya & Jawa Timur", service: "JNE Regular (2-3 hari)", cost: 20000 },
  { city: "Denpasar & Bali", service: "JNE Regular (2-4 hari)", cost: 24000 },
  { city: "Medan & Sumatera", service: "JNE Regular (3-5 hari)", cost: 32000 },
  { city: "Makassar & Sulawesi", service: "JNE Regular (3-5 hari)", cost: 38000 },
];

export default function CekOngkirPage() {
  const [weight, setWeight] = useState(1);
  const [searchCity, setSearchCity] = useState("");

  const filtered = SAMPLE_RATES.filter(r => 
    r.city.toLowerCase().includes(searchCity.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        <PageBanner
          icon={<Truck className="w-5 h-5" />}
          titleId="Tarif & Estimasi Ongkos Kirim"
          titleEn="Shipping Rates & Estimates"
          descId="PlayHaven terintegrasi dengan ekspedisi resmi (JNE, TIKI, POS Indonesia). Setiap kaset game fisik dihitung dengan bobot standar 150 gram + pengaman bubble wrap tebal."
          descEn="PlayHaven integrates with official couriers (JNE, TIKI, POS Indonesia). Each physical game disc is calculated at a standard 150 grams plus protective bubble wrap."
        />

        {/* Calculation Widget */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-sky-600" />
              <span>Simulasi Berat Paket</span>
            </h3>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 block">
                Jumlah Kaset Game (150g/kaset):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={weight}
                  onChange={(e) => setWeight(Math.max(1, Number(e.target.value)))}
                  className="w-24 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-center"
                />
                <span className="text-xs text-slate-500">
                  = {(weight * 0.15).toFixed(2)} Kg (Dibulatkan ke {Math.ceil(weight * 0.15)} Kg)
                </span>
              </div>
            </div>

            <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-[11px] text-sky-800 space-y-1">
              <p className="font-bold">Tips Hemat Ongkir:</p>
              <p>1 Kilogram paket ekspedisi muat hingga 6 kaset game Blu-ray. Belanja lebih dari 1 kaset tetap dihitung 1 Kg!</p>
            </div>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-600" />
                <span>Estimasi Tarif Reguler dari Jakarta</span>
              </h3>
              <input
                type="text"
                placeholder="Cari nama kota/daerah..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="divide-y divide-slate-100 overflow-hidden">
              {filtered.map((item, idx) => {
                const totalCost = item.cost * Math.ceil(weight * 0.15);
                return (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{item.city}</p>
                      <p className="text-[11px] text-slate-500">{item.service}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-gaming font-bold text-sm text-sky-600">
                        Rp {totalCost.toLocaleString("id-ID")}
                      </span>
                      <span className="block text-[10px] text-slate-400">per {Math.ceil(weight * 0.15)} Kg</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Protection Info */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900 leading-relaxed">
            <p className="font-bold text-emerald-950 mb-0.5">Standar Packaging PlayHaven</p>
            Semua kaset game fisik dibungkus dengan kardus double-wall tebal dan bubble wrap berlapis tanpa biaya tambahan tersembunyi. Kaset dijamin sampai tanpa retak casing atau disc lepas dari holder (*loose disc*).
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
