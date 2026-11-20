import { useTranslations } from "next-intl";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import Help from "../../libs/components/help/Help";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";

const HelpPage = () => {
  const device = useDeviceDetect();
  const t = useTranslations("help");

  const content = {
    faqTitle: t("faqTitle"),
    faq: (t.raw("faq") as { q: string; a: string }[]),
    contactTitle: t("contactTitle"),
    phone: t("phone"),
    phoneLabel: t("phoneLabel"),
    email: t("email"),
    emailLabel: t("emailLabel"),
    hours: t("hours"),
    hoursLabel: t("hoursLabel"),
    quickLinksTitle: t("quickLinksTitle"),
    quickLinks: (t.raw("quickLinks") as { label: string; href: string }[]),
  };

  return (
    <Help
      bannerTitle={t("bannerTitle")}
      bannerSub={t("bannerSub")}
      content={content}
    />
  );
};

export default withLayoutBasic(HelpPage);
