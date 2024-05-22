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
import { WebSocket } from 'ws';
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
          // setInterval(() => {
          //   logger.info(`Publishing event to topic 'test'`);
          //   events.publish({
          //     eventPayload: { foo: 'bar' },
          //     topic: 'test',
          //     metadata: { meta: 'baz' },
          //   });
          // }, 5000);
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
          discovery: coreServices.discovery,
          auth: coreServices.auth,
          rootLifecycle: coreServices.rootLifecycle,
        },
        async init({ events, logger, discovery, rootLifecycle, auth }) {
          events.subscribe({
            id: 'test-1',
            topics: ['test'],
            async onEvent(event) {
              logger.info(`Received event: ${JSON.stringify(event, null, 2)}`);
            },
          });

          rootLifecycle.addStartupHook(async () => {
            logger.info('Started!');
            const baseUrl = await discovery.getBaseUrl('events');
            console.log(`DEBUG: baseUrl=`, baseUrl);
            const { token } = await auth.getPluginRequestToken({
              onBehalfOf: await auth.getOwnServiceCredentials(),
              targetPluginId: 'events',
            });

            const subRes = await fetch(`${baseUrl}/hub/subscriptions/123`, {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                topics: ['test'],
              }),
            });
            console.log(
              `DEBUG: sub create req = ${subRes.status} ${subRes.statusText}`,
            );

            const poll = async () => {
              const res = await fetch(
                `${baseUrl}/hub/subscriptions/123/events`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                },
              );

              const data = res.status === 200 && (await res.json());
              console.log(
                `DEBUG: sub poll req = ${res.status} ${res.statusText}`,
                data,
              );
              poll();
            };
            poll();

            setTimeout(() => {
              console.log(`DEBUG: publishing!`);
              fetch(`${baseUrl}/hub/events`, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  topic: 'test',
                  payload: { herp: 'derp' },
                }),
              });
            }, 500);

            const ws = new WebSocket(`${baseUrl}/hub/connect`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            ws.onopen = () => {
              console.log('DEBUG: ws.onopen');
              // ws.send(
              //   JSON.stringify([
              //     'req',
              //     1,
              //     'subscribe',
              //     { id: 'derp', topics: ['test'] },
              //   ]),
              // );
              setTimeout(() => {
                console.log(`DEBUG: publish!`);
                ws.send(
                  JSON.stringify([
                    'req',
                    1,
                    'publish',
                    { topic: 'test', payload: { foo: 'bar' } },
                  ]),
                );
              }, 1000);
            };
            ws.onmessage = event => {
              console.log(`DEBUG: client event=`, event.data);
            };
            ws.onerror = event => {
              console.log(`Client error`, event.error);
            };
          });
        },
      });
    },
  }),
);

backend.start();
