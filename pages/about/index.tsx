import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import About from "../../libs/components/about/About";
import { useLocaleContext } from "../../lib/LocaleContext";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import Partners from "../../libs/components/homepage/Partners";

const AboutPage = () => {
  const device = useDeviceDetect();
  const { locale } = useLocaleContext();
  return (
    <>
      <About locale={locale} />
      <Partners />
    </>
  );
};

export default withLayoutBasic(AboutPage, { subtitleKey: "about.hero.slogan" });
