import React, { FC, Fragment } from 'react';
import helloWorld, { MyComponent } from '@backstage/plugin-hello-world';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SideBar from './components/SideBar';
import PageHeader from './components/PageHeader';
import { LoginComponent } from '@backstage/plugin-login';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink
} from "react-router-dom";

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
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  avatarButton: {
    padding: theme.spacing(2),
  },
}));

const App: FC<{}> = () => {
  return (
  <Router>
    <Switch>
      <Route exact path="/">
        <AppShell>
          <Home />
        </AppShell>
      </Route>
      <Route path="/login">
      <AppShell>
          <Login />
        </AppShell>
      </Route>
    </Switch>
    </Router>);
};

const Home: FC<{}> = () => {
  return (
    <Fragment>
      <Typography variant="body1">
        {' '}
        …with plugin {helloWorld?.id ?? 'wat'}:
      </Typography>
      <MyComponent />
      <div>
        <RouterLink to="/login">Go to Login</RouterLink>
      </div>
    </Fragment>
  );
};

const Login: FC<{}> = () => {
  return (
    <Fragment>
      <LoginComponent />
      <div>
        <RouterLink to="/">Go to Home</RouterLink>
      </div>
    </Fragment>
    );
}

const AppShell: FC<{}> = ({children}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SideBar />
      <div className={classes.mainContentArea}>
        <PageHeader />
        <div className={classes.pageBody}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default App;
