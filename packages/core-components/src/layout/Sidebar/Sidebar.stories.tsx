/*
 * Copyright 2020 The Backstage Authors
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

// We don't want to export RoutingProvider from core-app-api, but it's way easier to
// use here. This hack only works in storybook stories.
// TODO: Export a nicer to user routing provider, perhaps from test-utils
// eslint-disable-next-line monorepo/no-internal-import
import { RoutingProvider } from '@backstage/core-app-api/src/routing/RoutingProvider';
import { createRouteRef } from '@backstage/core-plugin-api';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ExtensionIcon from '@material-ui/icons/Extension';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import MenuIcon from '@material-ui/icons/Menu';
import React, { ComponentType } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarDivider,
  SidebarGroup,
  SidebarIntro,
  SidebarItem,
  SidebarSearchField,
  SidebarSpace,
} from '.';
import { SidebarPage } from './Page';

const routeRef = createRouteRef({
  id: 'storybook.test-route',
});

const Location = () => {
  const location = useLocation();
  return <pre>Current location: {location.pathname}</pre>;
};

export default {
  title: 'Layout/Sidebar',
  component: Sidebar,
  decorators: [
    (Story: ComponentType<{}>) => (
      <MemoryRouter>
        <RoutingProvider
          routeBindings={new Map()}
          routeObjects={[]}
          routeParents={new Map()}
          routePaths={new Map([[routeRef, '/']])}
        >
          <Story />
        </RoutingProvider>
      </MemoryRouter>
    ),
  ],
};

export const SampleSidebar = () => (
  <SidebarPage>
    <Sidebar>
      <SidebarGroup label="Menu" icon={MenuIcon}>
        <SidebarSearchField onSearch={() => {}} />
        <SidebarDivider />
        <SidebarItem icon={HomeOutlinedIcon} to="/" text="Home" />
        <SidebarItem icon={ExtensionIcon} to="/one" text="Plugins" />
        <SidebarItem icon={AddCircleOutlineIcon} to="/two" text="Create..." />
        <SidebarDivider />
        <SidebarIntro />
        <SidebarSpace />
      </SidebarGroup>
    </Sidebar>
    <Location />
  </SidebarPage>
);
