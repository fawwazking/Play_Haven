"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Gamepad2, 
  UserPlus, 
  Lock, 
  User, 
  Mail, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    password: "",
    confirm_password: ""
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (formData.password !== formData.confirm_password) {
      setErrorMsg("Password dan Konfirmasi Password tidak sama!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.username) {
          setErrorMsg(`Username: ${data.username[0]}`);
        } else if (data.email) {
          setErrorMsg(`Email: ${data.email[0]}`);
        } else if (data.password) {
          setErrorMsg(`Password: ${data.password[0]}`);
        } else {
          setErrorMsg("Pendaftaran gagal. Periksa data kembali.");
        }
        return;
      }

      setSuccessMsg("Pendaftaran akun berhasil! Mengalihkan ke login...");
      
      // Auto login atau redirect
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err) {
      setErrorMsg("Koneksi server gagal. Pastikan backend Django aktif.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          
          {/* Header Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-slate-900 text-sky-400 rounded-2xl shadow-lg shadow-sky-500/10 border border-slate-800">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <h2 className="font-gaming text-3xl font-bold tracking-wider text-slate-900">
              DAFTAR AKUN <span className="text-sky-500">GAMER</span>
            </h2>
            <p className="text-xs text-slate-500">
              Buat akun PlayHaven untuk simpan alamat pengiriman & pantau pesanan kaset fisik
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

            {successMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Contoh: Fawwaz Wijdan"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Contoh: gamer123"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Alamat Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      name="password"
                      minLength={6}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 6 digit"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Ulangi Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      name="confirm_password"
                      minLength={6}
                      value={formData.confirm_password}
                      onChange={handleChange}
                      placeholder="Konfirmasi"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-300 text-white font-gaming text-base font-bold tracking-wider rounded-xl transition-all shadow-md shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span>MEMPROSES PENDAFTARAN...</span>
                  ) : (
                    <>
                      <span>DAFTAR SEKARANG</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Sudah memiliki akun?{" "}
                <Link href="/login" className="font-bold text-sky-600 hover:text-sky-700 hover:underline">
                  Masuk di sini
                </Link>
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
