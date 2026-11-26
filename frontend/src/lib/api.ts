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

/** localStorage key for the signed session token issued by /api/v1/auth/login/. */
export const AUTH_TOKEN_KEY = "playhaven_auth_token";

/** `Authorization` header for endpoints that need a logged-in user (admin, order). */
export function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}
