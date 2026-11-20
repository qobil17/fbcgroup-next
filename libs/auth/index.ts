import { makeVar } from "@apollo/client";
import { AuthMember } from "../types";

const TOKEN_KEY = "fbc_access_token";

export const userVar = makeVar<AuthMember | null>(null);

const decodeJwt = (token: string): (AuthMember & { exp?: number }) | null => {
  try {
    const part = token.split(".")[1];
    const json = decodeURIComponent(
      atob(part.replace(/-/g, "+").replace(/_/g, "/"))
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
  loadUserFromToken();
};

export const logout = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
  userVar(null);
};

// Sahifa ochilganda saqlangan tokendan foydalanuvchini tiklash
export const loadUserFromToken = () => {
  const token = getToken();
  if (!token) return userVar(null);
  const payload = decodeJwt(token);
  if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
    logout();
    return null;
  }
  return userVar({
    _id: payload._id,
    memberNick: payload.memberNick,
    memberPhone: payload.memberPhone,
    memberType: payload.memberType,
    memberImage: payload.memberImage,
  });
};
