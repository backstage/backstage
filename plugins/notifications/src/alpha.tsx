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
  PageBlueprint,
  createFrontendPlugin,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/frontend-plugin-api';
import { RiNotification3Line } from '@remixicon/react';
import { ReactRouterV6PageRouter } from '@backstage/plugin-app-react-router-v6';
import { rootRouteRef } from './routes';
import { NotificationsClient, notificationsApiRef } from './api';
import { unreadNotificationsHomeWidget } from './alpha/extensions/unreadNotificationsHomeWidget';

const page = PageBlueprint.make({
  params: {
    path: '/notifications',
    routeRef: rootRouteRef,
    // `NotificationsTable` renders each notification's `payload.link` through
    // `Link` from `@backstage/core-components`, which is React Router's own
    // `Link` for anything that is not a fully-qualified URL. The framework
    // provides no routing library context at page depth, so the page declares
    // the one it uses. The targets themselves are app-absolute — the table
    // anchors them to the app root before handing them over — so the page
    // needs a router to exist rather than needing this particular scope.
    loader: () =>
      import('./components/NotificationsPage').then(m => (
        <ReactRouterV6PageRouter>
          <m.NfsNotificationsPage />
        </ReactRouterV6PageRouter>
      )),
  },
});

const api = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: notificationsApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        new NotificationsClient({ discoveryApi, fetchApi }),
    }),
});

/** @alpha */
export default createFrontendPlugin({
  pluginId: 'notifications',
  title: 'Notifications',
  icon: <RiNotification3Line />,
  info: { packageJson: () => import('../package.json') },
  routes: {
    root: rootRouteRef,
  },
  // TODO(Rugvip): Nav item (i.e. NotificationsSidebarItem) currently needs to be installed manually
  extensions: [page, api, unreadNotificationsHomeWidget],
});

import { notificationsTranslationRef as _notificationsTranslationRef } from './translation';

/**
 * @alpha
 * @deprecated Import from `@backstage/plugin-notifications` instead.
 */
export const notificationsTranslationRef = _notificationsTranslationRef;
