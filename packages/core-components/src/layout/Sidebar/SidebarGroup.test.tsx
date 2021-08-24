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

import { mockBreakpoint, renderInTestApp } from '@backstage/test-utils';
import HomeIcon from '@material-ui/icons/Home';
import LayersIcon from '@material-ui/icons/Layers';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { SidebarItem } from './Items';
import { MobileSidebarContext } from './MobileSidebar';
import { SidebarGroup } from './SidebarGroup';

const SidebarGroupWithItems = () => (
  <SidebarGroup icon={<HomeIcon />} label="Menu">
    <SidebarItem icon={HomeIcon} to="/one" text="Home" />
    <SidebarItem icon={LayersIcon} to="/two" text="Explore" />
    <SidebarItem icon={LibraryBooks} to="/three" text="Docs" />
  </SidebarGroup>
);

describe('<SidebarGroup />', () => {
  it('should render Items in BottomNavigationAciton on small screens', async () => {
    mockBreakpoint({ matches: true });
    const { findByRole, container } = await renderInTestApp(
      <SidebarGroupWithItems />,
    );
    expect(container.childNodes.length).toBe(1);
    expect(await findByRole('button')).toBeVisible();
  });

  it('should render Items without wrapper on bigger screens', async () => {
    mockBreakpoint({ matches: false });
    const { container } = await renderInTestApp(<SidebarGroupWithItems />);
    expect(container.childNodes.length).toBe(3);
  });

  it('should trigger update of MobileSidebarContext', async () => {
    mockBreakpoint({ matches: true });
    const value = {
      selectedMenuItemIndex: -1,
      setSelectedMenuItemIndex: jest.fn(),
    };
    const { findByRole } = await renderInTestApp(
      <MobileSidebarContext.Provider value={value}>
        <SidebarGroupWithItems />
      </MobileSidebarContext.Provider>,
    );
    const group = await findByRole('button');
    fireEvent.click(group);
    expect(value.setSelectedMenuItemIndex).toHaveBeenCalled();
  });
});
