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

import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BuildRoundedIcon from '@material-ui/icons/BuildRounded';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import { CatalogSidebarLogo } from './icons/CatalogSidebarLogo';
import { MiscIcon } from './icons/MiscIcon';
import { Sidebar, SidebarExpandButton } from './Bar';
import { SidebarItem, SidebarSearchField } from './Items';
import { SubmenuItem } from './SubmenuItem';

async function renderScalableSidebar() {
  await renderInTestApp(
    <Sidebar disableExpandOnHover>
      <SidebarSearchField onSearch={() => {}} to="/search" />
      <SidebarItem
        icon={CatalogSidebarLogo}
        onClick={() => {}}
        text="Catalog"
        hasSubMenu
        submenuTitle="Catalog"
      >
        <SubmenuItem title="Tools" to="/1" icon={BuildRoundedIcon} />
        <SubmenuItem
          title="Misc"
          to="/6"
          icon={MiscIcon}
          hasDropDown
          dropdownItems={[
            {
              title: 'dropdown item 1',
              to: '/dropdownitemlink',
            },
            {
              title: 'dropdown item 2',
              to: '/dropdownitemlink2',
            },
          ]}
        />
      </SidebarItem>
      <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
      <SidebarExpandButton />
    </Sidebar>,
  );
}

describe('Sidebar', () => {
  beforeEach(async () => {
    await renderScalableSidebar();
  });

  describe('Click to Expand', () => {
    it('Sidebar should show expanded items when expand button is clicked', async () => {
      userEvent.click(screen.getByTestId('sidebar-expand-button'));
      expect(await screen.findByText('Create...')).toBeInTheDocument();
    });
    it('Sidebar should not show expanded items when hovered on', async () => {
      userEvent.hover(screen.getByTestId('sidebar-root'));
      expect(await screen.queryByText('Create...')).not.toBeInTheDocument();
    });
  });
  describe('Submenu Items', () => {
    it('Extended sidebar with submenu content hidden by default', async () => {
      expect(await screen.queryByText('Tools')).not.toBeInTheDocument();
      expect(await screen.queryByText('Misc')).not.toBeInTheDocument();
    });

    it('Extended sidebar with submenu content visible when hover over submenu items', async () => {
      userEvent.hover(screen.getByTestId('item-with-submenu'));
      expect(await screen.findByText('Tools')).toBeInTheDocument();
      expect(await screen.findByText('Misc')).toBeInTheDocument();
    });

    it('Multicategory item in submenu shows drop down on click', async () => {
      userEvent.hover(screen.getByTestId('item-with-submenu'));
      userEvent.click(screen.getByText('Misc'));
      expect(await screen.getByText('dropdown item 1')).toBeInTheDocument();
      expect(await screen.getByText('dropdown item 2')).toBeInTheDocument();
    });

    it('Dropdown item in submenu renders a link when `to` value is provided', async () => {
      userEvent.hover(screen.getByTestId('item-with-submenu'));
      userEvent.click(screen.getByText('Misc'));
      expect(screen.getByText('dropdown item 1').closest('a')).toHaveAttribute(
        'href',
        '/dropdownitemlink',
      );
    });
  });
});
