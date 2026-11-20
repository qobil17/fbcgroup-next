import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="uz">
      {" "}
      {/* O'zbekiston uchun 'uz' yoki 'ru' tavsiya etiladi */}
      <Head>
        <meta charSet="UTF-8" />

        <meta name="robots" content="index, follow" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/img/logo/hpline-logo.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* SEO Keywords: fbcgroup va asosiy xizmatlar */}
        <meta
          name="keywords"
          content="fbcgroup, fbcgroup.uz, hpl panellar, yoritish tizimlari, fasad qoplamalari, lighting Uzbekistan, aliflight, hpline, binolarni yoritish"
        />
        <meta
          name="description"
          content="O'zbekiston bo'ylab professional binolarni yoritish tizimlari hamda ichki va tashqi fasad qoplamalarini o'rnatish. Sifatli materiallar va zamonaviy LED yechimlar!"
        />
        <meta
          property="og:title"
          content="FBC Group - Zamonaviy yoritish va fasad yechimlari"
        />
        <meta
          property="og:description"
          content="Professional montaj va sifat kafolati bilan binongizga yangi qiyofa bering."
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
