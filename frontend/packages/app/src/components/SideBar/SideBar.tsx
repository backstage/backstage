import React, { FC, useState, createContext, useContext } from 'react';
import clsx from 'clsx';
import {
  makeStyles,
  SvgIcon,
  Typography,
  Link,
  styled,
} from '@material-ui/core';

import HomeIcon from '@material-ui/icons/Home';
import ServiceIcon from '@material-ui/icons/DeviceHub';
import WebIcon from '@material-ui/icons/Language';
import LibIcon from '@material-ui/icons/LocalLibrary';
import CreateIcon from '@material-ui/icons/AddCircleOutline';

const drawerWidthClosed = 64;
const drawerWidthOpen = 220;

const Context = createContext<boolean>(false);

const useSidebarItemStyles = makeStyles({
  root: {
    color: '#b5b5b5',
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    height: 40,
    cursor: 'pointer',
  },
  closed: {
    width: drawerWidthClosed,
    justifyContent: 'center',
  },
  open: {
    width: drawerWidthOpen,
  },
  iconContainer: {
    height: '100%',
    width: drawerWidthClosed,
    marginRight: -16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

type SidebarItemProps = {
  icon: typeof SvgIcon;
  text: string;
  to?: string;
  onClick?: () => void;
};

const SidebarItem: FC<SidebarItemProps> = ({
  icon: Icon,
  text,
  to,
  onClick,
}) => {
  const classes = useSidebarItemStyles();
  const open = useContext(Context);

  if (!open) {
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
      <Typography variant="subtitle2">{text}</Typography>
    </Link>
  );
};

const useSidebarLogoStyles = makeStyles({
  root: {
    height: drawerWidthClosed,
    color: '#fff',
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
  },
  logoContainer: {
    width: drawerWidthClosed,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 22,
    whiteSpace: 'nowrap',
  },
  titleDot: {
    color: '#1DB954',
  },
});

const SidebarLogo: FC<{}> = () => {
  const classes = useSidebarLogoStyles();
  const open = useContext(Context);

  return (
    <div className={classes.root}>
      <Typography variant="h6" color="inherit" className={classes.title}>
        {open ? 'Backstage' : 'B'}
        <span className={classes.titleDot}>.</span>
      </Typography>
    </div>
  );
};

const Space = styled('div')({
  flex: 1,
});

const Spacer = styled('div')({
  height: 8,
});

const Divider = styled('hr')({
  height: 1,
  width: '100%',
  background: '#383838',
  border: 'none',
});

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: 1000,
    position: 'relative',
    overflow: 'visible',
    width: theme.spacing(7) + 1,
    height: '100vh',
  },
  drawer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'flex-start',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    padding: 0,
    background: '#171717',
    overflowX: 'hidden',
    width: drawerWidthClosed,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shortest,
    }),
  },
  drawerOpen: {
    width: drawerWidthOpen,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

const SideBar: FC<{}> = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div
      className={classes.root}
      onMouseEnter={handleOpen}
      onFocus={handleOpen}
      onMouseLeave={handleClose}
      onBlur={handleClose}
      data-testid="sidebar-root"
    >
      <Context.Provider value={open}>
        <div className={clsx(classes.drawer, { [classes.drawerOpen]: open })}>
          <SidebarLogo />
          <Spacer />
          <Divider />
          <SidebarItem icon={HomeIcon} to="/" text="Home" />
          <Divider />
          <SidebarItem icon={ServiceIcon} to="/services" text="Services" />
          <SidebarItem icon={WebIcon} to="/websites" text="Websites" />
          <SidebarItem icon={LibIcon} to="/libraries" text="Libraries" />
          <Divider />
          <Space />
          <SidebarItem icon={CreateIcon} to="/create" text="Create..." />
        </div>
      </Context.Provider>
    </div>
  );
};

export default SideBar;
