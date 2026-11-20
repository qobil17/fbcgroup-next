import { useEffect, useRef, useState } from "react";
import { Box, Link, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useLocaleContext } from "../../lib/LocaleContext";
import { useAuthContext } from "../../lib/AuthContext";
import type { Locale } from "../../lib/i18n";
import useDeviceDetect from "../hooks/useDeviceDetect";
import { getImageUrl } from "../../lib/uploadImage";

const LOCALE_META: { value: Locale; code: string; label: string }[] = [
  { value: "uz", code: "UZ", label: "O'zbek" },
  { value: "ru", code: "RU", label: "Русский" },
  { value: "en", code: "EN", label: "English" },
];

const Top = () => {
  const device = useDeviceDetect();
  const t = useTranslations("nav");
  const { locale, setLocale } = useLocaleContext();
  const { authMember, authReady, logout } = useAuthContext();
  const router = useRouter();

  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  const [avatarLightbox, setAvatarLightbox] = useState(false);

  // Mobile hamburger state
  const [menuOpen, setMenuOpen] = useState(false);

  // After mount, server and client have rendered the same placeholder once.
  // Now it's safe to render the real auth content without hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!avatarLightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setAvatarLightbox(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [avatarLightbox]);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const current = LOCALE_META.find((m) => m.value === locale)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLangSelect = (loc: Locale) => {
    setLocale(loc);
    setLangOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUserOpen(false);
    setMenuOpen(false);
    router.push("/");
  };

  const handleUserNav = (path: string) => {
    setUserOpen(false);
    setMenuOpen(false);
    router.push(path);
  };

  const rawAvatar = authMember?.memberImage ?? "";
  const avatar = getImageUrl(rawAvatar) || "/img/profile/defaultUser.svg";
  const nick = authMember?.memberNick ?? t("userMenuTitle");

  // ── MOBILE TOP ────────────────────────────────────────────────────────────────
  if (device === "mobile") {
    return (
      <>
        <div className="mobile-navbar">
          <Link href="/" className="mobile-navbar__logo">
            <img src="/img/logo/hpline-mark.svg" alt="HPLine" />
          </Link>
          <div className="mobile-navbar__right">
            <button
              className="mobile-lang-btn"
              onClick={() => {
                const idx = LOCALE_META.findIndex((m) => m.value === locale);
                const next = LOCALE_META[(idx + 1) % LOCALE_META.length];
                setLocale(next.value);
              }}
            >
              {current.code}
            </button>
            <button
              className="mobile-hamburger"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile slide-in menu */}
        {menuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}>
            <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-menu__header">
                <span className="mobile-menu__title">FBC GROUP</span>
                <button
                  className="mobile-menu__close"
                  onClick={() => setMenuOpen(false)}
                >
                  ✕
                </button>
              </div>

              {authReady && authMember && (
                <div className="mobile-menu__user">
                  <img src={avatar} alt={nick} className="mobile-menu__avatar" />
                  <span className="mobile-menu__nick">{nick}</span>
                </div>
              )}

              <nav className="mobile-menu__nav">
                <Link href="/" className="mobile-menu__link" onClick={() => setMenuOpen(false)}>
                  {t("home")}
                </Link>
                <Link href="/service" className="mobile-menu__link" onClick={() => setMenuOpen(false)}>
                  {t("services")}
                </Link>
                {authReady && authMember && (
                  <Link href="/order" className="mobile-menu__link" onClick={() => setMenuOpen(false)}>
                    {t("order")}
                  </Link>
                )}
                <Link href="/about" className="mobile-menu__link" onClick={() => setMenuOpen(false)}>
                  {t("about")}
                </Link>
                <Link href="/help" className="mobile-menu__link" onClick={() => setMenuOpen(false)}>
                  {t("help")}
                </Link>
              </nav>

              {!authReady ? null : authMember ? (
                <div className="mobile-menu__actions">
                  <button
                    className="mobile-menu__action-btn"
                    onClick={() => handleUserNav("/member/edit")}
                  >
                    {t("editProfile")}
                  </button>
                  <button
                    className="mobile-menu__action-btn"
                    onClick={() => handleUserNav("/member/orders")}
                  >
                    {t("myOrders")}
                  </button>
                  <button
                    className="mobile-menu__action-btn mobile-menu__action-btn--logout"
                    onClick={handleLogout}
                  >
                    {t("logout")}
                  </button>
                </div>
              ) : (
                <div className="mobile-menu__actions">
                  <button
                    className="mobile-menu__auth-btn"
                    onClick={() => { setMenuOpen(false); router.push("/auth"); }}
                  >
                    {t("loginBtn")}
                  </button>
                </div>
              )}

              <div className="mobile-menu__lang">
                {LOCALE_META.map((m) => (
                  <button
                    key={m.value}
                    className={`mobile-menu__lang-btn${locale === m.value ? " active" : ""}`}
                    onClick={() => { setLocale(m.value); setMenuOpen(false); }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {avatarLightbox && (
          <div className="lightbox" onClick={() => setAvatarLightbox(false)}>
            <button className="lightbox__close" onClick={() => setAvatarLightbox(false)}>✕</button>
            <img
              className="lightbox__img"
              src={avatar}
              alt={nick}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </>
    );
  }

  // ── DESKTOP TOP ───────────────────────────────────────────────────────────────
  return (
    <>
    <Stack className={"navbar"}>
      <Stack className={"navbar-main"}>
        <Stack className={"container "}>
          {/* Logo */}
          <Box component={"div"} className={"logo-box"}>
            <Link href={"/"}>
              <img className="logo-img" src="/img/logo/hpline-mark.svg" alt="HPLine" />
            </Link>
          </Box>

          {/* Nav links — suppressHydrationWarning because translated text differs
              between server (always "uz") and client first render (saved locale) */}
          <Box component={"div"} className={"router-box"} suppressHydrationWarning>
            <Link href={"/"}><div suppressHydrationWarning>{t("home")}</div></Link>
            <Link href={"/service"}><div suppressHydrationWarning>{t("services")}</div></Link>
            <Link href={"/about"}><div suppressHydrationWarning>{t("about")}</div></Link>
            <Link href={"/help"}><div suppressHydrationWarning>{t("help")}</div></Link>
          </Box>

          {/* Right side */}
          <Box component={"div"} className={"user-box"}>
            {/* Language switcher */}
            <div className="lang-switcher" ref={langRef}>
              <button
                className="lang-trigger"
                onClick={() => setLangOpen((prev) => !prev)}
              >
                {current.code}
                <span className={`lang-trigger__arrow${langOpen ? " open" : ""}`}>▾</span>
              </button>

              {langOpen && (
                <div className="lang-dropdown">
                  {LOCALE_META.map((m) => (
                    <button
                      key={m.value}
                      className={`lang-option${locale === m.value ? " active" : ""}`}
                      onClick={() => handleLangSelect(m.value)}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth slot — server + client first render both show the hidden placeholder
                (same HTML = no hydration mismatch). After useEffect sets mounted=true,
                the real auth content renders. 220px CSS width never changes. */}
            <div className="navbar-auth-slot">
              {!mounted ? (
                <div style={{ width: "100%", height: "40px", visibility: "hidden" }} />
              ) : authMember ? (
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <Link href="/order" className="order-nav-link">
                    <div>{t("order")}</div>
                  </Link>
                  <div className="user-menu" ref={userRef}>
                    <div
                      className="user-menu__trigger"
                      onClick={() => setUserOpen((prev) => !prev)}
                    >
                      <img src={avatar} alt={nick} />
                    </div>

                    {userOpen && (
                      <div className="user-menu__dropdown">
                        <div className="user-menu__header">
                          <img
                            src={avatar}
                            alt={nick}
                            className="user-menu__avatar"
                            style={{ cursor: "zoom-in" }}
                            onClick={() => { setUserOpen(false); setAvatarLightbox(true); }}
                          />
                          <span className="user-menu__name">{nick}</span>
                        </div>

                        <div className="user-menu__divider" />

                        <button
                          className="user-menu__item"
                          onClick={() => handleUserNav("/member/edit")}
                        >
                          <span className="user-menu__item-icon">✎</span>
                          {t("editProfile")}
                        </button>

                        <button
                          className="user-menu__item"
                          onClick={() => handleUserNav("/member/orders")}
                        >
                          <span className="user-menu__item-icon">☰</span>
                          {t("myOrders")}
                        </button>

                        <div className="user-menu__divider" />

                        <button
                          className="user-menu__item user-menu__item--logout"
                          onClick={handleLogout}
                        >
                          <span className="user-menu__item-icon">⎋</span>
                          {t("logout")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  className="auth-nav-btn"
                  onClick={() => router.push("/auth")}
                >
                  {t("loginBtn")}
                </button>
              )}
            </div>
          </Box>
        </Stack>
      </Stack>
    </Stack>

    {avatarLightbox && (
        <div className="lightbox" onClick={() => setAvatarLightbox(false)}>
          <button className="lightbox__close" onClick={() => setAvatarLightbox(false)}>✕</button>
          <img
            className="lightbox__img"
            src={avatar}
            alt={nick}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default Top;
