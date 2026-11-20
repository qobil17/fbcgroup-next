import { Stack } from "@mui/material";
import Link from "next/link";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";

// Vaqtinchalik matn — dizayn bosqichida yangilanadi
const About = () => (
  <Stack className="about-page">
    <Stack className="container">
      <h1>Biz haqimizda</h1>
      <p>
        FBC Group — O'zbekiston bo'ylab binolarni yoritish tizimlari hamda ichki va tashqi fasad qoplamalarini
        o'rnatish bilan shug'ullanadi. Sifatli materiallar, zamonaviy LED yechimlar va professional montaj.
      </p>
      <div className="about-brands">
        <Link href="/service/hplinecards" className="brand">
          <img src="/img/logo/hpline-logo.svg" alt="HPLine" />
          <span>HPL panellar va fasad qoplamalari</span>
        </Link>
        <Link href="/service/alifcards" className="brand">
          <img src="/img/logo/alif.svg" alt="Alif Lighting" />
          <span>Binolarni yoritish va LED tizimlari</span>
        </Link>
      </div>
    </Stack>
  </Stack>
);

export default withLayoutBasic(About);
