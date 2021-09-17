/*
 * Copyright 2021 Spotify AB
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
  createPlugin,
  createRoutableExtension,
  createRouteRef,
} from '@backstage/core';

import { rootRouteRef } from './routes';

export const rootRouteRef1 = createRouteRef({
  title: 'dfds-iam-selfservice-plugin-test',
});

export const dfdsIamSelfservicePluginPlugin = createPlugin({
  id: 'dfds-iam-selfservice-plugin',
  routes: {
    root: rootRouteRef,
    test: rootRouteRef1,
  },
});

export const DfdsIamSelfservicePluginPage = dfdsIamSelfservicePluginPlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);

export const DfdsIamSelfservicePluginOverviewPage = dfdsIamSelfservicePluginPlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/ExampleFetchComponent').then(
        m => m.ExampleFetchComponent,
      ),
    mountPoint: rootRouteRef1,
  }),
);
