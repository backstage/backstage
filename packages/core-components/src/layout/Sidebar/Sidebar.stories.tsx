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
  SidebarSearchField,
  SidebarSpace,
} from '.';
import { SubmenuItem } from './SubmenuItem';
import { CatalogSidebarLogo } from './icons/CatalogSidebarLogo';
import { APIsIcon } from './icons/APIsIcon';
import { ServicesIcon } from './icons/ServicesIcon';
import { MiscIcon } from './icons/MiscIcon';

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
  <Sidebar>
    <SidebarSearchField onSearch={handleSearch} to="/search" />
    <SidebarDivider />
    <SidebarItem icon={HomeOutlinedIcon} to="#" text="Plugins" />
    <SidebarItem icon={AddCircleOutlineIcon} to="#" text="Create..." />
    <SidebarDivider />
    <SidebarIntro />
    <SidebarSpace />
  </Sidebar>
);

export const SampleScalableSidebar = () => (
  <Sidebar disableExpandOnHover>
    <SidebarSearchField onSearch={handleSearch} to="/search" />
    <SidebarDivider />
    <SidebarItem
      icon={CatalogSidebarLogo}
      onClick={() => {}}
      text="Catalog"
      hasSubMenu
      submenuTitle="Catalog"
    >
      <SubmenuItem title="Tools" to="/1" icon={BuildRoundedIcon} />
      <SubmenuItem title="APIs" to="/2" icon={APIsIcon} />
      <SubmenuItem title="Services" to="/3" icon={ServicesIcon} />
      <SubmenuItem title="Libraries" to="/4" icon={LibraryBooksOutlinedIcon} />
      <SubmenuItem title="Websites" to="/5" icon={WebOutlinedIcon} />
      <SubmenuItem
        title="Misc"
        to="/6"
        icon={MiscIcon}
        hasDropDown
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
    </SidebarItem>
    <SidebarItem icon={HomeOutlinedIcon} to="#" text="Plugins" />
    <SidebarItem icon={AddCircleOutlineIcon} to="#" text="Create..." />
    <SidebarDivider />
    <SidebarIntro />
    <SidebarSpace />
    <SidebarExpandButton />
  </Sidebar>
);
