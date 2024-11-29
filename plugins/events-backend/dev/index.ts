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

import { WinstonLogger } from '@backstage/backend-defaults/rootLogger';
import { createBackend } from '@backstage/backend-defaults';
import {
  coreServices,
  createBackendPlugin,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { mockServices } from '@backstage/backend-test-utils';
import { eventsServiceRef } from '@backstage/plugin-events-node';

function makeBackend(port: number) {
  const backend = createBackend();

  backend.add(
    mockServices.rootConfig.factory({
      data: {
        backend: {
          baseUrl: `http://localhost:${port}`,
          listen: { port },
          database: {
            client: 'pg',
            connection: {
              host: 'localhost',
              port: 5432,
              user: process.env.USER || 'postgres',
            },
          },
        },
      },
    }),
  );
  backend.add(
    createServiceFactory({
      service: coreServices.rootLogger,
      deps: {},
      async factory() {
        return WinstonLogger.create({
          meta: {
            service: 'backstage',
            port,
          },
          // level: 'debug',
          format: WinstonLogger.colorFormat(),
        });
      },
    }),
  );
  backend.add(import('../src/alpha'));

  return backend;
}

const backend7008 = makeBackend(7008);
backend7008.add(
  createBackendPlugin({
    pluginId: 'producer',
    register(reg) {
      reg.registerInit({
        deps: {
          events: eventsServiceRef,
          logger: coreServices.logger,
          rootLifecycle: coreServices.rootLifecycle,
        },
        async init({ events, logger, rootLifecycle }) {
          rootLifecycle.addStartupHook(async () => {
            const publish = () => {
              logger.info(`Publishing event to topic 'test'`);
              events
                .publish({
                  eventPayload: { foo: 'bar' },
                  topic: 'test',
                })
                .catch(error => {
                  logger.error(`Failed to publish event from producer`, error);
                });
            };
            publish();
            setInterval(publish, 10000);
          });
        },
      });
    },
  }),
);
backend7008.start();

const backend7009 = makeBackend(7009);
backend7009.add(
  createBackendPlugin({
    pluginId: 'consumer',
    register(reg) {
      reg.registerInit({
        deps: {
          events: eventsServiceRef,
          logger: coreServices.logger,
        },
        async init({ events, logger }) {
          await events.subscribe({
            id: 'test',
            topics: ['test'],
            async onEvent(event) {
              logger.info(`Received event: ${JSON.stringify(event)}`);
            },
          });
        },
      });
    },
  }),
);
backend7009.start();

const backend7010 = makeBackend(7010);
backend7010.add(
  createBackendPlugin({
    pluginId: 'consumer',
    register(reg) {
      reg.registerInit({
        deps: {
          events: eventsServiceRef,
          logger: coreServices.logger,
        },
        async init({ events, logger }) {
          await events.subscribe({
            id: 'test',
            topics: ['test'],
            async onEvent(event) {
              logger.info(`Received event: ${JSON.stringify(event)}`);
            },
          });
        },
      });
    },
  }),
);
backend7010.start();
