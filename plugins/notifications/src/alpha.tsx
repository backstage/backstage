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
import { NavElementBlueprint } from '@backstage/plugin-app-react';
import { RiNotification3Line } from '@remixicon/react';
import { z } from 'zod/v4';
import { rootRouteRef } from './routes';
import { NotificationsClient, notificationsApiRef } from './api';
import { unreadNotificationsHomeWidget } from './alpha/extensions/unreadNotificationsHomeWidget';

const page = PageBlueprint.make({
  params: {
    path: '/notifications',
    routeRef: rootRouteRef,
    loader: () =>
      import('./components/NotificationsPage').then(m => (
        <m.NfsNotificationsPage />
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
const navElement = NavElementBlueprint.makeWithOverrides({
  configSchema: {
    webNotificationsEnabled: z.boolean().optional(),
    titleCounterEnabled: z.boolean().optional(),
    snackbarEnabled: z.boolean().optional(),
  },
  factory(originalFactory, { config }) {
    return originalFactory({
      loader: () =>
        import('./components/NotificationsSideBarItem').then(m => (
          <m.NotificationsSidebarItem
            webNotificationsEnabled={config.webNotificationsEnabled}
            titleCounterEnabled={config.titleCounterEnabled}
            snackbarEnabled={config.snackbarEnabled}
          />
        )),
    });
  },
});

export default createFrontendPlugin({
  pluginId: 'notifications',
  title: 'Notifications',
  icon: <RiNotification3Line />,
  info: { packageJson: () => import('../package.json') },
  routes: {
    root: rootRouteRef,
  },
  extensions: [page, api, navElement, unreadNotificationsHomeWidget],
});

import { notificationsTranslationRef as _notificationsTranslationRef } from './translation';

/**
 * @alpha
 * @deprecated Import from `@backstage/plugin-notifications` instead.
 */
export const notificationsTranslationRef = _notificationsTranslationRef;
