import { makeStyles } from '@material-ui/core';
import React, { FC } from 'react';
import { sidebarConfig } from './config';

const useStyles = makeStyles({
  root: {
    width: '100%',
    minHeight: '100%',
    paddingLeft: sidebarConfig.drawerWidthClosed,
  },
});

export const SidebarPage: FC<{}> = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.root}>{children}</div>;
};
