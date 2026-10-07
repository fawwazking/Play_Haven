"use client";

import React, { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { apiUrl } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import { useRouter } from "next/navigation";
import { 
  Trash2, 
  Plus, 
  Minus, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle,
  AlertCircle
} from "lucide-react";

declare global {
  interface Window {
    snap: any;
  }
}

export default function CheckoutPage() {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, totalWeight } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Form State
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [courierName, setCourierName] = useState("JNE");
  const [courierService, setCourierService] = useState("REG");
  const [shippingCost, setShippingCost] = useState(18000);

  // Flow State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Auto-fill user info when authenticated
  React.useEffect(() => {
    if (user) {
      setRecipientName(user.first_name ? `${user.first_name} ${user.last_name}` : user.username);
    }
  }, [user]);

  const totalAmount = subtotal + shippingCost;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    if (items.length === 0) {
      setErrorMsg("Keranjang belanja Anda masih kosong.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        shipping_address: shippingAddress,
        subdistrict_id: "575",
        courier_name: courierName,
        courier_service: courierService,
        shipping_cost: shippingCost,
        items: items.map((i) => ({
          variant_id: i.variantId,
          quantity: i.quantity,
        })),
      };

      const res = await fetch(apiUrl("/api/v1/orders/create/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat pesanan.");
      }

      // Jika Midtrans Snap Token berhasil didapat
      if (data.snap_token && window.snap) {
        window.snap.pay(data.snap_token, {
          onSuccess: function (result: any) {
            clearCart();
            window.location.href = `/order-success?order=${data.order_number}`;
          },
          onPending: function (result: any) {
            clearCart();
            window.location.href = `/order-success?order=${data.order_number}`;
          },
          onError: function (result: any) {
            setErrorMsg("Pembayaran gagal atau dibatalkan.");
          },
          onClose: function () {
            // Pengguna menutup popup Midtrans
            clearCart();
            window.location.href = `/order-success?order=${data.order_number}`;
          },
        });
      } else {
        clearCart();
        window.location.href = `/order-success?order=${data.order_number}`;
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan koneksi ke server backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Script SDK Midtrans Snap Sandbox */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key="Mid-client-o-NdE_sHnNHHZEq7"
        strategy="lazyOnload"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <h1 className="font-gaming text-3xl font-bold tracking-wide text-slate-900 mb-6">
          Troli Belanja & Checkout Pembayaran
        </h1>

        {/* Jika Order Sukses Dibuat */}
        {orderSuccess ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md text-center max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="font-gaming text-2xl font-bold text-slate-900">
              Pesanan Berhasil Dibuat!
            </h2>
            <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-1.5 text-left border border-slate-100">
              <p><strong>Nomor Order:</strong> {orderSuccess.order_number}</p>
              <p><strong>Total Pembayaran:</strong> Rp {Number(orderSuccess.total_amount).toLocaleString("id-ID")}</p>
              <p><strong>Status:</strong> Menunggu Verifikasi Webhook / Sukses</p>
            </div>
            <p className="text-xs text-slate-500">
              Data transaksi telah tersimpan di Supabase dan dapat Anda pantau langsung di Django Admin.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs rounded-xl transition-all shadow-xs"
            >
              Kembali ke Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Bagian Kiri: List Item Keranjang */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h2 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                  <span>Daftar Kaset Game ({items.length} item)</span>
                  <span className="text-xs text-slate-500 font-normal">
                    Estimasi Berat: {totalWeight + 100}g (Inc. Packing)
                  </span>
                </h2>

                {items.length === 0 ? (
                  <div className="text-center py-10 space-y-3">
                    <p className="text-sm text-slate-400">Keranjang Anda masih kosong.</p>
                    <Link
                      href="/"
                      className="inline-block text-xs font-bold text-sky-600 hover:underline"
                    >
                      Pilih Game dari Katalog &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 space-y-4">
                    {items.map((item) => (
                      <div key={item.variantId} className="pt-4 first:pt-0 flex items-center gap-4">
                        <div 
                          className="w-16 h-20 bg-cover bg-center rounded-lg border border-slate-200 shrink-0"
                          style={{ backgroundImage: `url(${item.coverImage})` }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-xs text-slate-900 truncate">
                            {item.gameTitle}
                          </h3>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 font-semibold rounded text-slate-700">
                              {item.platform}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 font-semibold rounded text-slate-700">
                              {item.region}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded">
                              {item.condition}
                            </span>
                          </div>
                          <p className="font-gaming font-bold text-sky-600 text-sm mt-1">
                            Rp {item.price.toLocaleString("id-ID")}
                          </p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-slate-200 rounded-lg">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              className="p-1 hover:bg-slate-100 text-slate-600 rounded-l-lg"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 text-xs font-bold">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              className="p-1 hover:bg-slate-100 text-slate-600 rounded-r-lg"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.variantId)}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bagian Kanan: Form Pengiriman & Bayar */}
            <div className="lg:col-span-5 space-y-4">
              <form onSubmit={handleCheckout} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-3">
                  Informasi Pengiriman & Pembayaran
                </h2>

                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Penerima
                    </label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor Handphone / WhatsApp
                    </label>
                    <input
                      type="text"
                      required
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Alamat Lengkap Pengiriman
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 outline-hidden"
                    />
                  </div>

                  {/* Pilihan Ekspedisi */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kurir Ekspedisi (RajaOngkir)
                    </label>
                    <select
                      value={`${courierName}-${courierService}`}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "JNE-REG") {
                          setCourierName("JNE"); setCourierService("REG"); setShippingCost(18000);
                        } else if (val === "JNE-YES") {
                          setCourierName("JNE"); setCourierService("YES"); setShippingCost(32000);
                        } else if (val === "TIKI-ONS") {
                          setCourierName("TIKI"); setCourierService("ONS"); setShippingCost(30000);
                        }
                      }}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 outline-hidden"
                    >
                      <option value="JNE-REG">JNE Regular (2-3 Hari) — Rp 18.000</option>
                      <option value="JNE-YES">JNE YES Yakin Esok Sampai (1 Hari) — Rp 32.000</option>
                      <option value="TIKI-ONS">TIKI Over Night Service — Rp 30.000</option>
                    </select>
                  </div>
                </div>

                {/* Ringkasan Biaya */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal Produk</span>
                    <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Ongkir Ekspedisi ({courierName})</span>
                    <span>Rp {shippingCost.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-100">
                    <span>Total Pembayaran</span>
                    <span className="font-gaming text-sky-600 text-lg">
                      Rp {totalAmount.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || items.length === 0}
                  className="w-full py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{loading ? "Memproses Order..." : "Bayar via Midtrans Snap"}</span>
                </button>
              </form>
            </div>

          </div>
        )}
      </div>

      <Footer />

      {/* Auth Warning Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        actionText="melakukan proses checkout & pembayaran pesanan"
      />
    </main>
  );
}
