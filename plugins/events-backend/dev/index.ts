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
import { DefaultApiClient } from '../../events-node/src/generated';

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

            const client = new DefaultApiClient({ discoveryApi: discovery });
            const baseUrl = await discovery.getBaseUrl('events');
            console.log(`DEBUG: baseUrl=`, baseUrl);
            const { token } = await auth.getPluginRequestToken({
              onBehalfOf: await auth.getOwnServiceCredentials(),
              targetPluginId: 'events',
            });

            const subRes = await client.putSubscription(
              {
                path: { subscriptionId: '123' },
                body: { topics: ['test'] },
              },
              { token },
            );
            console.log(
              `DEBUG: sub create req = ${subRes.status} ${subRes.statusText}`,
            );
            const subRes2 = await client.putSubscription(
              {
                path: { subscriptionId: 'abc' },
                body: { topics: ['test'] },
              },
              { token },
            );
            console.log(
              `DEBUG: sub create req = ${subRes2.status} ${subRes2.statusText}`,
            );

            const poll = async () => {
              const res = await client.getSubscriptionEvents(
                {
                  path: { subscriptionId: '123' },
                },
                { token },
              );

              const data = res.status === 200 && (await res.json());
              console.log(
                `DEBUG: sub poll req = ${res.status} ${res.statusText}`,
                data,
              );
              poll();
            };
            poll();

            const poll2 = async () => {
              const res = await client.getSubscriptionEvents(
                {
                  path: { subscriptionId: 'abc' },
                },
                { token },
              );

              const data = res.status === 200 && (await res.json());
              console.log(
                `DEBUG: sub poll2 req = ${res.status} ${res.statusText}`,
                data,
              );
              poll2();
            };
            poll2();

            setTimeout(() => {
              console.log(`DEBUG: publishing!`);
              client.postEvent(
                {
                  body: {
                    event: { topic: 'test', payload: { foo: 'bar' } },
                    subscriptionIds: ['123'],
                  },
                },
                { token },
              );
            }, 500);
          });
        },
      });
    },
  }),
);

backend.start();
