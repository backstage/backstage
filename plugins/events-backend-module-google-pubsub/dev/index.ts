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

import { createBackend } from '@backstage/backend-defaults';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { eventsServiceRef } from '@backstage/plugin-events-node';

const backend = createBackend();

backend.add(import('@backstage/plugin-events-backend'));
backend.add(import('../src'));

backend.add(
  createBackendPlugin({
    pluginId: 'example-event-drivers',
    register(reg) {
      reg.registerInit({
        deps: {
          events: eventsServiceRef,
          logger: coreServices.logger,
          scheduler: coreServices.scheduler,
        },
        async init({ events, logger, scheduler }) {
          await events.subscribe({
            id: 'inbox-subscription',
            topics: ['inbox-topic'],
            async onEvent(event) {
              logger.info(
                `Received inbox event: ${JSON.stringify(
                  {
                    topic: event.topic,
                    payload: event.eventPayload,
                    metadata: event.metadata,
                  },
                  null,
                  2,
                )}`,
              );
            },
          });

          await scheduler.scheduleTask({
            id: 'outbox-task',
            scope: 'local',
            frequency: { seconds: 5 },
            timeout: { seconds: 5 },
            fn: async () => {
              await events.publish({
                topic: 'outbox-topic',
                eventPayload: {
                  message: 'Hello, world!',
                },
                metadata: {
                  source: 'outbox-task',
                },
              });
            },
          });
        },
      });
    },
  }),
);

backend.start();
