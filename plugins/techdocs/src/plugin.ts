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

// TODO: Use discovery API for frontend to get URL for techdocs-backend instead of requestUrl
export const plugin = createPlugin({
  id: 'techdocs',
  apis: [
    createApiFactory({
      api: techdocsStorageApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) =>
        new TechDocsStorageApi({
          apiOrigin: configApi.getString('techdocs.requestUrl'),
        }),
    }),
    createApiFactory({
      api: techdocsApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) =>
        new TechDocsApi({
          apiOrigin: configApi.getString('techdocs.requestUrl'),
        }),
    }),
  ],
});
