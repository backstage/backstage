import React from 'react';
import { Header, Page, pageTheme, HeaderLabel } from '@backstage/core';
// @ts-ignore
import logo from '../../assets/circle-logo-badge-white-15.png';
import { Box } from '@material-ui/core';

export const Layout: React.FC = ({ children }) => (
  <Page theme={pageTheme.tool}>
    <Header
      pageTitleOverride="Circle CI"
      title={
        <Box display="flex" alignItems="center">
          <img src={logo} style={{ height: '1em' }} />
          <Box mr={1} /> Circle CI
        </Box>
      }
    >
      <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    {children}
  </Page>
);
