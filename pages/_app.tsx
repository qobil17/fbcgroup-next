import type { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useState } from "react";

import "../scss/app.scss";
import "../scss/pc/main.scss";
import { light } from "../scss/MaterialTheme";

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState(createTheme(light));
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
