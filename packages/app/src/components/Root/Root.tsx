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
import { Link, makeStyles, Typography } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import ExploreIcon from '@material-ui/icons/Explore';
import AccountCircle from '@material-ui/icons/AccountCircle';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import {
  Sidebar,
  SidebarPage,
  sidebarConfig,
  SidebarContext,
  SidebarItem,
  SidebarSpacer,
  SidebarDivider,
  SidebarSpace,
} from '@backstage/core';
import ToggleThemeSidebarItem from './ToggleThemeSidebarItem';

const icon = require('./icon.svg') as string;
const logo = require('./logo.svg') as string;

const useSidebarLogoStyles = makeStyles({
  root: {
    height: sidebarConfig.drawerWidthClosed,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
  },
  icon: {
    width: 'auto',
    height: 28,
  },
  logo: {
    width: 'auto',
    height: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 22,
    whiteSpace: 'nowrap',
    color: '#fff',
  },
});

const SidebarLogo: FC<{}> = () => {
  const classes = useSidebarLogoStyles();
  const isOpen = useContext(SidebarContext);
  return (
    <div className={classes.root}>
      <Link href="/" underline="none">
        <Typography variant="h6" color="inherit" className={classes.title}>
          {isOpen ? (
            <img src={logo} alt="logo" className={classes.logo} />
          ) : (
            <img src={icon} alt="logo" className={classes.icon} />
          )}
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
      <SidebarItem icon={ExploreIcon} to="/explore" text="Explore" />
      <SidebarItem icon={CreateComponentIcon} to="/create" text="Create..." />
      <SidebarDivider />
      <SidebarItem icon={AccountTreeIcon} to="/inventory" text="Inventory" />
      <SidebarItem icon={AccountCircle} to="/login" text="Login" />
      <SidebarDivider />
      <SidebarSpace />
      <ToggleThemeSidebarItem />
    </Sidebar>
    {children}
  </SidebarPage>
);

Root.propTypes = {
  children: PropTypes.node,
};

export default Root;
