const GQL_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3007/graphql";

export async function gqlRequest(
  query: string,
  variables: Record<string, unknown> = {},
  token?: string
): Promise<any> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(GQL_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) {
    const message: string = json.errors[0].message ?? "";
    if (token && isAuthError(message)) handleExpiredSession();
    throw new Error(message);
  }
  return json.data;
}

// Token muddati tugagan yoki yaroqsiz bo'lsa backend shu xabarlarni qaytaradi
export const isAuthError = (message: string) =>
  /jwt expired|jwt malformed|invalid signature|invalid token|not authenticated/i.test(message);

export function clearSession(expired = false) {
  if (typeof window === "undefined") return;
  ["accessToken", "memberType", "memberNick", "memberImage"].forEach((k) => localStorage.removeItem(k));
  localStorage.setItem("logout", Date.now().toString());
  // kirish sahifasi "sessiya tugadi" xabarini ko'rsatishi uchun
  if (expired) sessionStorage.setItem("fbc_session_expired", "1");
}

/** Kirish sahifasi uchun: sessiya muddati tugaganmi (bir marta o'qiladi). */
export function consumeSessionExpired(): boolean {
  if (typeof window === "undefined") return false;
  const v = sessionStorage.getItem("fbc_session_expired") === "1";
  sessionStorage.removeItem("fbc_session_expired");
  return v;
}

/** Sessiya tugadi: tokenni o'chirib, tegishli kirish sahifasiga yuboradi. */
export function handleExpiredSession() {
  if (typeof window === "undefined") return;
  clearSession(true);
  const isAdmin = window.location.pathname.startsWith("/admin");
  const target = isAdmin ? "/admin/login" : "/auth";
  if (!window.location.pathname.startsWith(isAdmin ? "/admin/login" : "/auth")) window.location.assign(target);
}

/** Token muddati o'tganmi (JWT ichidagi exp bo'yicha). */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  return !!payload?.exp && payload.exp * 1000 < Date.now();
}

export function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("accessToken") ?? "";
}

export function decodeJWT(token: string): Record<string, any> | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}
