import { makeStyles } from '@material-ui/core';
import { createApp } from '@backstage/core';
import React, { FC } from 'react';
import * as plugins from './plugins';

const useStyles = makeStyles(theme => ({
  '@global': {
    html: {
      height: '100%',
      fontFamily: theme.typography.fontFamily,
    },
    body: {
      height: '100%',
      fontFamily: theme.typography.fontFamily,
      'overscroll-behavior-y': 'none',
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
    },
  },
}));

const app = createApp({
  plugins: Object.values(plugins),
});

const AppProvider = app.getProvider();
const AppComponent = app.getRootComponent();

const App: FC<{}> = () => {
  useStyles();
  return (
    <AppProvider>
      <AppComponent />
    </AppProvider>
  );
};

export default App;
