"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  variantId: string;
  gameTitle: string;
  gameSlug?: string;
  slug?: string;
  coverImage: string;
  platform: string;
  region: string;
  condition: string;
  price: number;
  weightGrams: number;
  quantity: number;
  maxStock?: number;
  stock?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalWeight: number;
  subtotal: number;
  totalItems: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("playhaven_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Gagal load cart localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("playhaven_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === newItem.variantId);
      const stockLimit = newItem.maxStock ?? newItem.stock ?? 20;
      if (existing) {
        return prev.map((i) =>
          i.variantId === newItem.variantId
            ? { ...i, quantity: Math.min(i.quantity + 1, i.maxStock ?? i.stock ?? 20) }
            : i
        );
      }
      return [...prev, { ...newItem, maxStock: stockLimit, quantity: 1 }];
    });
    // Buka drawer secara otomatis agar pengguna langsung melihat isi keranjang
    setIsDrawerOpen(true);
  };

  const removeFromCart = (variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.variantId === variantId
          ? { ...i, quantity: Math.min(quantity, i.maxStock ?? i.stock ?? 20) }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const totalWeight = items.reduce((acc, i) => acc + i.weightGrams * i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalWeight,
        subtotal,
        totalItems,
        isDrawerOpen,
        setIsDrawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
