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

import { SearchClient } from './apis';
import {
  searchApiRef,
  SearchResult as RealSearchResult,
  DefaultResultListItem as RealDefaultResultListItem,
} from '@backstage/plugin-search-react';
import {
  createApiFactory,
  createPlugin,
  createRouteRef,
  createRoutableExtension,
  discoveryApiRef,
  createComponentExtension,
  identityApiRef,
} from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 'search',
});

/**
 * @public
 */
export const searchPlugin = createPlugin({
  id: 'search',
  apis: [
    createApiFactory({
      api: searchApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) => {
        return new SearchClient({ discoveryApi, identityApi });
      },
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

/**
 * @public
 */
export const SearchPage = searchPlugin.provide(
  createRoutableExtension({
    name: 'SearchPage',
    component: () => import('./components/SearchPage').then(m => m.SearchPage),
    mountPoint: rootRouteRef,
  }),
);

/**
 * @public
 * @deprecated Import from `@backstage/plugin-search-react` instead.
 */
export const SearchResult = RealSearchResult;

/**
 * @public
 */
export const SidebarSearchModal = searchPlugin.provide(
  createComponentExtension({
    name: 'SidebarSearchModal',
    component: {
      lazy: () =>
        import('./components/SidebarSearchModal').then(
          m => m.SidebarSearchModal,
        ),
    },
  }),
);

/**
 * @public
 * @deprecated Import from `@backstage/plugin-search-react` instead.
 */
export const DefaultResultListItem = RealDefaultResultListItem;

/**
 * @public
 */
export const HomePageSearchBar = searchPlugin.provide(
  createComponentExtension({
    name: 'HomePageSearchBar',
    component: {
      lazy: () =>
        import('./components/HomePageComponent').then(m => m.HomePageSearchBar),
    },
  }),
);
