import React, { FC, useContext } from 'react';
import HomeIcon from '@material-ui/icons/Home';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import BuildIcon from '@material-ui/icons/BuildRounded';
import RuleIcon from '@material-ui/icons/AssignmentTurnedIn';
import MapIcon from '@material-ui/icons/MyLocation';
import { Link, makeStyles } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';

import {
  Sidebar,
  SidebarItem,
  SidebarDivider,
  sidebarConfig,
  SidebarContext,
  SidebarSpace,
  SidebarUserSettings,
  DefaultProviderSettings,
} from '@backstage/core';

export const AppSidebar = () => (
  <Sidebar>
    <SidebarLogo />
    <SidebarDivider />
    {/* Global nav, not org-specific */}
    <SidebarItem icon={HomeIcon} to="./" text="Home" />
    <SidebarItem icon={LibraryBooks} to="/docs" text="Docs" />
    <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
    <SidebarDivider />
    <SidebarItem icon={MapIcon} to="tech-radar" text="Tech Radar" />
    <SidebarItem icon={RuleIcon} to="lighthouse" text="Lighthouse" />
    <SidebarItem icon={BuildIcon} to="circleci" text="CircleCI" />
    {/* End global nav */}
    <SidebarDivider />
    <SidebarSpace />
    <SidebarDivider />
    <SidebarUserSettings providerSettings={<DefaultProviderSettings />} />
  </Sidebar>
);

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

const SidebarLogo: FC<{}> = () => {
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
