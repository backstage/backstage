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
import {
  analyticsApiRef,
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { UsageAnalyticsClient } from './api/UsageAnalyticsClient';
import { UsageAnalyticsCollector } from './api/UsageAnalyticsCollector';
import { usageAnalyticsApiRef } from './api/UsageAnalyticsApi';
import { rootRouteRef } from './routes';

/** @public */
export const usageAnalyticsCollectorApi = createApiFactory({
  api: analyticsApiRef,
  deps: {
    discoveryApi: discoveryApiRef,
    fetchApi: fetchApiRef,
  },
  factory: ({ discoveryApi, fetchApi }) =>
    new UsageAnalyticsCollector({ discoveryApi, fetchApi }),
});

/** @public */
export const usageAnalyticsPlugin = createPlugin({
  id: 'usage-analytics',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: usageAnalyticsApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new UsageAnalyticsClient(discoveryApi, fetchApi),
    }),
  ],
});

/** @public */
export const UsageAnalyticsPage = usageAnalyticsPlugin.provide(
  createRoutableExtension({
    name: 'UsageAnalyticsPage',
    component: () =>
      import('./components/UsageAnalyticsPage/UsageAnalyticsPage').then(
        module => module.UsageAnalyticsPage,
      ),
    mountPoint: rootRouteRef,
  }),
);
