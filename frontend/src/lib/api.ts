/**
 * Centralized API base URL resolver.
 * Strips any trailing `/api/v1` or `/` so `${apiBase()}/api/v1/...` never duplicates paths.
 */
export function getApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return raw.replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "");
}

export function apiUrl(path: string): string {
  const base = getApiBase();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
