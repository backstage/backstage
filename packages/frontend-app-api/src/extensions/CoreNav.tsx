/*
 * Copyright 2023 The Backstage Authors
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

import React from 'react';
import {
  createExtension,
  coreExtensionData,
  createExtensionInput,
  useRouteRef,
  NavTarget,
} from '@backstage/frontend-plugin-api';
import { makeStyles } from '@material-ui/core';
import {
  Sidebar,
  useSidebarOpenState,
  Link,
  sidebarConfig,
  SidebarDivider,
  SidebarItem,
} from '@backstage/core-components';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import LogoIcon from '../../../app/src/components/Root/LogoIcon';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import LogoFull from '../../../app/src/components/Root/LogoFull';

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

export const CoreNav = createExtension({
  id: 'core.nav',
  at: 'core.layout/nav',
  inputs: {
    items: createExtensionInput({
      target: coreExtensionData.navTarget,
    }),
  },
  output: {
    element: coreExtensionData.reactElement,
  },
  factory({ bind, inputs }) {
    const SidebarNavItem = (props: NavTarget) => {
      const { icon, title, routeRef } = props;
      const to = useRouteRef(routeRef)();
      return <SidebarItem icon={icon} to={to} text={title} />;
    };
    bind({
      element: (
        <Sidebar>
          <SidebarLogo />
          <SidebarDivider />
          {inputs.items.map((item, index) => (
            <SidebarNavItem {...item.target} key={index} />
          ))}
        </Sidebar>
      ),
    });
  },
});
