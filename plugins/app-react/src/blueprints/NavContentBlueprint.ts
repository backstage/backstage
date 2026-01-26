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

import { IconComponent, RouteRef } from '@backstage/frontend-plugin-api';
import {
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';

/**
 * The props for the {@link NavContentComponent}.
 *
 * @public
 */
export interface NavContentComponentProps {
  /**
   * The nav items available to the component. These are all the items created
   * with the {@link @backstage/frontend-plugin-api#NavItemBlueprint} in the app.
   *
   * In addition to the original properties from the nav items, these also
   * include a resolved route path as `to`, and duplicated `title` as `text` to
   * simplify rendering.
   */
  items: Array<{
    // Original props from nav items
    icon: IconComponent;
    title: string;
    routeRef: RouteRef<undefined>;

    // Additional props to simplify item rendering
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
