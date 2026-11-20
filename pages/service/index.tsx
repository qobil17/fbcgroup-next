import { Box, Link, Stack } from "@mui/material";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import { NextPage } from "next";
import { useTranslations } from "next-intl";

const ServiceList: NextPage = () => {
  const t = useTranslations("service");

  return (
    <Stack className="service">
      <Stack className="container">
        <Box className="service-info">
          <strong>{t("ourServices").toUpperCase()}</strong>
        </Box>
        <Stack className="service-boxes">
          <Link href={"/service/hplinecards"} className="service-left">
            <div>HPLINE</div>
          </Link>

          <Link href={"/service/alifcards"} className="service-right">
            <div>ALIF LIGHT</div>
          </Link>
        </Stack>
      </Stack>
    </Stack>
  );
};
export default withLayoutBasic(ServiceList);
