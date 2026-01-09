/*
 * Copyright 2024 The Backstage Authors
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

import { IconComponent, RouteRef } from '@backstage/frontend-plugin-api';
import { createExtensionBlueprint, createExtensionDataRef } from '../wiring';

/**
 * Creates extensions that make up the items of the nav bar.
 *
 * @private
 */
export interface NavItem {
  // Original props from nav items
  icon: IconComponent;
  hide?: boolean;
  // Custom component that can be rendered instead of the default sidebar item
  CustomComponent?: () => JSX.Element | null;
  // The position index of the item in the nav
  position?: number;
  dividerBelow?: boolean;
  title: string;
  routeRef: RouteRef<undefined>;
}

// TODO(Rugvip): Should this be broken apart into separate refs? title/icon/routeRef
const targetDataRef = createExtensionDataRef<NavItem>().with({
  id: 'core.nav-item.target',
});

/**
 * Creates extensions that make up the items of the nav bar.
 *
 * @public
 */
export const NavItemBlueprint = createExtensionBlueprint({
  kind: 'nav-item',
  attachTo: { id: 'app/nav', input: 'items' },
  output: [targetDataRef],
  dataRefs: {
    target: targetDataRef,
  },
  factory: (
    {
      icon,
      hide,
      CustomComponent,
      position,
      dividerBelow,
      routeRef,
      title,
    }: NavItem,
    { config },
  ) => [
    targetDataRef({
      title: config.title ?? title,
      icon,
      hide,
      CustomComponent,
      position,
      dividerBelow,
      routeRef,
    }),
  ],
  config: {
    schema: {
      title: z => z.string().optional(),
    },
  },
});
