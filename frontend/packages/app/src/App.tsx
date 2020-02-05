import {
  BackstageTheme,
  createApp,
  EntityLink,
  Header,
  InfoCard,
  Page,
  theme,
  withGlobalStyles,
} from '@backstage/core';
import helloWorld, { MyComponent } from '@backstage/plugin-hello-world';
//import PageHeader from './components/PageHeader';
import { LoginComponent } from '@backstage/plugin-login';
import { CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
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
        <EntityLink kind="service" id="backstage-backend">
          Backstage Backend
        </EntityLink>
        <EntityLink uri="entity:service:backstage-lb" subPath="ci-cd">
          Backstage LB CI/CD
        </EntityLink>
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

const app = createApp();

app.registerEntityKind(...entities);
app.setHomePage(Home);
const AppComponent = app.build();

const App: FC<{}> = () => {
  return (
    <CssBaseline>
      <ThemeProvider theme={BackstageTheme}>
        <AppContent>
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
        </AppContent>
      </ThemeProvider>
    </CssBaseline>
  );
};

export default App;
