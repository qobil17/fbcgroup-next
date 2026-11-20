import { createContext, useContext } from "react";
import type { Locale } from "./i18n";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const LocaleContext = createContext<LocaleContextValue>({
  locale: "uz",
  setLocale: () => {},
});

export const useLocaleContext = () => useContext(LocaleContext);
