"use client";

import React, { useState } from "react";
import { MessageCircle, X, Send, ShieldCheck, Gamepad2 } from "lucide-react";

export default function WhatsAppFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultText = message.trim() || "Halo Admin PlayHaven! Saya ingin tanya ketersediaan stok kaset game fisik dan aksesoris.";
    const encoded = encodeURIComponent(defaultText);
    window.open(`https://wa.me/6281234567890?text=${encoded}`, "_blank");
    setIsOpen(false);
    setMessage("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Popover Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">PlayHaven Support</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  <span>Online • CS Game & Kaset</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Chat Bubble */}
          <div className="p-4 bg-slate-50 space-y-3 text-xs text-slate-700">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-xs border border-slate-100 max-w-[85%] space-y-1">
              <p className="font-semibold text-emerald-700 text-[11px]">PlayHaven Help Desk</p>
              <p>Halo Gamers! Ada yang bisa kami bantu seputar kaset kaset PS5, PS4, Switch, atau cek resi kurir?</p>
              <span className="text-[9px] text-slate-400 block text-right">Baru saja</span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Respon rata-rata di bawah 5 menit</span>
            </div>
          </div>

          {/* Form Quick Send */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan ke WhatsApp..."
              className="flex-1 text-xs bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-md shadow-emerald-600/30 cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat WhatsApp"
        className="group relative flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl hover:shadow-emerald-600/40 transition-all hover:scale-105 active:scale-95 cursor-pointer border-2 border-white"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageCircle className="w-5 h-5 text-white" />
        <span className="text-xs font-bold tracking-wide pr-1">Tanya CS</span>
      </button>
    </div>
  );
}
