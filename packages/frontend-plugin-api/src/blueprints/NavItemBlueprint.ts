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

import { IconComponent } from '../icons/types';
import { RouteRef } from '../routing';
import { createExtensionBlueprint, createExtensionDataRef } from '../wiring';

/**
 * Base fields for standard nav items.
 *
 * @private
 */
type NavItemBase = {
  icon: IconComponent;
  title: string;
  routeRef: RouteRef<undefined>;
  hide?: boolean;
  position?: number;
  dividerBelow?: boolean;
};

/**
 * Nav item variant when a custom component is provided.
 * Other mandatory fields become optional.
 *
 * @private
 */
export type NavItemCustom = Pick<
  NavItemBase,
  'hide' | 'position' | 'dividerBelow'
> & {
  CustomComponent: () => JSX.Element | null;
  hide?: boolean;
  position?: number;
  dividerBelow?: boolean;
  title?: never;
  routeRef?: never;
  icon?: never;
};

/**
 * Nav item variant without a custom component.
 * Keeps required fields and disallows `CustomComponent`.
 *
 * @private
 */
export type NavItemStandard = NavItemBase & {
  CustomComponent?: never;
};

/**
 * Union type for nav items.
 *
 * @private
 */
export type NavItem = NavItemCustom | NavItemStandard;

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
  factory: (params: NavItem, { config }) => {
    if ('CustomComponent' in params && params.CustomComponent) {
      const out: NavItemCustom = {
        CustomComponent: params.CustomComponent,
        hide: params.hide,
        position: params.position,
        dividerBelow: params.dividerBelow,
      };
      return [targetDataRef(out)];
    }

    const out: NavItemStandard = {
      title: config.title ?? params.title,
      icon: params.icon,
      routeRef: params.routeRef,
      hide: params.hide,
      position: params.position,
      dividerBelow: params.dividerBelow,
      CustomComponent: undefined,
    };
    return [targetDataRef(out)];
  },
  config: {
    schema: {
      title: z => z.string().optional(),
    },
  },
});
