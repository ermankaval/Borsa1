// pages/index.js
import React from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Forex5 from '@/components/Forex5';
import Kart from '@/components/3D_Kart';
import { getSession, useSession } from 'next-auth/react';
import Login from '@/components/Login';

export default function Home() {
  try {
    const { data: session } = useSession();

    if (!session) return <Login />;

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
            <Kart />
            <Forex5 />
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('An error occurred in Home component:', error);
    // You can handle the error here, redirect, or display a user-friendly message
    return <p>An unexpected error occurred. Please try again later.</p>;
  }
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession(context);
    return {
      props: {
        session,
      },
    };
  } catch (error) {
    console.error('An error occurred in getServerSideProps:', error);
    // Handle the error as needed
    return {
      props: {
        session: null,
      },
    };
  }
}
