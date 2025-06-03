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

import { createBackend } from '@backstage/backend-defaults';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { eventsServiceRef } from '@backstage/plugin-events-node';
import {
  CATALOG_HISTORY_EVENT_TOPIC,
  CatalogHistoryEventPayload,
} from '../src';

const eventLogger = createBackendPlugin({
  pluginId: 'catalog-history-event-logger',
  register(reg) {
    reg.registerInit({
      deps: {
        logger: coreServices.logger,
        events: eventsServiceRef,
      },
      async init({ logger, events }) {
        await events.subscribe({
          id: 'catalog-history-event-logger',
          topics: [CATALOG_HISTORY_EVENT_TOPIC],
          onEvent: async event => {
            logger.info(
              JSON.stringify(
                event.eventPayload as unknown as CatalogHistoryEventPayload,
                null,
                2,
              ),
            );
          },
        });
      },
    });
  },
});

const backend = createBackend();
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(import('@backstage/plugin-events-backend'));
backend.add(import('../src'));
backend.add(eventLogger);
backend.start();
