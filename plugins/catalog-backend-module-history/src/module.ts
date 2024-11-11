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
import { connectConsumers } from './consumers/connectConsumers';
import { HistoryConsumer } from './consumers/types';
import { initializeDatabaseAfterCatalog } from './database/migrations';
import { historyConsumersExtensionPoint } from './extensions';
import { createRouter } from './service/createRouter';

/**
 * The history module for the catalog backend.
 *
 * @public
 */
export const catalogModuleHistory = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'history',
  register(reg) {
    const consumers: HistoryConsumer[] = [];

    reg.registerExtensionPoint(historyConsumersExtensionPoint, {
      addConsumer(consumer) {
        for (const previous of consumers) {
          if (previous.getConsumerName() === consumer.getConsumerName()) {
            throw new Error(
              `Consumer with name '${consumer.getConsumerName()}' already exists`,
            );
          }
        }
        consumers.push(consumer);
      },
    });

    reg.registerInit({
      deps: {
        database: coreServices.database,
        httpRouter: coreServices.httpRouter,
        lifecycle: coreServices.lifecycle,
        catalogProcessing: catalogProcessingExtensionPoint,
      },
      async init({ database, httpRouter, lifecycle, catalogProcessing }) {
        // We can't await this call here, since we have to perform our own work
        // after the catalog has already spun up and is ready
        const dbPromise = initializeDatabaseAfterCatalog({
          database,
          lifecycle,
          catalogProcessing,
        });

        const controller = new AbortController();
        lifecycle.addShutdownHook(() => {
          controller.abort();
        });

        dbPromise.then(knex =>
          connectConsumers({
            consumers,
            knex,
            signal: controller.signal,
          }),
        );

        httpRouter.use(
          await createRouter({
            knexPromise: dbPromise,
            signal: controller.signal,
          }),
        );
      },
    });
  },
});
