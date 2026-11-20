import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="uz">
      <Head>
        {/*
          Blocking inline script — runs before React hydration, before first paint.
          Reads the locale cookie (written by _app.tsx on language change) and stores
          it in window.__INITIAL_LOCALE__ so _app.tsx can read it synchronously on
          the very first render, eliminating the UZ→RU flash entirely.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var V={uz:1,ru:1,en:1},l='uz',c=document.cookie.split(';').find(function(s){return s.trim().indexOf('locale=')===0;});if(c){var v=c.split('=')[1].trim();if(V[v])l=v;}if(l==='uz'&&typeof localStorage!=='undefined'){var ls=localStorage.getItem('locale');if(ls&&V[ls])l=ls;}document.documentElement.lang=l;window.__INITIAL_LOCALE__=l;}catch(e){}})();`,
          }}
        />

        <meta charSet="UTF-8" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />

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
