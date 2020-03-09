import {
  Link,
  makeStyles,
  styled,
  SvgIcon,
  Theme,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import React, { FC, useContext } from 'react';
import { sidebarConfig, SidebarContext } from './config';

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    color: '#b5b5b5',
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    height: 40,
    cursor: 'pointer',
  },
  closed: {
    width: sidebarConfig.drawerWidthClosed,
    justifyContent: 'center',
  },
  open: {
    width: sidebarConfig.drawerWidthOpen,
  },
  label: {
    fontWeight: 'bolder',
    whiteSpace: 'nowrap',
    lineHeight: 1.0,
    marginLeft: theme.spacing(1),
  },
  iconContainer: {
    height: '100%',
    width: sidebarConfig.drawerWidthClosed,
    marginRight: -theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

type SidebarItemProps = {
  icon: typeof SvgIcon;
  text: string;
  to?: string;
  onClick?: () => void;
};

export const SidebarItem: FC<SidebarItemProps> = ({
  icon: Icon,
  text,
  to,
  onClick,
}) => {
  const classes = useStyles();
  const isOpen = useContext(SidebarContext);

  if (!isOpen) {
    return (
      <Link
        className={clsx(classes.root, classes.closed)}
        href={to}
        onClick={onClick}
        underline="none"
      >
        <Icon fontSize="small" />
      </Link>
    );
  }

  return (
    <Link
      className={clsx(classes.root, classes.open)}
      href={to}
      onClick={onClick}
      underline="none"
    >
      <div className={classes.iconContainer}>
        <Icon fontSize="small" />
      </div>
      <Typography variant="subtitle1" className={classes.label}>
        {text}
      </Typography>
    </Link>
  );
};

export const SidebarSpace = styled('div')({
  flex: 1,
});

export const SidebarSpacer = styled('div')({
  height: 8,
});

export const SidebarDivider = styled('hr')({
  height: 1,
  width: '100%',
  background: '#383838',
  border: 'none',
});
