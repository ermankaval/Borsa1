
import React from 'react';
import { CurrencyProvider } from '../components/CurrencyContext';
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';


function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (

    <SessionProvider session={session}>
      <CurrencyProvider>
        <Component {...pageProps} />
      </CurrencyProvider>
    </SessionProvider>
  );
}

export default MyApp;
