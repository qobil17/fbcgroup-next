import { Stack } from "@mui/system";
import Head from "next/head";
import Top from "../Top";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import ChatbotWidget from "../chatbot/ChatbotWidget";

const withLayoutAuth = (Component: any) => {
  return (props: any) => {
    const device = useDeviceDetect();

    return (
      <>
        <Head>
          <title>FBC GROUP</title>
        </Head>
        <Stack id={device === "mobile" ? "mobile-wrap" : "pc-wrap"}>
          <Stack id="top">
            <Top />
          </Stack>
          {/* No header-basic banner — content fills remaining viewport height */}
          <Stack id="main" className="auth-layout__main">
            <Component {...props} />
          </Stack>
        </Stack>
        <ChatbotWidget />
      </>
    );
  };
};

export default withLayoutAuth;
