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

import {
  Sidebar,
  SidebarDivider,
  SidebarItem,
  SidebarSubmenu,
  SidebarSubmenuItem,
} from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import HomeIcon from '@material-ui/icons/Home';
import React from 'react';

export function DeclarativeSidebar() {
  const configApi = useApi(configApiRef);

  return (
    <Sidebar>
      <SidebarItem icon={HomeIcon} to="/" text="Home" />
      <SidebarDivider />
      <SidebarItem icon={HomeIcon} to="catalog" text="Catalog">
        <SidebarSubmenu title="Catalog">
          <SidebarSubmenuItem
            title="Domains"
            to="catalog?filters[kind]=domain"
          />
        </SidebarSubmenu>
      </SidebarItem>
    </Sidebar>
  );
}
