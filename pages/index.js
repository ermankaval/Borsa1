// pages/index.js
import React from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Forex3 from '@/components/Forex3';
import Forex5 from '@/components/Forex5';
import Counter from '../components/Counter';
import Button from '@/components/button';
import Kart from '@/components/3D_Kart';

const Home = () => {
  return (
    <>
      <Head>
        <title>TradERMAN</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel="icon" href='tradERMAN_ikon_.ico' />
      </Head>

      <div className="mx-auto">
        <Navbar />
        <div className="p-5 mt-20">
          {/* <Counter /> */}
          {/* <Button /> */}
          {/* <Forex3 /> */}
          <Kart />
          <Forex5 />
        </div>
      </div>
    </>
  );
};


export default Home;
