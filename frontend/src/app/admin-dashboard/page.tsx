"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiUrl } from "@/lib/api";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  Truck, 
  Search,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  LogIn
} from "lucide-react";

interface AdminStats {
  total_orders: number;
  paid_orders: number;
  pending_orders: number;
  total_revenue: number;
  total_variants: number;
  total_stock: number;
  low_stock_items: Array<{
    id: string;
    title: string;
    platform: string;
    condition: string;
    stock: number;
    price: number;
  }>;
}

interface OrderItem {
  title: string;
  quantity: number;
  price: number;
}

interface OrderData {
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_courier: string;
  shipping_city: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "inventory">("overview");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchOrder, setSearchOrder] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resStats, resOrders] = await Promise.all([
        fetch(apiUrl("/api/v1/admin-api/stats/")),
        fetch(apiUrl("/api/v1/admin-api/orders/"))
      ]);

      if (resStats.ok) {
        const dataStats = await resStats.json();
        setStats(dataStats);
      }
      if (resOrders.ok) {
        const dataOrders = await resOrders.json();
        setOrders(dataOrders);
      }
    } catch (err) {
      console.error("Gagal mengambil data admin API backend", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (orderNumber: string, newStatus: string) => {
    setUpdatingOrder(orderNumber);
    try {
      const res = await fetch(apiUrl("/api/v1/admin-api/orders/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_number: orderNumber, status: newStatus })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.order_number === orderNumber ? { ...o, status: newStatus } : o));
        setToast(`Status pesanan #${orderNumber} diubah ke ${newStatus}`);
        setTimeout(() => setToast(null), 3000);
      }
    } catch (e) {
      alert("Gagal update status pesanan");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    const matchSearch = o.order_number.toLowerCase().includes(searchOrder.toLowerCase()) ||
                        o.customer_name.toLowerCase().includes(searchOrder.toLowerCase()) ||
                        o.customer_phone.includes(searchOrder);
    return matchStatus && matchSearch;
  });

  // Akses ditolak jika bukan admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16 px-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="font-gaming text-2xl font-bold text-slate-900">
              AKSES TERBATAS
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Halaman <strong>Admin Dashboard</strong> hanya dapat diakses oleh akun Administrator PlayHaven. Silakan masuk dengan kredensial admin.
            </p>
            <div className="pt-3">
              <Link
                href="/login"
                className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-400 text-white font-gaming text-sm font-bold tracking-wider rounded-xl transition-all shadow-md shadow-sky-500/25 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>MASUK SEBAGAI ADMIN</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header />

      {/* Admin Subheader Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-gaming text-2xl font-bold tracking-wide">
                  PlayHaven Admin Center
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live DB Supabase
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kelola pesanan kaset fisik, stok varian, dan pantau status transaksi Midtrans
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchData}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Data</span>
            </button>
            <a
              href={apiUrl("/admin")}
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-sky-500/20 cursor-pointer"
            >
              <span>Django Native Admin</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 text-xs font-bold border-t border-slate-800">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === "overview" 
                ? "border-sky-400 text-sky-400" 
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Ringkasan & Finansial
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === "orders" 
                ? "border-sky-400 text-sky-400" 
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Daftar Pesanan ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === "inventory" 
                ? "border-sky-400 text-sky-400" 
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Peringatan Stok & Inventori
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-24 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Total Pendapatan
                  </span>
                  <h3 className="font-gaming text-2xl font-bold text-slate-900 mt-1">
                    Rp {(stats?.total_revenue || 0).toLocaleString("id-ID")}
                  </h3>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> Transaksi Berhasil (PAID)
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Total Pesanan Masuk
                  </span>
                  <h3 className="font-gaming text-2xl font-bold text-slate-900 mt-1">
                    {stats?.total_orders || orders.length} Pesanan
                  </h3>
                  <span className="text-[10px] text-slate-500 font-medium block mt-1">
                    {stats?.paid_orders || 0} Lunas • {stats?.pending_orders || 0} Menunggu
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Total Stok Kaset Fisik
                  </span>
                  <h3 className="font-gaming text-2xl font-bold text-slate-900 mt-1">
                    {stats?.total_stock || 2800} Unit
                  </h3>
                  <span className="text-[10px] text-slate-500 font-medium block mt-1">
                    Terbagi di {stats?.total_variants || 140} varian game
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Status Gateway
                  </span>
                  <h3 className="font-gaming text-xl font-bold text-slate-900 mt-1">
                    Midtrans Snap
                  </h3>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                    ● Sandbox Aktif & Siap QRIS
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* Quick Actions & Recent Orders Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900">
                    Pesanan Terbaru yang Perlu Diproses
                  </h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                  >
                    <span>Lihat Semua</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 overflow-x-auto">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.order_number} className="py-3 flex items-center justify-between text-xs gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-gaming font-bold text-sm text-slate-900">
                            #{o.order_number}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.status === "PAID" 
                              ? "bg-emerald-100 text-emerald-700" 
                              : o.status === "SHIPPED"
                              ? "bg-sky-100 text-sky-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {o.status}
                          </span>
                        </div>
                        <p className="text-slate-500 mt-0.5">
                          {o.customer_name} • {o.shipping_city} ({o.shipping_courier})
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-gaming text-sm font-bold text-slate-900 block">
                          Rp {o.total_amount.toLocaleString("id-ID")}
                        </span>
                        <span className="text-[10px] text-slate-400">{o.created_at}</span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-xs text-slate-400 py-6 text-center">
                      Belum ada transaksi pesanan yang masuk.
                    </p>
                  )}
                </div>
              </div>

              {/* Server & DB Information Card */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
                <h3 className="font-bold text-base text-slate-900">
                  Status Infrastruktur
                </h3>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="p-3 bg-slate-50 rounded-2xl space-y-1 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Database Server</span>
                    <p className="font-semibold text-slate-800">Supabase PostgreSQL 15</p>
                    <p className="text-[10px] text-slate-500">Host: aws-0-ap-southeast-1.pooler</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl space-y-1 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">API Ekspedisi</span>
                    <p className="font-semibold text-slate-800">RajaOngkir Starter API</p>
                    <p className="text-[10px] text-slate-500">Origin: Cilegon (Subdistrict ID: 575)</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl space-y-1 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Payment Engine</span>
                    <p className="font-semibold text-slate-800">Midtrans Snap Sandbox</p>
                    <p className="text-[10px] text-slate-500">Notification Webhook Listener Ready</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Cari no. order, nama pembeli, no. HP..."
                  value={searchOrder}
                  onChange={(e) => setSearchOrder(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {["ALL", "PENDING", "PAID", "SHIPPED", "CANCELLED"].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      statusFilter === st 
                        ? "bg-sky-500 text-white shadow-xs" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Order #</th>
                    <th className="p-3">Pelanggan</th>
                    <th className="p-3">Tujuan & Kurir</th>
                    <th className="p-3">Kaset yang Dibeli</th>
                    <th className="p-3">Total Bayar</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Ubah Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map(o => (
                    <tr key={o.order_number} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3">
                        <span className="font-gaming font-bold text-sm text-slate-900 block">
                          #{o.order_number}
                        </span>
                        <span className="text-[10px] text-slate-400">{o.created_at}</span>
                      </td>

                      <td className="p-3">
                        <p className="font-bold text-slate-800">{o.customer_name}</p>
                        <p className="text-[11px] text-slate-500">{o.customer_phone}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-xs">{o.customer_email}</p>
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-slate-700 block">{o.shipping_city}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold text-[10px]">
                          {o.shipping_courier}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="space-y-1">
                          {o.items.map((it, idx) => (
                            <div key={idx} className="text-[11px]">
                              <span className="font-bold text-slate-800">{it.quantity}x</span> {it.title}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="p-3 font-gaming font-bold text-sm text-slate-900">
                        Rp {o.total_amount.toLocaleString("id-ID")}
                      </td>

                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          o.status === "PAID" 
                            ? "bg-emerald-100 text-emerald-800" 
                            : o.status === "SHIPPED"
                            ? "bg-sky-100 text-sky-800"
                            : o.status === "CANCELLED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {o.status}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <select
                          disabled={updatingOrder === o.order_number}
                          value={o.status}
                          onChange={(e) => handleUpdateStatus(o.order_number, e.target.value)}
                          className="text-xs p-1.5 bg-slate-100 border border-slate-300 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PAID">PAID</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        Tidak ada pesanan yang sesuai filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === "inventory" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Monitoring Inventori & Ketersediaan Stok Kaset
                </h3>
                <p className="text-xs text-slate-500">
                  Setiap pembelian via Midtrans Snap memotong stok secara atomik. Pantau kaset yang stoknya menipis di bawah 5 unit.
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold">
                Low Stock Threshold: &le; 5 Unit
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {(stats?.low_stock_items || []).length > 0 ? (
                stats?.low_stock_items.map((item) => (
                  <div key={item.id} className="py-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-0.5 text-slate-500">
                          <span className="font-semibold text-sky-600">{item.platform}</span>
                          <span>•</span>
                          <span>{item.condition}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-bold text-rose-600 text-sm block">
                          Sisa {item.stock} Unit
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Rp {item.price.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Semua Stok Aman</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Seluruh 140 varian kaset game fisik saat ini memiliki stok aman (&ge; 20 unit per varian).
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
