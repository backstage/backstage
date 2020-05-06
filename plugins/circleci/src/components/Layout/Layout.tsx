import React from 'react';
import { Header, Page, pageTheme, HeaderLabel } from '@backstage/core';

export const Layout: React.FC = ({ children }) => (
  <Page theme={pageTheme.tool}>
    <Header title="Welcome to circleci!" subtitle="Optional subtitle">
      <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    {children}
  </Page>
);
