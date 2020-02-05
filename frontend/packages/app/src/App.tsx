import React, { FC } from 'react';
import helloWorld, { MyComponent } from '@backstage/plugin-hello-world';
import Typography from '@material-ui/core/Typography';
import SideBar from './components/SideBar';
//import PageHeader from './components/PageHeader';
import { Header, Page, InfoCard } from '@backstage/core';
import { LoginComponent } from '@backstage/plugin-login';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
} from 'react-router-dom';
import { BackstageTheme, withGlobalStyles, theme } from '@backstage/core';
import { CssBaseline, ThemeProvider, makeStyles } from '@material-ui/core';
import HomePageTimer from './components/HomepageTimer';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    // FIXME: Don't used a fixed width here
    gridTemplateColumns: '224px auto',
    gridTemplateRows: 'auto 1fr',
    width: '100%',
    height: '100vh',
  },
  mainContentArea: {
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  pageBody: {
    padding: theme.spacing(2),
  },
  avatarButton: {
    padding: theme.spacing(2),
  },
}));

const App: FC<{}> = () => {
  return (
    <CssBaseline>
      <ThemeProvider theme={BackstageTheme}>
        <AppContent>
          <Router>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
            </Switch>
          </Router>
        </AppContent>
      </ThemeProvider>
    </CssBaseline>
  );
};

const Home: FC<{}> = () => {
  return (
    <InfoCard title="Home Page">
      <Typography variant="body1">
        {' '}
        …with plugin {helloWorld?.id ?? 'wat'}:
      </Typography>
      <MyComponent />
      <div>
        <RouterLink to="/login">Go to Login</RouterLink>
      </div>
    </InfoCard>
  );
};

const Login: FC<{}> = () => {
  return (
    <InfoCard title="Login Page">
      <LoginComponent />
      <div>
        <RouterLink to="/">Go to Home</RouterLink>
      </div>
    </InfoCard>
  );
};

const AppShell: FC<{}> = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SideBar />
      <Page theme={theme.home}>
        <div className={classes.mainContentArea}>
          <Header title="This is Backstage!">
            <HomePageTimer />
          </Header>
          <div className={classes.pageBody}>{children}</div>
        </div>
      </Page>
    </div>
  );
};

const AppContent = withGlobalStyles(AppShell);

export default App;
