"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useT } from "@/context/SettingsContext";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const router = useRouter();
  const t = useT();

  if (!isDrawerOpen) return null;

  const handleCheckout = () => {
    closeDrawer();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop Backdrop Overlay */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header Drawer */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-gaming text-lg font-bold text-slate-900 tracking-wide">
                  {t("cartDrawerTitle")}
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {totalItems} {t("cartItemsSuffix")}
                </span>
              </div>
            </div>

            <button
              onClick={closeDrawer}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Item Cart */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-bold text-slate-700">{t("cartEmpty")}</p>
                <p className="text-xs text-slate-500 max-w-xs">
                  {t("cartEmptyHint")}
                </p>
                <button
                  onClick={closeDrawer}
                  className="mt-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  {t("cartStartShopping")}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-3 p-3 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-slate-300 transition-all"
                >
                  {/* Thumb Box Art */}
                  <div className="w-16 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-slate-100">
                    <img
                      src={item.coverImage}
                      alt={item.gameTitle}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>

                  {/* Detail Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                        {item.gameTitle}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-700">
                          {item.platform}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {item.condition}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <span className="font-gaming text-sm font-bold text-slate-900">
                        Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1 border border-slate-200/60">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1 hover:bg-white text-slate-600 rounded transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-5 text-center text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="p-1 hover:bg-white text-slate-600 rounded transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title={t("remove")}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Drawer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{t("cartSubtotal")}</span>
                <span className="font-gaming text-xl font-bold text-slate-900">
                  Rp {subtotal.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t("cartSafePackaging")}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>{t("cartCheckout")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
