/*
 * Copyright 2026 The Backstage Authors
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

import { ComponentType } from 'react';
import {
  AppNode,
  IconComponent,
  IconElement,
  RouteRef,
} from '@backstage/frontend-plugin-api';
import {
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';

/**
 * A navigation item auto-discovered from a page extension in the app.
 *
 * @public
 */
export interface NavContentNavItem {
  /** The app node of the page extension that this nav item points to */
  node: AppNode;
  /** The resolved route path */
  href: string;
  /** The display title */
  title: string;
  /** The display icon */
  icon: IconElement;
  /** The route ref of the source page */
  routeRef: RouteRef;
}

/**
 * A pre-bound renderer that wraps {@link NavContentNavItems} with a component,
 * so that `take` and `rest` return rendered elements directly.
 *
 * @public
 */
export interface NavContentNavItemsWithComponent {
  /** Render and take a specific item by extension ID. Returns null if not found. */
  take(id: string): JSX.Element | null;
  /** Render all remaining items not yet taken, optionally sorted. */
  rest(options?: { sortBy?: 'title' }): JSX.Element[];
}

/**
 * A collection of nav items that supports picking specific items by ID
 * and retrieving whatever remains. Created fresh for each render.
 *
 * @public
 */
export interface NavContentNavItems {
  /** Take an item by extension ID, removing it from the collection. */
  take(id: string): NavContentNavItem | undefined;
  /** All items not yet taken. */
  rest(): NavContentNavItem[];
  /** Create a copy of the collection preserving the current taken state. */
  clone(): NavContentNavItems;
  /** Create a renderer that wraps take/rest to return pre-rendered elements. */
  withComponent(
    Component: ComponentType<NavContentNavItem>,
  ): NavContentNavItemsWithComponent;
}

/**
 * The props for the {@link NavContentComponent}.
 *
 * @public
 */
export interface NavContentComponentProps {
  /**
   * Nav items auto-discovered from page extensions, with take/rest semantics
   * for placing specific items in specific positions.
   */
  navItems: NavContentNavItems;

  /**
   * Flat list of nav items for simple rendering. Use `navItems` for more
   * control over item placement.
   *
   * @deprecated Use `navItems` instead.
   */
  items: Array<{
    icon: IconComponent;
    title: string;
    routeRef: RouteRef<undefined>;
    to: string;
    text: string;
  }>;
}

/**
 * A component that renders the nav bar content, to be passed to the {@link NavContentBlueprint}.
 *
 * @public
 */
export type NavContentComponent = (
  props: NavContentComponentProps,
) => JSX.Element | null;

const componentDataRef = createExtensionDataRef<NavContentComponent>().with({
  id: 'core.nav-content.component',
});

/**
 * Creates an extension that replaces the entire nav bar with your own component. This blueprint is limited to use by the app plugin.
 *
 * @public
 */
export const NavContentBlueprint = createExtensionBlueprint({
  kind: 'nav-content',
  attachTo: { id: 'app/nav', input: 'content' },
  output: [componentDataRef],
  dataRefs: {
    component: componentDataRef,
  },
  *factory(params: { component: NavContentComponent }) {
    yield componentDataRef(params.component);
  },
});
