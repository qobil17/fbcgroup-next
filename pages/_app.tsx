import type { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { ApolloProvider } from "@apollo/client";

import "../scss/app.scss";
import "../scss/pc/main.scss";
import "../scss/mobile/main.scss";
import { light } from "../scss/MaterialTheme";
import { LocaleContext } from "../lib/LocaleContext";
import type { Locale } from "../lib/i18n";
import { AuthProvider } from "../lib/AuthContext";
import client from "../lib/apolloClient";

import uz from "../messages/uz.json";
import ru from "../messages/ru.json";
import en from "../messages/en.json";

const messages = { uz, ru, en };
const VALID_LOCALES: Locale[] = ["uz", "ru", "en"];

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Reads the persisted locale on the client after hydration.
// NOT used as a lazy initializer — initial state is always "uz" to match SSR.
function readSavedLocale(): Locale {
  // Prefer window.__INITIAL_LOCALE__ set by the blocking <script> in _document.tsx
  const g = (window as any).__INITIAL_LOCALE__ as Locale | undefined;
  if (g && VALID_LOCALES.includes(g)) return g;
  // Fallback: cookie
  const cookie = document.cookie.split(";").find((c) => c.trim().startsWith("locale="));
  if (cookie) {
    const val = cookie.split("=")[1]?.trim() as Locale;
    if (VALID_LOCALES.includes(val)) return val;
  }
  // Fallback: localStorage
  const ls = localStorage.getItem("locale") as Locale;
  if (ls && VALID_LOCALES.includes(ls)) return ls;
  return "uz";
}

export default function App({ Component, pageProps }: AppProps) {
  const theme = useMemo(() => createTheme(light), []);

  // Always start with "uz" — matches server render exactly, no hydration mismatch.
  // useIsomorphicLayoutEffect below updates to the real locale before first paint.
  const [locale, setLocaleState] = useState<Locale>("uz");

  useIsomorphicLayoutEffect(() => {
    const saved = readSavedLocale();
    setLocaleState(saved);
  }, []);

  const setLocale = (newLocale: Locale) => {
    localStorage.setItem("locale", newLocale);
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    setLocaleState(newLocale);
  };

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <LocaleContext.Provider value={{ locale, setLocale }}>
          {/* No key={locale} — avoids full child remount on language switch */}
          <NextIntlClientProvider locale={locale} messages={messages[locale]}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Component {...pageProps} />
            </ThemeProvider>
          </NextIntlClientProvider>
        </LocaleContext.Provider>
      </AuthProvider>
    </ApolloProvider>
  );
}
