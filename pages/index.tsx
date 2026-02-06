import { Box, Container, Stack, Typography } from "@mui/material";
import { brown, green } from "@mui/material/colors";
import { NextPage } from "next";
import withLayoutMain from "../libs/components/layout/LayoutHome";
import AllServices from "../libs/components/homepage/AllServices";
import HplineServices from "../libs/components/homepage/HplineService";
import AlifLightServices from "../libs/components/homepage/AlifLightservice";

const Home: NextPage = () => {
  return (
    <Stack className="home-page">
      <AllServices />
      <HplineServices />
      <AlifLightServices />
    </Stack>
  );
};
export default withLayoutMain(Home);
