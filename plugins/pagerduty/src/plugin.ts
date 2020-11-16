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
  configApiRef,
} from '@backstage/core';
import { pagerDutyApiRef, PagerDutyClientApi } from './api';

export const rootRouteRef = createRouteRef({
  path: '/pagerduty',
  title: 'pagerduty',
});

export const plugin = createPlugin({
  id: 'pagerduty',
  apis: [
    createApiFactory({
      api: pagerDutyApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) =>
        new PagerDutyClientApi({
          api_url: `${configApi.getString(
            'backend.baseUrl',
          )}/api/proxy/pagerduty`,
          events_url: 'https://events.pagerduty.com/v2',
        }),
    }),
  ],
});
