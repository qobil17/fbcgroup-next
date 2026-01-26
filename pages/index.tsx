import { Box, Container, Stack, Typography } from "@mui/material";
import { brown, green } from "@mui/material/colors";

export default function Home() {
  return (
    <>
      <Stack sx={{ background: "#81c784" }}>Header</Stack>
      <Container>
        <Stack flexDirection={"column"}>
          <Box>All Services</Box>
          <Box>HPLine Services</Box>
          <Box>AlifLight Service</Box>
          <Box>Events</Box>
        </Stack>
      </Container>
      <Stack sx={{ background: "#a1887f" }}>Footer</Stack>
    </>
  );
}
