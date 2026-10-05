"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "customer";
  is_staff: boolean;
  is_superuser: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (userData: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Load persisted auth from localStorage
    try {
      const saved = localStorage.getItem("playhaven_auth_user");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Gagal load session user", e);
    }
  }, []);

  const login = (userData: AuthUser) => {
    setUser(userData);
    try {
      localStorage.setItem("playhaven_auth_user", JSON.stringify(userData));
    } catch (e) {
      console.error("Gagal save session user", e);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("playhaven_auth_user");
    } catch (e) {
      console.error("Gagal clear session user", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin" || !!user?.is_staff || !!user?.is_superuser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
