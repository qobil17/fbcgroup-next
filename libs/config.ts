// Backend manzili. Vercel'da NEXT_PUBLIC_API_URL environment o'zgaruvchisi orqali beriladi.
// Masalan: https://fbcgroup-api.onrender.com
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3007").replace(/\/$/, "");
export const GRAPHQL_URL = `${API_URL}/graphql`;

export const DEFAULT_SERVICE_IMAGE = "/img/service/house.webp";

// Backend rasmlarni "uploads/..." ko'rinishida saqlaydi — to'liq URL yasaymiz
export const imageUrl = (path?: string | null): string => {
  if (!path) return DEFAULT_SERVICE_IMAGE;
  if (/^https?:\/\//.test(path) || path.startsWith("/img/")) return path;
  return `${API_URL}/${path.replace(/^\//, "")}`;
};
