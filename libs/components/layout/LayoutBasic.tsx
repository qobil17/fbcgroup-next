import { Stack } from "@mui/system";
import Head from "next/head";
import Top from "../Top";
import Footer from "../Footer";

const withLayoutBasic = (Component: any) => {
  return (props: any) => {
    return (
      <>
        <Head>
          <title>FBCGROUP</title>
        </Head>
        <Stack id="pc-wrap">
          <Stack id={"top"}>
            <Top />
          </Stack>
          <Stack className={`header-basic`}>
            <Stack className={"container"}>
              <strong>Service check</strong>
              <span>Sizni yana ko'rib turganimizdan hursandmiz!</span>
            </Stack>
          </Stack>
          <Stack id={"main"}>
            <Component {...props} />
          </Stack>

          <Stack id={"footer"}>
            <Footer />
          </Stack>
        </Stack>
      </>
    );
  };
};
export default withLayoutBasic;
