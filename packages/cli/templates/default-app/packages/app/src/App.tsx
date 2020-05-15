import { CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core';
import { createApp } from '@backstage/core';
import { lightTheme } from '@backstage/theme';
import React, { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import * as plugins from './plugins';

const useStyles = makeStyles((theme) => ({
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
      <ThemeProvider theme={lightTheme}>
        <CssBaseline>
          <Router>
            <AppComponent />
          </Router>
        </CssBaseline>
      </ThemeProvider>
    </AppProvider>
  );
};

export default App;
