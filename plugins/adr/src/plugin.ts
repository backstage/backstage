/*
 * Copyright 2022 The Backstage Authors
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

import { adrApiRef, AdrClient } from './api';
import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
} from '@backstage/core-plugin-api';
import { createSearchResultListItemExtension } from '@backstage/plugin-search-react';
import { rootRouteRef } from './routes';
import { AdrSearchResultListItemProps } from './search';

/**
 * The Backstage plugin that holds ADR specific components
 * @public
 */
export const adrPlugin = createPlugin({
  id: 'adr',
  apis: [
    createApiFactory({
      api: adrApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
      },
      factory({ discoveryApi }) {
        return new AdrClient({ discoveryApi });
      },
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

/**
 * An extension for browsing ADRs on an entity page.
 * @public
 */
export const EntityAdrContent = adrPlugin.provide(
  createRoutableExtension({
    name: 'EntityAdrContent',
    component: () =>
      import('./components/EntityAdrContent').then(m => m.EntityAdrContent),
    mountPoint: rootRouteRef,
  }),
);

/**
 * React extension used to render results on Search page or modal
 *
 * @public
 */
export const AdrSearchResultListItem: (
  props: AdrSearchResultListItemProps,
) => JSX.Element | null = adrPlugin.provide(
  createSearchResultListItemExtension({
    name: 'AdrSearchResultListItem',
    component: () =>
      import('./search/AdrSearchResultListItem').then(
        m => m.AdrSearchResultListItem,
      ),
    predicate: result => result.type === 'adr',
  }),
);
