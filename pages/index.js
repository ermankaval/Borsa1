// import { Inter } from 'react-font-inter';
import React from 'react';
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import Forex3 from '@/components/Forex3'
import Forex4 from '@/components/Forex4'
import { CurrencyProvider } from '../components/CurrencyContext';



export default function Home() {
  return (
    <>
      <Head>
        <title>TradERMAN</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel="icon" href='tradERMAN_ikon_.ico' />
      </Head>

      <CurrencyProvider>
        <Navbar />
        <Forex3 />
        <Forex4 />
      </CurrencyProvider>



    </>
  )
}
