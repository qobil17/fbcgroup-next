import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

// Sahifa manzili bo'yicha sarlavha (tarjima kaliti) va fon rasmi
const PAGES: { match: (p: string) => boolean; title: string; image: "hpline" | "alif" }[] = [
  { match: (p) => p === "/service/hplinecards", title: "home.hplineServices", image: "hpline" },
  { match: (p) => p === "/service/alifcards", title: "home.alifServices", image: "alif" },
  { match: (p) => p.startsWith("/service"), title: "nav.services", image: "hpline" },
  { match: (p) => p === "/about", title: "nav.about", image: "alif" },
  { match: (p) => p === "/help", title: "nav.help", image: "hpline" },
  { match: (p) => p === "/member/orders", title: "nav.myOrders", image: "hpline" },
  { match: (p) => p === "/member/edit", title: "nav.editProfile", image: "hpline" },
  { match: (p) => p === "/order", title: "nav.order", image: "alif" },
];

const IMAGES = {
  hpline: { pc: "/img/banner/basicBanner.webp", m: "/img/banner/basicBanner-m.webp" },
  alif: { pc: "/img/banner/homeBanner.webp", m: "/img/banner/homeBanner-m.webp" },
};

interface Props {
  mobile?: boolean;
  subtitleKey?: string; // masalan "about.hero.slogan"
}

const PageBanner = ({ mobile = false, subtitleKey }: Props) => {
  const router = useRouter();
  const t = useTranslations();
  const page = PAGES.find((p) => p.match(router.pathname));
  const title = page ? t(page.title) : "FBC Group";
  const img = IMAGES[page?.image ?? "hpline"];

  return (
    <section className={`page-banner${mobile ? " page-banner--mobile" : ""}`}>
      <picture className="page-banner__bg">
        <source media="(max-width: 900px)" srcSet={img.m} />
        <img src={img.pc} alt="" />
      </picture>
      <div className="page-banner__shade" />
      <div className="page-banner__inner">
        <nav className="page-banner__crumbs">
          <Link href="/">{t("nav.home")}</Link>
          <span>/</span>
          <span className="current">{title}</span>
        </nav>
        <h1 className="page-banner__title">{title}</h1>
        {subtitleKey && <p className="page-banner__subtitle">{t(subtitleKey)}</p>}
      </div>
    </section>
  );
};

export default PageBanner;
