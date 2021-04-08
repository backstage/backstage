/*
 * Copyright 2020 Spotify AB
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
  createApiFactory,
  createPlugin,
  createRouteRef,
  createRoutableExtension,
  discoveryApiRef,
} from '@backstage/core';
import { SearchClient, searchApiRef } from './apis';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { SearchPage as SearchPageComponent } from './components/SearchPage';
import { SearchPageNext as SearchPageNextComponent } from './components/SearchPageNext';

export const rootRouteRef = createRouteRef({
  path: '/search',
  title: 'search',
});

export const rootNextRouteRef = createRouteRef({
  path: '/search-next',
  title: 'search',
});

export const searchPlugin = createPlugin({
  id: 'search',
  apis: [
    createApiFactory({
      api: searchApiRef,
      deps: { catalogApi: catalogApiRef, discoveryApi: discoveryApiRef },
      factory: ({ catalogApi, discoveryApi }) => {
        return new SearchClient({ catalogApi, discoveryApi });
      },
    }),
  ],
  register({ router }) {
    router.addRoute(rootRouteRef, SearchPageComponent);
    router.addRoute(rootNextRouteRef, SearchPageNextComponent);
  },
  routes: {
    root: rootRouteRef,
    nextRoot: rootNextRouteRef,
  },
});

export const SearchPage = searchPlugin.provide(
  createRoutableExtension({
    component: () => import('./components/SearchPage').then(m => m.SearchPage),
    mountPoint: rootRouteRef,
  }),
);

export const SearchPageNext = searchPlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/SearchPageNext').then(m => m.SearchPageNext),
    mountPoint: rootNextRouteRef,
  }),
);
