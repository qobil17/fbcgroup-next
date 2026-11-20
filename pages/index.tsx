import { NextPage } from "next";
import { Stack } from "@mui/material";
import withLayoutMain from "../libs/components/layout/LayoutHome";
import AllServices from "../libs/components/homepage/AllServices";
import HplineServices from "../libs/components/homepage/HplineService";
import AlifLightServices from "../libs/components/homepage/AlifLightservice";
import useDeviceDetect from "../libs/hooks/useDeviceDetect";
import LatestProjects from "../libs/components/homepage/LatestProjects";
import Partners from "../libs/components/homepage/Partners";

const Home: NextPage = () => {
  const device = useDeviceDetect();

  if (device === "mobile") {
    return (
      <Stack className="home-page">
        <AllServices />
        <LatestProjects />
        <HplineServices />
        <AlifLightServices />
        <Partners />
      </Stack>
    );
  } else {
    return (
      <Stack className="home-page">
        <AllServices />
        <LatestProjects />
        <HplineServices />
        <AlifLightServices />
        <Partners />
      </Stack>
    );
  }
};

export default withLayoutMain(Home);
