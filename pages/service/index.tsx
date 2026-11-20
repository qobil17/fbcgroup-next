import { Stack } from "@mui/material";
import Link from "next/link";
import { NextPage } from "next";
import { useTranslations } from "next-intl";
import EastIcon from "@mui/icons-material/East";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";

const BRANDS = [
  {
    href: "/service/hplinecards",
    logo: "/img/logo/hpline-logo-white.svg",
    name: "HPLINE",
    image: "/img/banner/basicBanner-m.webp",
    tag: "hplineTag",
    desc: "hplineDesc",
  },
  {
    href: "/service/alifcards",
    logo: "/img/logo/alif.svg",
    name: "ALIF LIGHT",
    image: "/img/banner/homeBanner-m.webp",
    tag: "alifTag",
    desc: "alifDesc",
  },
];

const ServiceList: NextPage = () => {
  const t = useTranslations("service");

  return (
    <Stack className="service">
      <Stack className="container">
        <div className="brand-grid">
          {BRANDS.map((b) => (
            <Link key={b.href} href={b.href} className="brand-card">
              <img className="brand-card__bg" src={b.image} alt="" />
              <div className="brand-card__shade" />
              <div className="brand-card__body">
                <img className="brand-card__logo" src={b.logo} alt={b.name} />
                <span className="brand-card__tag">{t(b.tag)}</span>
                <h2 className="brand-card__name">{b.name}</h2>
                <p className="brand-card__desc">{t(b.desc)}</p>
                <span className="brand-card__link">
                  {t("view")} <EastIcon fontSize="small" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(ServiceList);
