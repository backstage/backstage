import React from 'react';
import { Header, Page, pageTheme, HeaderLabel } from '@backstage/core';
// @ts-ignore
import logo from '../../assets/circle-logo-horizontal-white.png';

export const Layout: React.FC = ({ children }) => (
  <Page theme={pageTheme.tool}>
    <Header title={<img src={logo} style={{ height: '2em' }} />}>
      <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    {children}
  </Page>
);
