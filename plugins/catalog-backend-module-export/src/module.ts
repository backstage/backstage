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
import { createRouter } from './router/router';

export const catalogModuleExport = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'export',
  register(reg) {
    reg.registerInit({
      deps: {
        logger: coreServices.logger,
        httpRouter: coreServices.httpRouter,
        catalog: catalogServiceRef,
        httpAuth: coreServices.httpAuth,
        config: coreServices.rootConfig,
      },
      async init({ logger, httpRouter, catalog, httpAuth, config }) {
        logger.info('Initializing catalog-export backend');

        const router = createRouter({
          logger,
          catalogApi: catalog,
          httpAuth,
          config,
        });

        httpRouter.use(router);
      },
    });
  },
});
