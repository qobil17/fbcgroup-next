import { Box, Container, Stack, Typography } from "@mui/material";
import { brown, green } from "@mui/material/colors";
import { NextPage } from "next";
import withLayoutMain from "../libs/components/layout/LayoutHome";

const Home: NextPage = () => {
  return (
    <>
      <Stack>
        <Stack flexDirection={"column"}>
          <Stack>
            <Stack className="container">All Services</Stack>
          </Stack>
          <Stack>
            <Stack className="container">HPLine Services</Stack>
          </Stack>
          <Stack>
            <Stack className="container">AlifLight Service</Stack>
          </Stack>
          <Stack>
            <Stack className="container">Events</Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
export default withLayoutMain(Home);
