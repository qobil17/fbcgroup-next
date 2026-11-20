import { createContext, useContext, useEffect, useLayoutEffect, useState, ReactNode } from "react";
import { decodeJWT, isTokenExpired, clearSession } from "./gql";

// Runs synchronously before paint on client; falls back to useEffect on server (SSR-safe)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface AuthMember {
  _id: string;
  memberNick: string;
  memberType: string;
  memberImage: string;
}

interface AuthContextValue {
  authMember: AuthMember | null;
  authReady: boolean;
  // accessToken is optional — pass it on login/signup so the token is
  // written here rather than duplicated at every call site.
  setAuthMember: (m: AuthMember | null, accessToken?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  authMember: null,
  authReady: false,
  setAuthMember: () => {},
  logout: () => {},
});

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authMember, setAuthMemberState] = useState<AuthMember | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // Reads localStorage synchronously before paint (useLayoutEffect on client).
  // Server always skips this (falls back to useEffect which is a no-op on SSR).
  // Both server and client start with null/false — no hydration mismatch.
  useIsomorphicLayoutEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { setAuthReady(true); return; }
    if (isTokenExpired(token)) { clearSession(true); setAuthReady(true); return; }
    const payload = decodeJWT(token);
    if (!payload) { setAuthReady(true); return; }
    setAuthMemberState({
      _id: payload._id ?? "",
      memberNick: localStorage.getItem("memberNick") ?? payload.memberNick ?? "",
      memberType: payload.memberType ?? localStorage.getItem("memberType") ?? "USER",
      memberImage: localStorage.getItem("memberImage") ?? "",
    });
    setAuthReady(true);
  }, []);

  // Cross-tab login/logout sync.
  useIsomorphicLayoutEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "login") {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        const payload = decodeJWT(token);
        if (!payload) return;
        setAuthMemberState({
          _id: payload._id ?? "",
          memberNick: localStorage.getItem("memberNick") ?? "",
          memberType: payload.memberType ?? "",
          memberImage: localStorage.getItem("memberImage") ?? "",
        });
      }
      if (e.key === "logout") {
        setAuthMemberState(null);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setAuthMember = (m: AuthMember | null, accessToken?: string) => {
    setAuthMemberState(m);
    if (m) {
      if (accessToken) localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("memberNick", m.memberNick);
      localStorage.setItem("memberImage", m.memberImage ?? "");
      localStorage.setItem("memberType", m.memberType);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("memberType");
    localStorage.removeItem("memberNick");
    localStorage.removeItem("memberImage");
    setAuthMemberState(null);
    window.localStorage.setItem("logout", Date.now().toString());
  };

  return (
    <AuthContext.Provider value={{ authMember, authReady, setAuthMember, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
