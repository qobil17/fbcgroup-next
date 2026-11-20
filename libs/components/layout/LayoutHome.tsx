import { Stack } from "@mui/system";
import Head from "next/head";
import Top from "../Top";
import Footer from "../Footer";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import ChatbotWidget from "../chatbot/ChatbotWidget";

const withLayoutMain = (Component: any) => {
  return (props: any) => {
    const device = useDeviceDetect();

    if (device === "mobile") {
      return (
        <>
          <Head>
            <title>FBC GROUP</title>
          </Head>
          <Stack id="mobile-wrap">
            <Stack id={"top"}>
              <Top />
            </Stack>
            <Stack id={"main"}>
              <Component {...props} />
            </Stack>
            <Stack id={"footer"}>
              <Footer />
            </Stack>
          </Stack>
          <ChatbotWidget />
        </>
      );
    } else {
      return (
        <>
          <Head>
            <title>FBCGROUP</title>
          </Head>
          <Stack id="pc-wrap">
            <Stack id={"top"}>
              <Top />
            </Stack>
            <Stack className={"header-main"}>
              <div className="banner-box"></div>
            </Stack>
            <Stack id={"main"}>
              <Component {...props} />
            </Stack>
            <Stack id={"footer"}>
              <Footer />
            </Stack>
          </Stack>
          <ChatbotWidget />
        </>
      );
    }
  };
};

export default withLayoutMain;
