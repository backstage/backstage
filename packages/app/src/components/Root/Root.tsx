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

import React, { FC, useContext, ReactNode } from 'react';
import { Link, makeStyles, Typography } from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';
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
    color: '#68c5b5',
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

type SidebarItem = {
  icon: typeof SvgIcon;
  route: string;
  label: string;
};
type SidebarProps = {
  sidebarItems: SidebarItem[];
  children: ReactNode;
};

const Root: FC<SidebarProps> = ({ sidebarItems, children }: SidebarProps) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />
      <SidebarSpacer />
      <SidebarDivider />
      {sidebarItems.map(d => (
        <SidebarItem icon={d.icon} to={d.route} text={d.label} />
      ))}
      <SidebarDivider />
      <SidebarSpace />
    </Sidebar>
    {children}
  </SidebarPage>
);

export default Root;
