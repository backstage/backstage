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

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import BuildRoundedIcon from '@material-ui/icons/BuildRounded';
import LibraryBooksOutlinedIcon from '@material-ui/icons/LibraryBooksOutlined';
import WebOutlinedIcon from '@material-ui/icons/WebOutlined';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  Sidebar,
  SidebarDivider,
  SidebarExpandButton,
  SidebarIntro,
  SidebarItem,
  SidebarPage,
  SidebarSearchField,
  SidebarSpace,
} from '.';
import { SidebarSubmenuItem } from './SidebarSubmenuItem';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import SettingsApplications from '@material-ui/icons/SettingsApplications';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import { SidebarSubmenu } from './SidebarSubmenu';

export default {
  title: 'Layout/Sidebar',
  component: Sidebar,
  decorators: [
    (storyFn: () => JSX.Element) => (
      <MemoryRouter initialEntries={['/']}>{storyFn()}</MemoryRouter>
    ),
  ],
};

const handleSearch = (input: string) => {
  // eslint-disable-next-line no-console
  console.log(input);
};

export const SampleSidebar = () => (
  <SidebarPage>
    <Sidebar>
      <SidebarSearchField onSearch={handleSearch} to="/search" />
      <SidebarDivider />
      <SidebarItem icon={HomeOutlinedIcon} to="#" text="Plugins" />
      <SidebarItem icon={AddCircleOutlineIcon} to="#" text="Create..." />
      <SidebarDivider />
      <SidebarIntro />
      <SidebarSpace />
    </Sidebar>
  </SidebarPage>
);

export const SampleScalableSidebar = () => (
  <SidebarPage>
    <Sidebar disableExpandOnHover>
      <SidebarSearchField onSearch={handleSearch} to="/search" />
      <SidebarDivider />
      <SidebarItem icon={MenuBookIcon} text="Catalog">
        <SidebarSubmenu title="Catalog">
          <SidebarSubmenuItem title="Tools" to="/1" icon={BuildRoundedIcon} />
          <SidebarSubmenuItem title="APIs" to="/2" icon={CloudQueueIcon} />
          <SidebarSubmenuItem
            title="Services"
            to="/3"
            icon={SettingsApplications}
          />
          <SidebarSubmenuItem
            title="Libraries"
            to="/4"
            icon={LibraryBooksOutlinedIcon}
          />
          <SidebarSubmenuItem title="Websites" to="/5" icon={WebOutlinedIcon} />
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
      <SidebarDivider />
      <SidebarIntro />
      <SidebarSpace />
      <SidebarExpandButton />
    </Sidebar>
  </SidebarPage>
);
