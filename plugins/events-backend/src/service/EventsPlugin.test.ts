/*
 * Copyright 2022 The Backstage Authors
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
  createBackendModule,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { eventsServiceRef } from '@backstage/plugin-events-node';
import { eventsExtensionPoint } from '@backstage/plugin-events-node/alpha';
import { TestEventsService } from '@backstage/plugin-events-backend-test-utils';
import request from 'supertest';
import { eventsPlugin } from './EventsPlugin';

describe('eventsPlugin', () => {
  it('should be initialized properly', async () => {
    const eventsService = new TestEventsService();
    const eventsServiceFactory = createServiceFactory({
      service: eventsServiceRef,
      deps: {},
      async factory({}) {
        return eventsService;
      },
    });

    const testModule = createBackendModule({
      pluginId: 'events',
      moduleId: 'test',
      register(env) {
        env.registerInit({
          deps: {
            events: eventsExtensionPoint,
          },
          async init({ events }) {
            events.addHttpPostIngress({
              topic: 'fake-ext',
            });
          },
        });
      },
    });

    const { server } = await startTestBackend({
      extensionPoints: [],
      features: [
        eventsServiceFactory(),
        eventsPlugin(),
        testModule(),
        mockServices.logger.factory(),
        mockServices.rootConfig.factory({
          data: {
            events: {
              http: {
                topics: ['fake'],
              },
            },
          },
        }),
      ],
    });

    const response1 = await request(server)
      .post('/api/events/http/fake')
      .timeout(1000)
      .send({ test: 'fake' });
    expect(response1.status).toBe(202);

    const response2 = await request(server)
      .post('/api/events/http/fake-ext')
      .timeout(1000)
      .send({ test: 'fake-ext' });
    expect(response2.status).toBe(202);

    expect(eventsService.published).toHaveLength(2);
    expect(eventsService.published[0].topic).toEqual('fake');
    expect(eventsService.published[0].eventPayload).toEqual({ test: 'fake' });
    expect(eventsService.published[1].topic).toEqual('fake-ext');
    expect(eventsService.published[1].eventPayload).toEqual({
      test: 'fake-ext',
    });
  });
});
