import React, { FC } from 'react';
import helloWorld, { MyComponent } from '@backstage/plugin-hello-world';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SideBar from './components/SideBar';
import PageHeader from './components/PageHeader';

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
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SideBar />
      <div className={classes.mainContentArea}>
        <PageHeader />
        <div className={classes.pageBody}>
          <Typography variant="body1">
            {' '}
            …with plugin {helloWorld?.id ?? 'wat'}:
          </Typography>
          <MyComponent />
        </div>
      </div>
    </div>
  );
};

export default App;
