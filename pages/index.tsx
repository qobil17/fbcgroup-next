import { Box, Container, Stack, Typography } from "@mui/material";
import { brown, green } from "@mui/material/colors";
import { NextPage } from "next";
import withLayoutMain from "../libs/components/layout/LayoutHome";

const Home: NextPage = () => {
  return (
    <>
      <Container>
        <Stack flexDirection={"column"}>
          <Box>All Services</Box>
          <Box>HPLine Services</Box>
          <Box>AlifLight Service</Box>
          <Box>Events</Box>
        </Stack>
      </Container>
    </>
  );
};
export default withLayoutMain(Home);
