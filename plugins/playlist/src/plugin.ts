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

import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { playlistApiRef, PlaylistClient } from './api';
import { rootRouteRef } from './routes';

/**
 * @public
 */
export const playlistPlugin = createPlugin({
  id: 'playlist',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: playlistApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new PlaylistClient({ discoveryApi, fetchApi }),
    }),
  ],
});

/**
 * @public
 */
export const PlaylistIndexPage = playlistPlugin.provide(
  createRoutableExtension({
    name: 'PlaylistIndexPage',
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);

/**
 * @public
 */
export const EntityPlaylistDialog = playlistPlugin.provide(
  createComponentExtension({
    name: 'EntityPlaylistDialog',
    component: {
      lazy: () =>
        import('./components/EntityPlaylistDialog').then(
          m => m.EntityPlaylistDialog,
        ),
    },
  }),
);
