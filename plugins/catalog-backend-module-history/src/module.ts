/*
 * Copyright 2024 The Backstage Authors
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
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { HistoryJanitor } from './database/HistoryJanitor';
import { initializeDatabaseAfterCatalog } from './database/migrations';
import { createRouter } from './service/createRouter';
import { getHistoryConfig } from './config';

/**
 * The history module for the catalog backend.
 *
 * @public
 */
export const catalogModuleHistory = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'history',
  register(reg) {
    reg.registerInit({
      deps: {
        config: coreServices.rootConfig,
        database: coreServices.database,
        httpRouter: coreServices.httpRouter,
        lifecycle: coreServices.lifecycle,
        scheduler: coreServices.scheduler,
        catalogProcessing: catalogProcessingExtensionPoint,
      },
      async init({
        config,
        database,
        httpRouter,
        lifecycle,
        scheduler,
        catalogProcessing,
      }) {
        // We can't await this call here, since we have to perform our own work
        // after the catalog has already spun up and is ready
        const knexPromise = initializeDatabaseAfterCatalog({
          database,
          lifecycle,
          catalogProcessing,
        });

        const historyConfig = getHistoryConfig({ config });

        const controller = new AbortController();
        lifecycle.addShutdownHook(() => {
          controller.abort();
        });

        await HistoryJanitor.create({
          knexPromise,
          historyConfig,
          scheduler,
        });

        httpRouter.use(
          await createRouter({
            knexPromise,
            historyConfig,
            shutdownSignal: controller.signal,
          }),
        );
      },
    });
  },
});
