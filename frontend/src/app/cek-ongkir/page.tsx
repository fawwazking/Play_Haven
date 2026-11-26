"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Truck, Calculator, MapPin, ShieldCheck, ArrowRight, Package, Loader2, AlertCircle } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { useRegion } from "@/hooks/useRegion";
import { apiUrl } from "@/lib/api";

interface ShipOption { service: string; description: string; cost: number; etd: string; }

/**
 * Live shipping-rate simulator.
 * - Region data: useRegion (kuta.ku v4, with bundled RajaOngkir fallback).
 * - Cost data: POST /api/v1/shipping/cost/ (RajaOngkir Starter, server-side, key kept on backend).
 */
export default function CekOngkirPage() {
  const [weight, setWeight] = useState(1);
  const [provinceId, setProvinceId] = useState<number | "">("");
  const [cityId, setCityId] = useState<number | "">("");
  const [courier, setCourier] = useState("JNE");
  const [options, setOptions] = useState<ShipOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { provinces, citiesByProvince, useFallback, loading: regionLoading } = useRegion();

  const totalGrams = Math.max(100, Math.round(weight * 150));
  const roundedKg = Math.ceil(totalGrams / 1000);

  const fetchRate = async (p: number | "", c: number | "", cur: string, w: number) => {
    if (p === "" || c === "") return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(apiUrl("/api/v1/shipping/cost/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination: String(c), weight: w, courier: cur.toLowerCase() }),
      });
      const data = await res.json();
      setOptions(Array.isArray(data.services) ? data.services : []);
      if (!Array.isArray(data.services) || data.services.length === 0) {
        setError("Ongkir untuk wilayah ini tidak tersedia.");
      }
    } catch {
      setError("Gagal memuat ongkir. Coba lagi atau pilih kota lain.");
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const onProvinceChange = (v: string) => {
    const p = v === "" ? ("") : Number(v);
    setProvinceId(p);
    setCityId("");
    setOptions([]);
  };
  const onCityChange = (v: string) => {
    const c = v === "" ? ("") : Number(v);
    setCityId(c);
    if (c !== "") fetchRate(provinceId, c, courier, totalGrams);
  };
  const onCourierChange = (val: string) => {
    setCourier(val);
    if (cityId !== "") fetchRate(provinceId, cityId, val, totalGrams);
  };
  const onWeightChange = (val: number) => {
    const w = Math.max(1, val);
    setWeight(w);
    const g = Math.max(100, Math.round(w * 150));
    if (cityId !== "") fetchRate(provinceId, cityId, courier, g);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        <PageBanner
          icon={<Truck className="w-5 h-5" />}
          titleId="Tarif & Estimasi Ongkos Kirim"
          titleEn="Shipping Rates & Estimates"
          descId="PlayHaven terintegrasi dengan ekspedisi resmi (JNE, TIKI, POS Indonesia). Setiap kaset game fisik dihitung 150 gram + bubble wrap tebal. Pilih provinsi & kota untuk ongkir asli."
          descEn="PlayHaven integrates with official couriers. Choose province & city to see live shipping rates via RajaOngkir."
        />

        {/* Simulasi + Wilayah */}
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
                  onChange={(e) => onWeightChange(Number(e.target.value) || 1)}
                  className="w-24 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-center"
                />
                <span className="text-xs text-slate-500">
                  = {(totalGrams / 1000).toFixed(2)} Kg ({roundedKg} Kg dibulatkan)
                </span>
              </div>
            </div>
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-[11px] text-sky-800 space-y-1">
              <p className="font-bold">Tips Hemat Ongkir:</p>
              <p>1 Kg paket ekspedisi muat hingga 6 kaset Blu-ray. Belanja lebih dari 1 kaset tetap dihitung 1 Kg.</p>
            </div>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-600" />
                <span>Wilayah & Kurir</span>
              </h3>
              {useFallback && !regionLoading && (
                <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5">
                  Data wilayah offline
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select value={provinceId === "" ? "" : String(provinceId)} onChange={(e) => onProvinceChange(e.target.value)} className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 outline-hidden">
                <option value="">Provinsi…</option>
                {provinces.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select value={cityId === "" ? "" : String(cityId)} onChange={(e) => onCityChange(e.target.value)} disabled={provinceId === ""} className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 outline-hidden disabled:opacity-50">
                <option value="">Kota / Kab…</option>
                {provinceId !== ""
                  ? (citiesByProvince[provinceId] || []).map((c) => <option key={c.cityId} value={c.cityId}>{c.name}</option>)
                  : []}
              </select>
              <select value={courier} onChange={(e) => onCourierChange(e.target.value)} className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 outline-hidden">
                <option value="JNE">JNE</option>
                <option value="TIKI">TIKI</option>
                <option value="POS">POS Indonesia</option>
              </select>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-sky-500" /> Menghitung ongkir…
              </div>
            )}
            {error && !loading && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            {cityId !== "" && options.length > 0 && !loading && (
              <div className="divide-y divide-slate-100 overflow-hidden">
                {options.map((o) => (
                  <div key={o.service} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{o.service}</p>
                      <p className="text-[11px] text-slate-500">{o.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-gaming font-bold text-sm text-sky-600">
                        Rp {o.cost.toLocaleString("id-ID")}
                      </span>
                      <span className="block text-[10px] text-slate-400">ETD {o.etd} hari</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Protection Info */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900 leading-relaxed">
            <p className="font-bold text-emerald-950 mb-0.5">Standar Packaging PlayHaven</p>
            Semua kaset game fisik dibungkus dengan kardus double-wall tebal dan bubble wrap berlapis tanpa biaya tambahan tersembunyi. Kaset dijamin sampai tanpa retak casing atau disc lepas dari holder (<i>loose disc</i>).
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
