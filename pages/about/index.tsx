import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import About from "../../libs/components/about/About";
import { useLocaleContext } from "../../lib/LocaleContext";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";

const AboutPage = () => {
  const device = useDeviceDetect();
  const { locale } = useLocaleContext();
  return <About locale={locale} />;
};

export default withLayoutBasic(AboutPage, { subtitleKey: "about.hero.slogan" });
