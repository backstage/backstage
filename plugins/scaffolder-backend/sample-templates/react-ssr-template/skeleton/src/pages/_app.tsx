import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import styled from 'styled-components';
import { Header } from '../components/Header';

const StyledApp = styled.div`
  > * {
    padding-left: 16px;
    padding-right: 16px;
  }
`;

const Main = styled.div`
  margin: 2em auto;
  height: 85vh;
`;

class CustomApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <StyledApp>
        <Head>
          <link rel="stylesheet" href="/static/fonts.css" />
        </Head>
        <Header />
        <Main>
          <Component {...pageProps} />
        </Main>
      </StyledApp>
    );
  }
}

export default CustomApp;
