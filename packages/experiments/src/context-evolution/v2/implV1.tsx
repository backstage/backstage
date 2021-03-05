import React, { PropsWithChildren } from 'react';
import { AppContextV1 } from './v1';

function Header({ children }: PropsWithChildren<{}>) {
  return <header>{children}</header>;
}

function Footer({ children }: PropsWithChildren<{}>) {
  return <footer>{children}</footer>;
}

function Alert() {
  return <i className="alert"></i>;
}

function Warning() {
  return <i className="warning"></i>;
}

const appContextV1 = new AppContextV1({
  plugins: [{ name: 'jira' }, { name: 'costInsights' }],
  components: { Header, Footer },
  icons: { Alert, Warning },
});

appContextV1.getPlugins();
