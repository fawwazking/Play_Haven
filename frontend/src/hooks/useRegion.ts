"use client";

/**
 * Region picker for shipping. Primary source: kuta.ku v4 API (provinces → cities).
 * Fallback: bundled RajaOngkir-Id-mapped data in src/data/regions.ts, used when the
 * API is unreachable (CORS, offline, or this sandbox's restricted DNS).
 *
 * City ids returned here are compatible with the backend RajaOngkir starter cost
 * endpoint (destination=city_id), which then maps to subdistrict ids server-side.
 */
import { useEffect, useMemo, useState } from "react";
import { FALLBACK_REGIONS, type RegionProvince } from "@/data/regions";

interface CityOption { cityId: number; name: string; zip: string; }
interface ProvinceOption { id: number; name: string; cities: CityOption[]; }

const KUTA_BASE = "https://kuta.ku/v4";

async function fetchJSON(url: string): Promise<any> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function loadFromKuta(): Promise<{ provinces: ProvinceOption[]; cities: CityOption[]; fromFallback: boolean }> {
  const prov = await fetchJSON(`${KUTA_BASE}/provinces`);
  const cities = await fetchJSON(`${KUTA_BASE}/cities`);
  const provinces: ProvinceOption[] = prov.map((p: any) => ({
    id: p.id,
    name: p.name,
    cities: cities
      .filter((c: any) => c.province_id === p.id)
      .map((c: any) => ({ cityId: c.id, name: c.name, zip: c.postal_code ?? "" })),
  })).filter((p: ProvinceOption) => p.cities.length > 0);
  if (provinces.length === 0) throw new Error("kuta.ku returned empty");
  return { provinces, cities: cities.map((c: any) => ({ cityId: c.id, name: c.name, zip: c.postal_code ?? "" })), fromFallback: false };
}

export function useRegion() {
  const [provinces, setProvinces] = useState<ProvinceOption[]>(FALLBACK_REGIONS);
  const [provincesLoading, setProvincesLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await loadFromKuta();
        if (cancelled) return;
        setProvinces(data.provinces);
        setUseFallback(false);
      } catch {
        if (!cancelled) setUseFallback(true); // bundled data already in place
      } finally {
        if (!cancelled) setProvincesLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const citiesByProvince = useMemo(
    () => Object.fromEntries(provinces.map((p) => [p.id, p.cities])),
    [provinces],
  );

  const selectCity = async (cityId: number): Promise<{ districtId: number; districtName: string; subdistrictId?: number }> => {
    try {
      const data = await fetchJSON(`${KUTA_BASE}/districts?city_id=${cityId}`);
      return data[0] ? { districtId: data[0].id, districtName: data[0].name, subdistrictId: data[0].id } : { districtId: 0, districtName: "" };
    } catch {
      // ponytail: district→subdistrict resolution is best-effort; when kuta.ku is unreachable the
      // backend already falls back to a default REG service. Upgrade: bundle a city→subdistrict table.
      return { districtId: 0, districtName: "" };
    }
  };

  return {
    provinces,
    citiesByProvince,
    useFallback,
    loading: provincesLoading,
    selectCity,
  };
}
