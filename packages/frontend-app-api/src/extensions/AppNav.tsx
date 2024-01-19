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
  createNavItemExtension,
  createNavLogoExtension,
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

const SidebarLogo = (
  props: (typeof createNavLogoExtension.logoElementsDataRef)['T'],
) => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useSidebarOpenState();

  return (
    <div className={classes.root}>
      <Link to="/" underline="none" className={classes.link} aria-label="Home">
        {isOpen
          ? props?.logoFull ?? <LogoFull />
          : props?.logoIcon ?? <LogoIcon />}
      </Link>
    </div>
  );
};

const SidebarNavItem = (
  props: (typeof createNavItemExtension.targetDataRef)['T'],
) => {
  const { icon: Icon, title, routeRef } = props;
  const to = useRouteRef(routeRef)();
  // TODO: Support opening modal, for example, the search one
  return <SidebarItem to={to} icon={Icon} text={title} />;
};

export const AppNav = createExtension({
  namespace: 'app',
  name: 'nav',
  attachTo: { id: 'app/layout', input: 'nav' },
  inputs: {
    items: createExtensionInput({
      target: createNavItemExtension.targetDataRef,
    }),
    logos: createExtensionInput(
      {
        elements: createNavLogoExtension.logoElementsDataRef,
      },
      {
        singleton: true,
        optional: true,
      },
    ),
  },
  output: {
    element: coreExtensionData.reactElement,
  },
  factory({ inputs }) {
    return {
      element: (
        <Sidebar>
          <SidebarLogo {...inputs.logos?.output.elements} />
          <SidebarDivider />
          {inputs.items.map((item, index) => (
            <SidebarNavItem {...item.output.target} key={index} />
          ))}
        </Sidebar>
      ),
    };
  },
});
