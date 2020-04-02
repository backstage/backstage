import { CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core';
import { BackstageTheme, createApp } from '@backstage/core';
import React, { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
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

const app = createApp();
app.registerPlugin(...Object.values(plugins));
const AppComponent = app.build();

const App: FC<{}> = () => {
  useStyles();
  return (
    <CssBaseline>
      <ThemeProvider theme={BackstageTheme}>
        <Router>
          <AppComponent />
        </Router>
      </ThemeProvider>
    </CssBaseline>
  );
};

export default App;
