import React, { FC, useRef, useState, createContext, useContext } from 'react';
import clsx from 'clsx';
import {
  makeStyles,
  SvgIcon,
  Typography,
  Theme,
  Link,
  styled,
} from '@material-ui/core';

import HomeIcon from '@material-ui/icons/Home';

const drawerWidthClosed = 64;
const drawerWidthOpen = 220;

const defaultOpenDelayMs = 400;
const defaultCloseDelayMs = 200;

const Context = createContext<boolean>(false);

const useSidebarItemStyles = makeStyles<Theme>(theme => ({
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
  label: {
    fontWeight: 'bolder',
    whiteSpace: 'nowrap',
    lineHeight: 1.0,
    marginLeft: theme.spacing(1),
  },
  iconContainer: {
    height: '100%',
    width: drawerWidthClosed,
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
      <Typography variant="subtitle1" className={classes.label}>
        {text}
      </Typography>
    </Link>
  );
};

const useSidebarLogoStyles = makeStyles({
  root: {
    height: drawerWidthClosed,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 22,
    whiteSpace: 'nowrap',
    color: '#fff',
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
      <Link href="/" underline="none">
        <Typography variant="h6" color="inherit" className={classes.title}>
          {open ? 'Backstage' : 'B'}
          <span className={classes.titleDot}>.</span>
        </Typography>
      </Link>
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
  },
  drawer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'flex-start',
    position: 'fixed',
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
  drawerPeek: {
    width: drawerWidthClosed + 4,
  },
}));

enum State {
  Closed,
  Peek,
  Open,
}

type Props = {
  openDelayMs?: number;
  closeDelayMs?: number;
};

const SideBar: FC<Props> = ({
  openDelayMs = defaultOpenDelayMs,
  closeDelayMs = defaultCloseDelayMs,
}) => {
  const classes = useStyles();
  const [state, setState] = useState(State.Closed);
  const hoverTimerRef = useRef<NodeJS.Timer>();

  const handleOpen = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = undefined;
    }
    if (state !== State.Open) {
      hoverTimerRef.current = setTimeout(() => {
        hoverTimerRef.current = undefined;
        setState(State.Open);
      }, openDelayMs);

      setState(State.Peek);
    }
  };

  const handleClose = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = undefined;
    }
    if (state === State.Peek) {
      setState(State.Closed);
    } else if (state === State.Open) {
      hoverTimerRef.current = setTimeout(() => {
        hoverTimerRef.current = undefined;
        setState(State.Closed);
      }, closeDelayMs);
    }
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
      <Context.Provider value={state === State.Open}>
        <div
          className={clsx(classes.drawer, {
            [classes.drawerPeek]: state === State.Peek,
            [classes.drawerOpen]: state === State.Open,
          })}
        >
          <SidebarLogo />
          <Spacer />
          <Divider />
          <SidebarItem icon={HomeIcon} to="/" text="Home" />
          <Divider />
          <Space />
        </div>
      </Context.Provider>
    </div>
  );
};

export default SideBar;
