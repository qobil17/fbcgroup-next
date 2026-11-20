import type { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useEffect, useState } from "react";
import { ApolloProvider } from "@apollo/client";

import "../scss/app.scss";
import "../scss/pc/main.scss";
import { light } from "../scss/MaterialTheme";
import { getApolloClient } from "../libs/apollo/client";
import { loadUserFromToken } from "../libs/auth";

export default function App({ Component, pageProps }: AppProps) {
  const [theme] = useState(createTheme(light));
  const client = getApolloClient();

  useEffect(() => {
    loadUserFromToken();
  }, []);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
}
