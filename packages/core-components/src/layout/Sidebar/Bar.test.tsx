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

import { renderInTestApp } from '@backstage/test-utils';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import BuildRoundedIcon from '@material-ui/icons/BuildRounded';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  Sidebar,
  SidebarExpandButton,
  SidebarItem,
  SidebarSearchField,
  SidebarPinStateProvider,
  SidebarSubmenu,
  SidebarSubmenuItem,
} from '.';

async function renderScalableSidebar() {
  await renderInTestApp(
    <SidebarPinStateProvider
      value={{
        isPinned: false,
        isMobile: false,
        toggleSidebarPinState: () => {},
      }}
    >
      <Sidebar disableExpandOnHover>
        <SidebarSearchField onSearch={() => {}} to="/search" />
        <SidebarItem icon={MenuBookIcon} onClick={() => {}} text="Catalog">
          <SidebarSubmenu title="Catalog">
            <SidebarSubmenuItem title="Tools" to="/1" icon={BuildRoundedIcon} />
            <SidebarSubmenuItem
              title="External Link"
              to="https://backstage.io/"
              icon={BuildRoundedIcon}
            />
            <SidebarSubmenuItem
              title="Misc"
              to="/6"
              icon={AcUnitIcon}
              dropdownItems={[
                {
                  title: 'dropdown item 1',
                  to: '/dropdownitemlink',
                },
                {
                  title: 'dropdown item 2',
                  to: '/dropdownitemlink2',
                },
                {
                  title: 'dropdown item 3',
                  to: 'https://backstage.io/',
                },
              ]}
            />
          </SidebarSubmenu>
        </SidebarItem>
        <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
        <SidebarExpandButton />
      </Sidebar>
    </SidebarPinStateProvider>,
  );
}

describe('Sidebar', () => {
  beforeEach(async () => {
    await renderScalableSidebar();
  });

  describe('Click to Expand', () => {
    it('Sidebar should show expanded items when expand button is clicked', async () => {
      await userEvent.click(screen.getByTestId('sidebar-expand-button'));
      expect(await screen.findByText('Create...')).toBeInTheDocument();
    });
    it('Sidebar should not show expanded items when hovered on', async () => {
      await userEvent.hover(screen.getByTestId('sidebar-root'));
      expect(screen.queryByText('Create...')).not.toBeInTheDocument();
    });
  });
  describe('Submenu Items', () => {
    it('Extended sidebar with submenu content hidden by default', async () => {
      expect(screen.queryByText('Tools')).not.toBeInTheDocument();
      expect(screen.queryByText('Misc')).not.toBeInTheDocument();
    });

    it('Extended sidebar with submenu content visible when hover over submenu items', async () => {
      await userEvent.hover(screen.getByTestId('item-with-submenu'));
      expect(await screen.findByText('Tools')).toBeInTheDocument();
      expect(await screen.findByText('Misc')).toBeInTheDocument();
    });

    it('Multicategory item in submenu shows drop down on click', async () => {
      await userEvent.hover(screen.getByTestId('item-with-submenu'));
      await userEvent.click(screen.getByText('Misc'));
      expect(screen.getByText('dropdown item 1')).toBeInTheDocument();
      expect(screen.getByText('dropdown item 2')).toBeInTheDocument();
    });

    it('Dropdown item in submenu renders a link when `to` value is provided', async () => {
      await userEvent.hover(screen.getByTestId('item-with-submenu'));
      await userEvent.click(screen.getByText('Misc'));
      expect(screen.getByText('dropdown item 1').closest('a')).toHaveAttribute(
        'href',
        '/dropdownitemlink',
      );
    });

    it('Submenu item renders an external link when `to` value is provided', async () => {
      await userEvent.hover(screen.getByTestId('item-with-submenu'));
      expect(screen.getByText('External Link').closest('a')).toHaveAttribute(
        'href',
        'https://backstage.io/',
      );
    });

    it('Dropdown item in submenu renders an external link when `to` value is provided', async () => {
      await userEvent.hover(screen.getByTestId('item-with-submenu'));
      await userEvent.click(screen.getByText('Misc'));
      expect(screen.getByText('dropdown item 3').closest('a')).toHaveAttribute(
        'href',
        'https://backstage.io/',
      );
    });
  });
});
