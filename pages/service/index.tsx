import { Box, Container, Link, Stack } from "@mui/material";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import { NextPage } from "next";

const ServiceList: NextPage = () => {
  return (
    <Stack className="service">
      <Stack className="container">
        <Box className="service-info">
          <strong>BIZNI XIZMATLAR</strong>
        </Box>
        <Stack className="service-boxes">
          <Link href={"/service/hplinecards"} className="service-left">
            <div>HPLINE</div>
          </Link>

          <Link href={"/service/alifcards"} className="service-right">
            <div>ALIF</div>
          </Link>
        </Stack>
      </Stack>
    </Stack>
  );
};
export default withLayoutBasic(ServiceList);
