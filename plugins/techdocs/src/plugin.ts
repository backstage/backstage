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
/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  createPlugin,
  createRouteRef,
  createApiFactory,
  configApiRef,
  discoveryApiRef,
  createRoutableExtension,
} from '@backstage/core';
import {
  techdocsStorageApiRef,
  TechDocsStorageApi,
  techdocsApiRef,
  TechDocsApi,
} from './api';

export const rootRouteRef = createRouteRef({
  path: '',
  title: 'TechDocs Landing Page',
});

export const rootDocsRouteRef = createRouteRef({
  path: ':namespace/:kind/:name/*',
  title: 'Docs',
});

export const rootCatalogDocsRouteRef = createRouteRef({
  path: '*',
  title: 'Docs',
});

export const techdocsPlugin = createPlugin({
  id: 'techdocs',
  apis: [
    createApiFactory({
      api: techdocsStorageApiRef,
      deps: { configApi: configApiRef, discoveryApi: discoveryApiRef },
      factory: ({ configApi, discoveryApi }) =>
        new TechDocsStorageApi({
          configApi,
          discoveryApi,
        }),
    }),
    createApiFactory({
      api: techdocsApiRef,
      deps: { configApi: configApiRef, discoveryApi: discoveryApiRef },
      factory: ({ configApi, discoveryApi }) =>
        new TechDocsApi({
          configApi,
          discoveryApi,
        }),
    }),
  ],
  routes: {
    root: rootRouteRef,
    entityContent: rootCatalogDocsRouteRef,
  },
});

export const TechdocsPage = techdocsPlugin.provide(
  createRoutableExtension({
    component: () => import('./Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);

export const EntityTechdocsContent = techdocsPlugin.provide(
  createRoutableExtension({
    component: () => import('./Router').then(m => m.EmbeddedDocsRouter),
    mountPoint: rootCatalogDocsRouteRef,
  }),
);
