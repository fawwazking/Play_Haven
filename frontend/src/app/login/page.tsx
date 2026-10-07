"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Gamepad2, 
  LogIn, 
  Lock, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle,
  Sparkles
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch(apiUrl("/api/v1/auth/login/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username_or_email: identifier,
          password: password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.non_field_errors) {
          setErrorMsg(data.non_field_errors[0]);
        } else if (typeof data === "string") {
          setErrorMsg(data);
        } else {
          setErrorMsg("Login gagal. Periksa kembali username/email dan password Anda.");
        }
        return;
      }

      // Login sukses
      login(data.user);

      // Arahkan berdasarkan role
      if (data.user.role === "admin" || data.user.is_staff || data.user.is_superuser) {
        router.push("/admin-dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      setErrorMsg("Koneksi server gagal. Pastikan backend Django sedang berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          
          {/* Brand & Title Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-slate-900 text-sky-400 rounded-2xl shadow-lg shadow-sky-500/10 border border-slate-800">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <h2 className="font-gaming text-3xl font-bold tracking-wider text-slate-900">
              MASUK KE <span className="text-sky-500">PLAYHAVEN</span>
            </h2>
            <p className="text-xs text-slate-500">
              Satu portal untuk Akun Gamer & Administrator PlayHaven
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 space-y-6">
            
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Username atau Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Username atau nama@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-300 text-white font-gaming text-base font-bold tracking-wider rounded-xl transition-all shadow-md shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span>MEMPROSES...</span>
                  ) : (
                    <>
                      <span>MASUK SEKARANG</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center space-y-3">
              <p className="text-xs text-slate-500">
                Belum punya akun gamer?{" "}
                <Link href="/register" className="font-bold text-sky-600 hover:text-sky-700 hover:underline">
                  Daftar Akun Baru
                </Link>
              </p>

              {/* Admin Info Badge */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-left">
                <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" />
                <p className="text-[11px] text-slate-500">
                  <strong className="text-slate-700">Akun Admin:</strong> Silakan login menggunakan akun admin yang telah terdaftar untuk langsung masuk ke Admin Dashboard.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
