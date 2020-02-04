import React, { FC } from 'react';
import {
  createMuiTheme,
  makeStyles,
  MuiThemeProvider,
  MenuList,
  MenuItem,
  ListItemText,
  ListSubheader,
  ListItemIcon,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import { Link } from 'shared/components';

const themes = {
  large: createMuiTheme({
    overrides: {
      MuiList: { root: { outline: 'none' } },
      MuiMenuItem: { root: { lineHeight: 1 } },
      MuiListItemIcon: { root: { minWidth: 36 } },
      MuiListItemText: { primary: { fontWeight: 600 } },
      MuiListSubheader: { root: { lineHeight: 'unset', textTransform: 'uppercase', fontWeight: 'unset' } },
      MuiListItemSecondaryAction: { root: { pointerEvents: 'none' } },
    },
  }),
  medium: createMuiTheme({
    overrides: {
      MuiList: { root: { outline: 'none' } },
      MuiMenuItem: { root: { lineHeight: 1 }, dense: { paddingTop: 0, paddingBottom: 0 } },
      MuiListItemIcon: { root: { minWidth: 36 } },
      MuiListItemText: { primary: { fontWeight: 600 } },
      MuiListSubheader: { root: { lineHeight: 'unset', textTransform: 'uppercase', fontWeight: 'unset' } },
      MuiListItemSecondaryAction: { root: { pointerEvents: 'none' } },
    },
  }),
  small: createMuiTheme({
    overrides: {
      MuiList: { root: { outline: 'none' } },
      MuiMenuItem: { root: { lineHeight: 1 }, dense: { paddingTop: 0, paddingBottom: 0 } },
      MuiListItemIcon: { root: { minWidth: 36 } },
      MuiListItemText: { primary: {} },
      MuiListSubheader: { root: { lineHeight: 'unset', textTransform: 'uppercase', fontWeight: 'unset' } },
      MuiListItemSecondaryAction: { root: { pointerEvents: 'none' } },
    },
  }),
};

const useStyles = makeStyles(() => ({
  active: {
    '&::before': {
      content: "''",
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      backgroundColor: 'green',
    },
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
}));

// Hook that decides if the current page location matches the given link
function useLocationMatch(linkTo?: string) {
  const { pathname } = useLocation();

  if (!linkTo) {
    return false;
  } else if (linkTo === '/') {
    return pathname === '' || pathname === '/';
  }

  const l = linkTo.replace(/\/*$/, '');

  return pathname === l || pathname.startsWith(`${l}/`);
}

export type SidebarListProps = {
  variant: 'large' | 'medium' | 'small';
  subheader?: string;
};

export type SidebarListItemProps = {
  linkTo?: string;
  onClick?: () => any;
  icon?: React.ReactElement;
  secondary?: React.ReactElement;
  children: string;
};

export const SidebarList: FC<SidebarListProps> = ({ variant, subheader, children }) => {
  return (
    <MuiThemeProvider theme={themes[variant]}>
      <MenuList dense subheader={subheader ? <ListSubheader>{subheader}</ListSubheader> : undefined}>
        {children}
      </MenuList>
    </MuiThemeProvider>
  );
};

export const SidebarListItem: FC<SidebarListItemProps> = ({ linkTo, onClick, icon, secondary, children }) => {
  const classes = useStyles();
  const isActive = useLocationMatch(linkTo);
  return (
    <Link to={linkTo} onClick={() => onClick && onClick()}>
      <MenuItem classes={{ root: isActive ? classes.active : undefined }}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={children} />
        {secondary ? <ListItemSecondaryAction>{secondary}</ListItemSecondaryAction> : null}
      </MenuItem>
    </Link>
  );
};
