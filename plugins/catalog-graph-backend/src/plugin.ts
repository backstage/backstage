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
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';

import { createRouter } from './router';
import { DefaultGraphService } from './services/GraphService';

/**
 * catalogGraphPlugin backend plugin
 *
 * @public
 */
export const catalogGraphPlugin = createBackendPlugin({
  pluginId: 'catalog-graph',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        catalog: catalogServiceRef,
      },
      async init({ config, httpAuth, httpRouter, catalog }) {
        const maxDepth =
          config.getOptionalNumber('catalogGraph.maxDepth') ??
          Number.POSITIVE_INFINITY;

        const limitEntities =
          config.getOptionalNumber('catalogGraph.limitEntities') ??
          Number.POSITIVE_INFINITY;

        const graphService = new DefaultGraphService({
          catalog,
          maxDepth,
          limitEntities,
        });

        httpRouter.use(
          await createRouter({
            httpAuth,
            graphService,
          }),
        );
      },
    });
  },
});
