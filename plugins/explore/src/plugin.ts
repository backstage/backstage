/*
 * Copyright 2020 The Backstage Authors
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

import { exploreToolsConfigRef } from '@backstage/plugin-explore-react';
import { catalogEntityRouteRef, exploreRouteRef } from './routes';
import {
  createApiFactory,
  createPlugin,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { ExploreClient, exploreApiRef } from './api';

/** @public */
export const explorePlugin = createPlugin({
  id: 'explore',
  apis: [
    createApiFactory({
      api: exploreApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new ExploreClient({ discoveryApi, fetchApi }),
    }),
    /**
     * @deprecated Use ExploreApi from `@backstage/plugin-explore` instead
     *
     * Register a default for exploreToolsConfigRef, you may want to override
     * the API locally in your app.
     */
    createApiFactory({
      api: exploreToolsConfigRef,
      deps: {
        exploreApi: exploreApiRef,
      },
      factory: ({ exploreApi }) => ({
        async getTools() {
          // TODO: Can we make this backwards compatible so it works off the static frontend example tools?
          // return exampleTools;
          return (await exploreApi.getTools()).tools;
        },
      }),
    }),
  ],
  routes: {
    explore: exploreRouteRef,
  },
  externalRoutes: {
    catalogEntity: catalogEntityRouteRef,
  },
});
