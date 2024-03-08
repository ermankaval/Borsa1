// pages/index.js
import React, { useEffect } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Forex3 from '@/components/Forex3';
import Forex5 from '@/components/Forex5';
import { useRouter } from 'next/router';
import { onAuthStateChanged, getAuth, signOut } from 'firebase/auth';


const Home = () => {
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        router.push('/');
      }
    });


    return () => unsubscribe(); // Cleanup the subscription on component unmount
  }, []);

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
          {/* Your existing components */}
          {/* <Counter /> */}
          {/* <Button /> */}
          <Forex3 />
          <Forex5 />
        </div>
      </div>
    </>
  );
};

export default Home;
