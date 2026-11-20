// Xizmat nomi va tavsifini tanlangan tilda qaytaradi.
// Tarjima kiritilmagan bo'lsa, o'zbekcha matn ko'rsatiladi.

interface Localizable {
  serviceTitle?: string | null;
  serviceTitleRu?: string | null;
  serviceTitleEn?: string | null;
  serviceDesc?: string | null;
  serviceDescRu?: string | null;
  serviceDescEn?: string | null;
}

const pick = (locale: string, uz?: string | null, ru?: string | null, en?: string | null) =>
  (locale === "ru" && ru?.trim()) || (locale === "en" && en?.trim()) || uz || "";

export const serviceTitle = (s: Localizable, locale: string) =>
  pick(locale, s.serviceTitle, s.serviceTitleRu, s.serviceTitleEn);

export const serviceDesc = (s: Localizable, locale: string) =>
  pick(locale, s.serviceDesc, s.serviceDescRu, s.serviceDescEn);

// GraphQL so'rovlariga qo'shiladigan tarjima maydonlari
export const SERVICE_I18N_FIELDS = `
  serviceTitleRu
  serviceTitleEn
`;
export const SERVICE_I18N_DESC_FIELDS = `
  serviceDescRu
  serviceDescEn
`;
