import { BackstageTheme, createApp, InfoCard } from '@backstage/core';
import HomePagePlugin from '@backstage/plugin-home-page';
//import PageHeader from './components/PageHeader';
import { LoginComponent } from '@backstage/plugin-login';
import { CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core';
import React, { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import SideBar from './components/SideBar';
import entities from './entities';
import { LoginBarrier } from './login/LoginBarrier';
import { MockCurrentUser } from './login/MockCurrentUser';

const useStyles = makeStyles(theme => ({
  '@global': {
    html: {
      height: '100%',
      fontFamily: theme.typography.fontFamily,
    },
    body: {
      height: '100%',
      fontFamily: theme.typography.fontFamily,
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
    width: '100vw',
    height: '100vh',
  },
}));

const currentUser = new MockCurrentUser();

const Login: FC<{}> = () => {
  return (
    <InfoCard title="Login Page">
      <LoginComponent onLogin={username => currentUser.login(username)} />
    </InfoCard>
  );
};

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
app.registerPlugin(HomePagePlugin);

const AppComponent = app.build();

const App: FC<{}> = () => {
  return (
    <CssBaseline>
      <ThemeProvider theme={BackstageTheme}>
        <Router>
          <LoginBarrier fallback={Login} state$={currentUser.state}>
            <AppShell>
              <AppComponent />
            </AppShell>
          </LoginBarrier>
        </Router>
      </ThemeProvider>
    </CssBaseline>
  );
};

export default App;
