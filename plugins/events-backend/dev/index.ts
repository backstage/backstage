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

const backend = createBackend();

backend.add(import('../src/alpha'));

backend.add(
  createBackendPlugin({
    pluginId: 'producer',
    register(reg) {
      reg.registerInit({
        deps: {
          events: eventsServiceRef,
          logger: coreServices.logger,
        },
        async init({ events, logger }) {
          setInterval(() => {
            logger.info(`Publishing event to topic 'test'`);
            events.publish({
              eventPayload: { foo: 'bar' },
              topic: 'test',
              metadata: { meta: 'baz' },
            });
          }, 5000);
        },
      });
    },
  }),
);

backend.add(
  createBackendPlugin({
    pluginId: 'consumer',
    register(reg) {
      reg.registerInit({
        deps: {
          events: eventsServiceRef,
          logger: coreServices.logger,
        },
        async init({ events, logger }) {
          events.subscribe({
            id: 'test-1',
            topics: ['test'],
            async onEvent(event) {
              logger.info(`Received event: ${JSON.stringify(event, null, 2)}`);
            },
          });
        },
      });
    },
  }),
);

backend.start();
