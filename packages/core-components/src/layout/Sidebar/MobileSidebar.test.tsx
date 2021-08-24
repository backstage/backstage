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
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import HomeIcon from '@material-ui/icons/Home';
import LayersIcon from '@material-ui/icons/Layers';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { Sidebar } from './Bar';
import { SidebarItem } from './Items';
import { MobileSidebar } from './MobileSidebar';
import { SidebarGroup } from './SidebarGroup';

const MobileSidebarWithGroups = () => (
  <MobileSidebar>
    <h1>Header</h1>
    <SidebarGroup icon={<HomeIcon />} label="Menu">
      <SidebarItem icon={HomeIcon} to="/" text="Home" />
      <SidebarItem icon={LayersIcon} to="/" text="Explore" />
      <SidebarItem icon={LibraryBooks} to="/" text="Docs" />
    </SidebarGroup>
    <div>Content</div>
    <div>More Content</div>
    <SidebarGroup icon={<CreateComponentIcon />} label="Create" to="#" />
    <footer>Footer</footer>
  </MobileSidebar>
);

const MobileSidebarWithoutGroups = () => (
  <MobileSidebar>
    <SidebarItem icon={HomeIcon} to="/one" text="Home" />
    <SidebarItem icon={LayersIcon} to="/two" text="Explore" />
    <SidebarItem icon={LibraryBooks} to="/three" text="Docs" />
  </MobileSidebar>
);

describe('<MobileSidebar />', () => {
  beforeEach(() => {
    mockBreakpoint({ matches: true });
  });

  it('should render MobileSidebar on smaller screens', async () => {
    const { getByTestId } = await renderInTestApp(
      <Sidebar>
        <SidebarItem icon={HomeIcon} to="/one" text="Home" />
      </Sidebar>,
    );
    expect(getByTestId('mobile-sidebar-root')).toBeVisible();
  });

  it('should render only SidebarGroups inside MobileSidebar', async () => {
    const { findAllByRole, getByTestId, findByText } = await renderInTestApp(
      <MobileSidebarWithGroups />,
    );
    expect(getByTestId('mobile-sidebar-root').children.length).toBe(2);
    expect((await findAllByRole('button')).length).toBe(2);
    expect(await findByText('Menu')).toBeValid();
    expect(await findByText('Create')).toBeValid();
  });

  it('should render default MobileSidebar when there are no SidebarGroups', async () => {
    const { findAllByRole, getByTestId } = await renderInTestApp(
      <MobileSidebarWithoutGroups />,
    );
    expect(getByTestId('mobile-sidebar-root').children.length).toBe(1);
    const defaultSidebarGroup = await findAllByRole('button');
    expect(defaultSidebarGroup.length).toBe(1);
  });

  it('should render OverlayMenu displaying SidebarItems', async () => {
    const { findByText, getByRole } = await renderInTestApp(
      <MobileSidebarWithGroups />,
    );
    const menuButton = await findByText('Menu');
    fireEvent.click(menuButton);
    expect(getByRole('heading', { name: 'Menu' })).toBeVisible();
    expect(getByRole('link', { name: 'Home' })).toBeVisible();
    expect(getByRole('link', { name: 'Explore' })).toBeVisible();
    expect(getByRole('link', { name: 'Docs' })).toBeVisible();
  });
});
