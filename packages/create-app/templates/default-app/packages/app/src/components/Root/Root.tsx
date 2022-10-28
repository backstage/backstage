import React, { PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import ExtensionIcon from '@material-ui/icons/Extension';
import MapIcon from '@material-ui/icons/MyLocation';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import {
  Settings as SidebarSettings,
  UserSettingsSignInAvatar,
} from '@backstage/plugin-user-settings';
import { SidebarSearchModal } from '@backstage/plugin-search';
import {
  Sidebar,
  sidebarConfig,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarPage,
  SidebarScrollWrapper,
  SidebarSpace,
  useSidebarOpenState,
  Link,
  GroupIcon,
  SidebarSubmenu,
  SidebarSubmenuItem,
} from '@backstage/core-components';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import ApiIcon from '@material-ui/icons/Extension';
import ComponentIcon from '@material-ui/icons/Memory';
import DomainIcon from '@material-ui/icons/Apartment';
import ResourceIcon from '@material-ui/icons/Work';
import SystemIcon from '@material-ui/icons/Category';
import UserIcon from '@material-ui/icons/Person';

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
  const { isOpen } = useSidebarOpenState();

  return (
    <div className={classes.root}>
      <Link to="/" underline="none" className={classes.link} aria-label="Home">
        {isOpen ? <LogoFull /> : <LogoIcon />}
      </Link>
    </div>
  );
};

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />
      <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
        <SidebarSearchModal />
      </SidebarGroup>
      <SidebarDivider />
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        {/* Global nav, not org-specific */}
        <SidebarItem icon={HomeIcon} to="catalog" text="Home">
          <SidebarSubmenu title="Catalog">
            <SidebarSubmenuItem
              title="Domains"
              to="catalog?filters%5Bkind%5D=domain"
              icon={DomainIcon}
            />
            <SidebarSubmenuItem
              title="Systems"
              to="catalog?filters%5Bkind%5D=system"
              icon={SystemIcon}
            />
            <SidebarSubmenuItem
              title="Components"
              to="catalog?filters%5Bkind%5D=component"
              icon={ComponentIcon}
            />
            <SidebarSubmenuItem
              title="APIs"
              to="catalog?filters%5Bkind%5D=api"
              icon={ApiIcon}
            />
            <SidebarDivider />
            <SidebarSubmenuItem
              title="Resources"
              to="catalog?filters%5Bkind%5D=resource"
              icon={ResourceIcon}
            />
            <SidebarDivider />
            <SidebarSubmenuItem
              title="Templates"
              to="catalog?filters%5Bkind%5D=template"
              icon={CreateComponentIcon}
            />
            <SidebarDivider />
            <SidebarSubmenuItem
              title="Groups"
              to="catalog?filters%5Bkind%5D=group"
              icon={GroupIcon}
            />
            <SidebarSubmenuItem
              title="Users"
              to="catalog?filters%5Bkind%5D=user"
              icon={UserIcon}
            />
          </SidebarSubmenu>
        </SidebarItem>
        <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
        <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
        <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
        {/* End global nav */}
        <SidebarDivider />
        <SidebarScrollWrapper>
          <SidebarItem icon={MapIcon} to="tech-radar" text="Tech Radar" />
        </SidebarScrollWrapper>
      </SidebarGroup>
      <SidebarSpace />
      <SidebarDivider />
      <SidebarGroup
        label="Settings"
        icon={<UserSettingsSignInAvatar />}
        to="/settings"
      >
        <SidebarSettings />
      </SidebarGroup>
    </Sidebar>
    {children}
  </SidebarPage>
);
