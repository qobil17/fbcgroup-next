import { Box, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import TelegramIcon from "@mui/icons-material/Telegram";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import useDeviceDetect from "../hooks/useDeviceDetect";

const Footer = () => {
  const device = useDeviceDetect();
  const t = useTranslations("footer");

  if (device === "mobile") {
    return (
      <div className="mobile-footer">
        <div className="mobile-footer__top">
          <img src="/img/logo/hpline-logo-white.svg" alt="HPLine" className="mobile-footer__logo" />
          <p className="mobile-footer__tagline">{t("tagline")}</p>
          <p className="mobile-footer__phone">{t("phone")}</p>
          <div className="mobile-footer__social">
            <FacebookOutlinedIcon />
            <TelegramIcon />
            <InstagramIcon />
            <XIcon />
          </div>
        </div>

        <div className="mobile-footer__links">
          <div className="mobile-footer__col">
            <strong>{t("popularSearch")}</strong>
            <span>{t("popular1")}</span>
            <span>{t("popular2")}</span>
          </div>
          <div className="mobile-footer__col">
            <strong>{t("quickLinks")}</strong>
            <span>{t("terms")}</span>
            <span>{t("privacy")}</span>
            <span>{t("services")}</span>
          </div>
          <div className="mobile-footer__col">
            <strong>{t("discover")}</strong>
            <span>{t("region1")}</span>
            <span>{t("region2")}</span>
            <span>{t("region3")}</span>
            <span>{t("region4")}</span>
          </div>
        </div>

        <div className="mobile-footer__bottom">
          <span>{t("copyright")}</span>
          <span>{t("legal")}</span>
        </div>
      </div>
    );
  }

  return (
    <Stack className={"footer-container"}>
      <Stack className={"main"}>
        <Stack className={"left"}>
          <Box component={"div"} className={"footer-box"}>
            <img src="/img/logo/hpline-logo-white.svg" alt="HPLine" className={"logo"} />
          </Box>

          <Box component={"div"} className={"footer-box"}>
            <span>{t("tagline")}</span>
            <p>{t("phone")}</p>
          </Box>

          <Box component={"div"} className={"footer-box"}>
            <p>{t("followUs")}</p>
            <div className={"media-box"}>
              <FacebookOutlinedIcon />
              <TelegramIcon />
              <InstagramIcon />
              <XIcon />
            </div>
          </Box>
        </Stack>

        <Stack className={"right"}>
          <Box component={"div"} className={"bottom"}>
            <div>
              <strong>{t("popularSearch")}</strong>
              <span>{t("popular1")}</span>
              <span>{t("popular2")}</span>
            </div>
            <div>
              <strong>{t("quickLinks")}</strong>
              <span>{t("terms")}</span>
              <span>{t("privacy")}</span>
              <span>{t("services")}</span>
              <span>{t("contact")}</span>
              <span>{t("faq")}</span>
            </div>
            <div>
              <strong>{t("discover")}</strong>
              <span>{t("region1")}</span>
              <span>{t("region2")}</span>
              <span>{t("region3")}</span>
              <span>{t("region4")}</span>
            </div>
          </Box>
        </Stack>
      </Stack>

      <Stack className={"second"}>
        <span>{t("copyright")}</span>
        <span>{t("legal")}</span>
      </Stack>
    </Stack>
  );
};

export default Footer;
