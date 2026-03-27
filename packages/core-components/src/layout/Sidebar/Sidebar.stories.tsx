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
import { createRouteRef, IconComponent } from '@backstage/core-plugin-api';
import { wrapInTestApp } from '@backstage/test-utils';
import {
  PlusCircle,
  Home,
  Menu,
  Wrench,
  BookOpen,
  Cloud,
  Snowflake,
  LayoutGrid,
} from 'lucide-react';
import { ComponentType, PropsWithChildren } from 'react';
import { SidebarPage } from './Page';
import { Sidebar } from './Bar';
import { SidebarGroup } from './SidebarGroup';
import {
  SidebarDivider,
  SidebarExpandButton,
  SidebarItem,
  SidebarSearchField,
  SidebarSpace,
} from './Items';
import { SidebarSubmenu } from './SidebarSubmenu';
import { SidebarSubmenuItem } from './SidebarSubmenuItem';

// Alias lucide-react icons to original MUI icon names with IconComponent type
// assertion for Backstage SidebarItem/SidebarSubmenuItem prop compatibility.
// Lucide icons are functionally equivalent SVG components but have a wider prop
// interface than Backstage's IconComponent, requiring the type bridge.
const AddCircleOutlineIcon = PlusCircle as unknown as IconComponent;
const HomeOutlinedIcon = Home as unknown as IconComponent;
const MenuIcon = Menu as unknown as IconComponent;
const BuildRoundedIcon = Wrench as unknown as IconComponent;
const MenuBookIcon = BookOpen as unknown as IconComponent;
const CloudQueueIcon = Cloud as unknown as IconComponent;
const AcUnitIcon = Snowflake as unknown as IconComponent;
const AppsIcon = LayoutGrid as unknown as IconComponent;

const routeRef = createRouteRef({
  id: 'storybook.test-route',
});

export default {
  title: 'Layout/Sidebar',
  component: Sidebar,
  decorators: [
    (Story: ComponentType<PropsWithChildren<{}>>) =>
      wrapInTestApp(<Story />, { mountedRoutes: { '/': routeRef } }),
  ],
  tags: ['!manifest'],
};

const handleSearch = (input: string) => {
  // eslint-disable-next-line no-console
  console.log(input);
};

export const SampleSidebar = () => (
  <SidebarPage>
    <Sidebar>
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        <SidebarSearchField onSearch={handleSearch} to="/search" />
        <SidebarDivider />
        <SidebarItem icon={HomeOutlinedIcon} to="#" text="Plugins" />
        <SidebarItem icon={AddCircleOutlineIcon} to="#" text="Create..." />
        <SidebarDivider />
        <SidebarSpace />
      </SidebarGroup>
    </Sidebar>
  </SidebarPage>
);

export const SampleScalableSidebar = () => (
  <SidebarPage>
    <Sidebar disableExpandOnHover>
      <SidebarSearchField onSearch={handleSearch} to="/search" />
      <SidebarDivider />
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        <SidebarItem icon={MenuBookIcon} text="Catalog">
          <SidebarSubmenu title="Catalog">
            <SidebarSubmenuItem title="Tools" to="/1" icon={BuildRoundedIcon} />
            <SidebarSubmenuItem title="APIs" to="/2" icon={CloudQueueIcon} />
            <SidebarSubmenuItem title="Components" to="/3" icon={AppsIcon} />
            <SidebarSubmenuItem
              title="Misc"
              to="/6"
              icon={AcUnitIcon}
              dropdownItems={[
                {
                  title: 'Lorem Ipsum',
                  to: '/7',
                },
                {
                  title: 'Lorem Ipsum',
                  to: '/8',
                },
              ]}
            />
          </SidebarSubmenu>
        </SidebarItem>
        <SidebarItem icon={HomeOutlinedIcon} to="#" text="Plugins" />
        <SidebarItem icon={AddCircleOutlineIcon} to="#" text="Create..." />
      </SidebarGroup>
      <SidebarDivider />
      <SidebarSpace />
      <SidebarExpandButton />
    </Sidebar>
  </SidebarPage>
);
