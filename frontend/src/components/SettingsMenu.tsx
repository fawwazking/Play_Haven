"use client";

import React from "react";
import { Sun, Moon, Settings, Globe, Check, User, LogOut, ShieldCheck, ChevronDown } from "lucide-react";
import { useSettings, useT } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface Props {
  open: boolean;
  onClose: () => void;
  align?: "left" | "right";
}

// Controlled dropdown panel rendered by the Header profile trigger.
export default function SettingsMenu({ open, onClose, align = "right" }: Props) {
  const { lang, theme, setLang, setTheme } = useSettings();
  const t = useT();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  if (!open) return null;

  return (
    <>
      {/* Click-away backdrop (fixed, transparent) */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className={`absolute top-full mt-2 ${align === "right" ? "right-0" : "left-0"} w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200`}
      >
          {/* Profile row */}
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center border ${
                isAdmin
                  ? "bg-sky-50 text-sky-600 border-sky-300"
                  : "bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {isAuthenticated ? (isAdmin ? t("admin") : t("gamer")) : t("gamer")}
              </div>
            <div className="text-xs font-bold text-slate-800 truncate">
              {user?.first_name || user?.username || "Tamu"}
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-300 rotate-180" />
        </div>

          {/* Appearance */}
          <div className="p-4 border-b border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5" /> {t("appearance")}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["light", "dark"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setTheme(opt)}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                    theme === opt
                      ? "border-sky-300 bg-sky-50 text-sky-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt === "dark" ? <Moon className="w-5 h-5 text-sky-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
                  {opt === "dark" ? t("themeDark") : t("themeLight")}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="p-4 border-b border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> {t("language")}
            </div>
            <div className="space-y-1.5">
              {(["id", "en"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-bold transition-colors ${
                    lang === l
                      ? "bg-sky-50 border-sky-300 text-sky-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{l === "id" ? t("langIndonesian") : t("langEnglish")}</span>
                  {lang === l && <Check className="w-4 h-4 text-sky-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Profile actions */}
          <div className="p-3">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> {t("logout")}
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center justify-center px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="flex items-center justify-center px-3 py-2 rounded-xl text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 transition-colors"
                >
                  {t("register")}
                </Link>
              </div>
            )}
          </div>
      </div>
    </>
  );
}
