import React from 'react';
import Head from 'next/head';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Layout: React.FC = ({ children}) => {
  return (
    <>
      <Head>
        <title>Together App</title>
        <meta name="description" content="Russian Warship – Go Fuck Yourself!"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <Header/>
      <main>{children}</main>
      <Footer/>
    </>
  );
};

export default Layout;
