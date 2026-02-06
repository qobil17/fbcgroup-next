import { Box, Container, Stack } from "@mui/material";
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
          <Box className="service-left">
            <span>ALIF LIGHT</span>
          </Box>
          <Box className="service-right">
            <span>HPLINE</span>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};
export default withLayoutBasic(ServiceList);
