import React, { FC } from 'react';
import { Theme, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    gridArea: 'pageContent',
    minWidth: 0,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    ...theme.mixins.gutters({}),
  },
}));

const Content: FC<{}> = ({ children, ...props }) => {
  const classes = useStyles();
  return (
    <article {...props} className={classes.root}>
      {children}
    </article>
  );
};

export default Content;
