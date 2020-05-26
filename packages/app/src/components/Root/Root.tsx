/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { FC, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link, makeStyles } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import ExploreIcon from '@material-ui/icons/Explore';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import {
  Sidebar,
  SidebarPage,
  sidebarConfig,
  SidebarContext,
  SidebarItem,
  SidebarDivider,
  SidebarSearchField,
  SidebarSpace,
  SidebarUserBadge,
  SidebarThemeToggle,
} from '@backstage/core';

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
      <Link href="/" underline="none" className={classes.link}>
        {isOpen ? <LogoFull /> : <LogoIcon />}
      </Link>
    </div>
  );
};

const handleSearch = (query: string): void => {
  // XXX (@koroeskohr): for testing purposes
  // eslint-disable-next-line no-console
  console.log(query);
};

const Root: FC<{}> = ({ children }) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />
      <SidebarSearchField onSearch={handleSearch} />
      <SidebarDivider />
      {/* Global nav, not org-specific */}
      <SidebarItem icon={HomeIcon} to="/" text="Home" />
      <SidebarItem icon={ExploreIcon} to="/explore" text="Explore" />
      <SidebarItem icon={CreateComponentIcon} to="/create" text="Create..." />
      {/* End global nav */}
      <SidebarDivider />
      <SidebarItem icon={AccountTreeIcon} to="/catalog" text="Catalog" />
      <SidebarDivider />
      <SidebarSpace />
      <SidebarDivider />
      <SidebarThemeToggle />
      <SidebarUserBadge />
    </Sidebar>
    {children}
  </SidebarPage>
);

Root.propTypes = {
  children: PropTypes.node,
};

export default Root;
