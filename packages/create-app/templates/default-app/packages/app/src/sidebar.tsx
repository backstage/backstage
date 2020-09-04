import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import ExploreIcon from '@material-ui/icons/Explore';
import BuildIcon from '@material-ui/icons/BuildRounded';
import RuleIcon from '@material-ui/icons/AssignmentTurnedIn';
import MapIcon from '@material-ui/icons/MyLocation';

import {
  Sidebar,
  SidebarItem,
  SidebarDivider,
  SidebarSpace,
  SidebarUserSettings,
  SidebarThemeToggle,
  SidebarPinButton,
  DefaultProviderSettings,
} from '@backstage/core';

export const AppSidebar = () => (
  <Sidebar>
    <SidebarDivider />
    {/* Global nav, not org-specific */}
    <SidebarItem icon={HomeIcon} to="./" text="Home" />
    <SidebarItem icon={ExploreIcon} to="explore" text="Explore" />
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
    <SidebarThemeToggle />
    <SidebarUserSettings providerSettings={<DefaultProviderSettings />} />
    <SidebarPinButton />
  </Sidebar>
);
