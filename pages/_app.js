import '@/styles/globals.css';
import React from 'react';
import { CurrencyProvider } from '../components/CurrencyContext'



function MyApp({ Component, pageProps }) {
  return (
    <CurrencyProvider>
      <Component {...pageProps} />
    </CurrencyProvider>
  );
}

export default MyApp;
