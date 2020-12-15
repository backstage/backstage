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
  createApiRef,
  createPlugin,
  createRouteRef,
  discoveryApiRef,
} from '@backstage/core';
import { L5dClient } from './api/client';

export const rootCatalogLinkerdPluginRef = createRouteRef({
  path: '*',
  title: 'Linkerd',
});

export const linkerdPluginRef = createApiRef<L5dClient>({
  id: 'plugin.linkerd.service',
  description:
    'Used by the Linkerd plugin to make requests to accompanying backend',
});

export const plugin = createPlugin({
  id: 'linkerd',
  apis: [
    createApiFactory({
      api: linkerdPluginRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => new L5dClient({ discoveryApi }),
    }),
  ],
});
