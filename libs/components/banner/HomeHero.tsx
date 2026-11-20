import Link from "next/link";
import { useTranslations } from "next-intl";
import EastIcon from "@mui/icons-material/East";

interface Props {
  mobile?: boolean;
}

// Bosh sahifa banneri: to'liq kenglikdagi rasm, sarlavha, ikki tugma va raqamlar
const HomeHero = ({ mobile = false }: Props) => {
  const t = useTranslations("hero");
  const s = useTranslations("about.stats");

  return (
    <section className={`home-hero${mobile ? " home-hero--mobile" : ""}`}>
      <picture className="home-hero__bg">
        <source media="(max-width: 900px)" srcSet="/img/banner/homeBanner-m.webp" />
        <img src="/img/banner/homeBanner.webp" alt="" />
      </picture>
      <div className="home-hero__shade" />

      <div className="home-hero__inner">
        <span className="home-hero__eyebrow">{t("eyebrow")}</span>
        <h1 className="home-hero__title">{t("title")}</h1>
        <p className="home-hero__subtitle">{t("subtitle")}</p>

        <div className="home-hero__actions">
          <Link href="/service" className="hero-btn hero-btn--light">
            {t("ctaServices")} <EastIcon fontSize="small" />
          </Link>
          <Link href="/order" className="hero-btn hero-btn--ghost">
            {t("ctaOrder")}
          </Link>
        </div>

        <div className="home-hero__stats">
          <div>
            <strong>{s("projects")}</strong>
            <span>{s("projectsLabel")}</span>
          </div>
          <div>
            <strong>{s("years")}</strong>
            <span>{s("yearsLabel")}</span>
          </div>
          <div>
            <strong>{s("regions")}</strong>
            <span>{s("regionsLabel")}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
