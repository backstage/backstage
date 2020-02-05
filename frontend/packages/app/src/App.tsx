import {
  BackstageTheme,
  createApp,
  Header,
  InfoCard,
  Page,
  theme,
} from '@backstage/core';
//import PageHeader from './components/PageHeader';
import { LoginComponent } from '@backstage/plugin-login';
import HomePagePlugin from '@backstage/plugin-home-page';
import { CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core';
import React, { FC } from 'react';
import {
  BrowserRouter as Router,
  Link as RouterLink,
  Route,
  Switch,
} from 'react-router-dom';
import HomePageTimer from './components/HomepageTimer';
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
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
    },
  },
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

const app = createApp();

app.registerEntityKind(...entities);
app.registerPlugin(HomePagePlugin);

const AppComponent = app.build();

const App: FC<{}> = () => {
  return (
    <CssBaseline>
      <ThemeProvider theme={BackstageTheme}>
        <AppShell>
          <Router>
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route>
                <AppComponent />
              </Route>
            </Switch>
          </Router>
        </AppShell>
      </ThemeProvider>
    </CssBaseline>
  );
};

export default App;
