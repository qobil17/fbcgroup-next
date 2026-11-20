import { NextPage } from "next";
import { Stack } from "@mui/material";
import withLayoutMain from "../libs/components/layout/LayoutHome";
import AllServices from "../libs/components/homepage/AllServices";
import HplineServices from "../libs/components/homepage/HplineService";
import AlifLightServices from "../libs/components/homepage/AlifLightservice";
import useDeviceDetect from "../libs/hooks/useDeviceDetect";

const Home: NextPage = () => {
  const device = useDeviceDetect();

  if (device === "mobile") {
    return (
      <Stack className="home-page">
        <AllServices />
        <HplineServices />
        <AlifLightServices />
      </Stack>
    );
  } else {
    return (
      <Stack className="home-page">
        <AllServices />
        <HplineServices />
        <AlifLightServices />
      </Stack>
    );
  }
};

export default withLayoutMain(Home);
