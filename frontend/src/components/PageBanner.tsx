"use client";

import React from "react";
import { useSettings } from "@/context/SettingsContext";

interface PageBannerProps {
  titleId: string;
  titleEn: string;
  descId: string;
  descEn: string;
  icon: React.ReactNode;
}

/** Solid slate banner — satu komponen dipakai 4 halaman info. */
export default function PageBanner({ titleId, titleEn, descId, descEn, icon }: PageBannerProps) {
  const { lang } = useSettings();
  const isEn = lang === "en";
  return (
    <div className="bg-slate-900 dark:bg-slate-950 text-white p-8 rounded-2xl border border-slate-800 flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-sky-500 flex items-center justify-center text-white shrink-0">
        {icon}
      </div>
      <div className="space-y-2 min-w-0">
        <h1 className="font-gaming text-3xl sm:text-4xl font-bold tracking-wide text-white">
          {isEn ? titleEn : titleId}
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
          {isEn ? descEn : descId}
        </p>
      </div>
    </div>
  );
}
