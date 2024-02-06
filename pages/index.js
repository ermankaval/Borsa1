// pages/index.js
import React from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Forex3 from '@/components/Forex3';
import Forex4 from '@/components/Forex4';
import Counter from '../components/Counter';

const Home = () => {
  return (
    <>
      <Head>
        <title>TradERMAN</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel="icon" href='tradERMAN_ikon_.ico' />
      </Head>

      <div className="container mx-auto">
        <Navbar />
        <div className="p-5 mt-20">
          <Counter />
          <Forex3 />
          <Forex4 />
        </div>
      </div>
    </>
  );
};


export default Home;
