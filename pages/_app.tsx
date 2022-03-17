import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { NotificationsContainer } from '@macpaw/macpaw-ui';
import '@macpaw/macpaw-ui/lib/ui.css';
import '../styles/globals.sass';
import '../styles/notification.scss';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={session}>
      <NotificationsContainer />
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
}

export default MyApp;
