import React, { FC } from 'react';
import { Divider as MuiDivider, Typography, IconButton, makeStyles } from '@material-ui/core';
import BackIcon from '@material-ui/icons/ChevronLeftOutlined';
import { useColumnStackControls } from 'shared/components/ColumnStack';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
  },
  header: {
    padding: theme.spacing(1, 2, 1, 2),
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  spacer: {
    flex: `0 0 ${theme.spacing(2)}px`,
  },
  flex: {
    flex: 1,
  },
  backButton: {
    margin: theme.spacing(0, 1, 0, -1),
  },
  secondaryText: {
    color: theme.palette.grey[500],
    fontSize: '85%',
    pointerEvents: 'none',
    userSelect: 'none',
  },
}));

export type ColumnProps = {
  width: number;
};

export const BackButton: FC<{}> = () => {
  const columnStack = useColumnStackControls();
  const classes = useStyles();
  return (
    <IconButton
      onClick={() => columnStack.pop()}
      size="small"
      className={classes.backButton}
      data-testid="sidebar-back-button"
    >
      <BackIcon />
    </IconButton>
  );
};

export const Column: FC<ColumnProps> = ({ width, children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root} style={{ width }}>
      {children}
    </div>
  );
};

export const Header: FC<{}> = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.header}>{children}</div>;
};

export const HeaderTitle: FC<{}> = ({ children }) => {
  const classes = useStyles();
  return (
    <Typography variant="h6" className={classes.headerTitle}>
      {children}
    </Typography>
  );
};

export const Spacer: FC<{}> = () => {
  const classes = useStyles();
  return <div className={classes.spacer} />;
};

export const Flex: FC<{}> = () => {
  const classes = useStyles();
  return <div className={classes.flex} />;
};

export const Divider: FC<{}> = () => <MuiDivider />;

export const SecondaryText: FC<{}> = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.secondaryText}>{children}</div>;
};
