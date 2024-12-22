import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";
import Head from "next/head";

// Extend NextPage type to include getLayout
export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

// Extend AppProps type to use the extended NextPage type
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the page's layout or default to just rendering the page
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Base App</title>
      </Head>
      <SessionProvider session={pageProps.session}>
        {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    </>
  );
}

export default MyApp;
