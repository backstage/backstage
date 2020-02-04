import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { FC } from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    background: 'linear-gradient(262.63deg, #19D15A 4.2%, #1CAB5B 72.01%)',
    height: '120px',
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    color: 'white',
  },
}));

const SideBar: FC<{}> = () => {
  const classes = useStyles();

  return (
    <header className={classes.root}>
      <Typography variant="h2">This is Backstage!</Typography>
      <Typography variant="caption">
        Backstage is an open platform for building developer portals
      </Typography>
    </header>
  );
};

export default SideBar;
