import { Link, makeStyles, Typography } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import {
  Sidebar,
  SidebarPage,
  sidebarConfig,
  SidebarContext,
  SidebarItem,
  SidebarSpacer,
  SidebarDivider,
  SidebarSpace,
} from '@spotify-backstage/core';
import React, { FC, useContext } from 'react';

const useSidebarLogoStyles = makeStyles({
  root: {
    height: sidebarConfig.drawerWidthClosed,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
  },
  logoContainer: {
    width: sidebarConfig.drawerWidthClosed,
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
  const isOpen = useContext(SidebarContext);

  return (
    <div className={classes.root}>
      <Link href="/" underline="none">
        <Typography variant="h6" color="inherit" className={classes.title}>
          {isOpen ? 'Backstage' : 'B'}
          <span className={classes.titleDot}>.</span>
        </Typography>
      </Link>
    </div>
  );
};

const Root: FC<{}> = ({ children }) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />
      <SidebarSpacer />
      <SidebarDivider />
      <SidebarItem icon={HomeIcon} to="/" text="Home" />
      <SidebarDivider />
      <SidebarSpace />
    </Sidebar>
    {children}
  </SidebarPage>
);

export default Root;
