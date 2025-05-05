/*
 * Copyright 2025 The Backstage Authors
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
  ApiBlueprint,
  NavComponentBlueprint,
  PageBlueprint,
  createApiFactory,
  createFrontendPlugin,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/frontend-plugin-api';
import { rootRouteRef } from './routes';
import {
  compatWrapper,
  convertLegacyRouteRef,
  convertLegacyRouteRefs,
} from '@backstage/core-compat-api';
import { NotificationsClient, notificationsApiRef } from './api';
import { NotificationsSidebarItem } from './components';

const page = PageBlueprint.make({
  params: {
    defaultPath: '/notifications',
    routeRef: convertLegacyRouteRef(rootRouteRef),
    loader: () =>
      import('./components/NotificationsPage').then(m =>
        compatWrapper(<m.NotificationsPage />),
      ),
  },
});

const api = ApiBlueprint.make({
  params: {
    factory: createApiFactory({
      api: notificationsApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        new NotificationsClient({ discoveryApi, fetchApi }),
    }),
  },
});

const navBarComponent = NavComponentBlueprint.makeWithOverrides({
  config: {
    schema: {
      webNotificationsEnabled: z => z.boolean().optional(),
      titleCounterEnabled: z => z.boolean().optional(),
      snackbarEnabled: z => z.boolean().optional(),
      snackbarAutoHideDuration: z => z.number().optional(),
      className: z => z.string().optional(),
      text: z => z.string().optional(),
      disableHighlight: z => z.boolean().optional(),
      noTrack: z => z.boolean().optional(),
    },
  },
  factory(originalFactory, context) {
    return originalFactory({
      Component: (props: Parameters<typeof NotificationsSidebarItem>[0]) =>
        compatWrapper(<NotificationsSidebarItem {...props} />),
      routeRef: convertLegacyRouteRef(rootRouteRef),
      args: context.config,
    });
  },
});

/** @alpha */
export default createFrontendPlugin({
  pluginId: 'notifications',
  routes: convertLegacyRouteRefs({
    root: rootRouteRef,
  }),
  extensions: [page, api, navBarComponent],
});
