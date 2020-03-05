import { BackstageTheme, createApp } from '@spotify-backstage/core';
import { CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core';
import React, { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import * as plugins from './plugins';
import SideBar from './components/SideBar';
import entities from './entities';

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
  root: {
    display: 'grid',
    // FIXME: Don't used a fixed width here
    gridTemplateColumns: '64px auto',
    gridTemplateRows: '1fr',
    width: '100%',
    height: '100vh',
  },
}));

const AppShell: FC<{}> = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SideBar />
      {children}
    </div>
  );
};

const app = createApp();

app.registerEntityKind(...entities);
app.registerPlugin(...Object.values(plugins));

const AppComponent = app.build();

const App: FC<{}> = () => {
  return (
    <CssBaseline>
      <ThemeProvider theme={BackstageTheme}>
        <Router>
          <AppShell>
            <AppComponent />
          </AppShell>
        </Router>
      </ThemeProvider>
    </CssBaseline>
  );
};

export default App;
