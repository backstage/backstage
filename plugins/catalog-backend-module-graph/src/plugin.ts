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
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';

import { DefaultGraphService } from './services/GraphService';
import { GraphModule } from './GraphModule';

/**
 * Catalog Module for Graph queries
 *
 * @public
 */
export const catalogModuleGraph = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'graph',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        catalog: catalogServiceRef,
      },
      async init({ config, httpAuth, httpRouter, logger, catalog }) {
        const maxDepth =
          config.getOptionalNumber('catalog.graph.maxDepth') ??
          Number.POSITIVE_INFINITY;

        const limitEntities =
          config.getOptionalNumber('catalog.graph.limitEntities') ??
          Number.POSITIVE_INFINITY;

        const graphService = new DefaultGraphService({
          catalog,
          maxDepth,
          limitEntities,
        });

        const graphModule = GraphModule.create({
          graphService,
          router: httpRouter,
          httpAuth,
        });

        graphModule.registerRoutes();

        logger.info('registered additional routes for catalog-module-graph');
      },
    });
  },
});
