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

import React from 'react';
import {
  ApiBlueprint,
  PageBlueprint,
  createApiFactory,
  createFrontendPlugin,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/frontend-plugin-api';
import { rootRouteRef } from './routes';
import {
  convertLegacyRouteRef,
  convertLegacyRouteRefs,
} from '@backstage/core-compat-api';
import { NotificationsClient, notificationsApiRef } from './api';

const page = PageBlueprint.make({
  params: {
    defaultPath: '/notifications',
    routeRef: convertLegacyRouteRef(rootRouteRef),
    loader: () =>
      import('./components/NotificationsPage').then(m => (
        <m.NotificationsPage />
      )),
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

/** @alpha */
export default createFrontendPlugin({
  id: 'notifications',
  routes: convertLegacyRouteRefs({
    root: rootRouteRef,
  }),
  // TODO(Rugvip): Nav item (i.e. NotificationsSidebarItem) currently needs to be installed manually
  extensions: [page, api],
});
