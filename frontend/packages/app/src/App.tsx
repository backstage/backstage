import React, { FC } from 'react';
import helloWorld, { MyComponent } from '@backstage/plugin-hello-world';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

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
  sideBar: {
    background: '#181818',
    color: 'white',
    height: '100vh',
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  pageHeader: {
    // FIXME: Make part of PageHeader component
    background: 'linear-gradient(262.63deg, #19D15A 4.2%, #1CAB5B 72.01%)',
    height: '120px',
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    color: 'white',
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
      {/* TODO: SideBar component */}
      {/* Based on NewSideBar from Backstage */}
      <div className={classes.sideBar}>
        <Link href="#" variant="body1">
          [Co-brand Logo]
        </Link>
        <List component="nav">
          <ListItem button>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Services" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Libraries" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Websites" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="+ Create..." />
          </ListItem>
        </List>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            <Avatar>A</Avatar>
          </Grid>
          <Typography variant="caption">$userName</Typography>
        </Grid>
      </div>
      <div className={classes.mainContentArea}>
        {/* TODO: PageHeader component */}
        <header className={classes.pageHeader}>
          <Typography variant="h2">This is Backstage!</Typography>
          <Typography variant="caption">
            Backstage is an open platform for building developer portals
          </Typography>
        </header>
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
