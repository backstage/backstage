import { CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core';
import { BackstageTheme, createApp } from '@spotify-backstage/core';
import React, { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Root from './components/Root';
import entities from './entities';
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
app.registerEntityKind(...entities);
app.registerPlugin(...Object.values(plugins));
const AppComponent = app.build();

const App: FC<{}> = () => {
  useStyles();
  return (
    <CssBaseline>
      <ThemeProvider theme={BackstageTheme}>
        <Router>
          <Root>
            <AppComponent />
          </Root>
        </Router>
      </ThemeProvider>
    </CssBaseline>
  );
};

export default App;
