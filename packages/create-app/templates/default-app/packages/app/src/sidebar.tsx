import React, { useContext } from 'react';
import HomeIcon from '@material-ui/icons/Home';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import ExtensionIcon from '@material-ui/icons/Extension';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import MapIcon from '@material-ui/icons/MyLocation';
import { Link, makeStyles } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import { Settings as SidebarSettings } from '@backstage/plugin-user-settings';

import {
  Sidebar,
  SidebarItem,
  SidebarDivider,
  sidebarConfig,
  SidebarContext,
  SidebarSpace,
} from '@backstage/core';
import { SidebarSearch } from '@backstage/plugin-search';


const useSidebarLogoStyles = makeStyles({
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 24,
  },
});

const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useContext(SidebarContext);

  return (
    <div className={classes.root}>
      <Link
        component={NavLink}
        to="/"
        underline="none"
        className={classes.link}
      >
        {isOpen ? <LogoFull /> : <LogoIcon />}
      </Link>
    </div>
  );
};

export const AppSidebar = () => (
  <Sidebar>
    <SidebarLogo />
    <SidebarSearch />
    <SidebarDivider />
    {/* Global nav, not org-specific */}
    <SidebarItem icon={HomeIcon} to="./" text="Home" />
    <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
    <SidebarItem icon={LibraryBooks} to="/docs" text="Docs" />
    <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
    <SidebarDivider />
    <SidebarItem icon={MapIcon} to="tech-radar" text="Tech Radar" />
    {/* End global nav */}
    <SidebarDivider />
    <SidebarSpace />
    <SidebarDivider />
    <SidebarSettings />
  </Sidebar>
);
