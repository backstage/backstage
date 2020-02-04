import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { FC } from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    background: '#181818',
    color: 'white',
    height: '100vh',
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
}));

const SideBar: FC<{}> = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
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
  );
};

export default SideBar;
