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

/* eslint-disable jest/expect-expect */

import {
  createBackendModule,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import {
  TestDatabaseId,
  TestDatabases,
  mockCredentials,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
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
        eventsServiceFactory,
        eventsPlugin,
        testModule,
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

  describe('event bus', () => {
    const databases = TestDatabases.create({
      ids: ['SQLITE_3', 'POSTGRES_9', 'POSTGRES_13', 'POSTGRES_16'],
    });

    async function mockKnexFactory(databaseId: TestDatabaseId) {
      const knex = await databases.init(databaseId);
      return mockServices.database.mock({
        getClient: async () => knex,
      }).factory;
    }

    it.each(databases.eachSupportedId())(
      'should be possible to publish events as a service, %p',
      async databaseId => {
        const backend = await startTestBackend({
          features: [eventsPlugin(), await mockKnexFactory(databaseId)],
        });
        const { server } = backend;

        await request(server)
          .post('/api/events/bus/v1/events')
          .set('authorization', mockCredentials.none.header())
          .send({ event: { topic: 'test', payload: { n: 1 } } })
          .expect(401);

        await request(server)
          .post('/api/events/bus/v1/events')
          .set('authorization', mockCredentials.user.header())
          .send({ event: { topic: 'test', payload: { n: 1 } } })
          .expect(403);

        await request(server)
          .post('/api/events/bus/v1/events')
          .set('authorization', mockCredentials.service.header())
          .send({ event: { topic: 'test', payload: { n: 1 } } })
          .expect(204); // 204, since there are no subscribers

        await backend.stop();
      },
    );

    it.each(databases.eachSupportedId())(
      'should be possible to subscribe as a service and receive an event, %p',
      async databaseId => {
        const backend = await startTestBackend({
          features: [eventsPlugin(), await mockKnexFactory(databaseId)],
        });
        const { server } = backend;

        await request(server)
          .put('/api/events/bus/v1/subscriptions/tester')
          .set('authorization', mockCredentials.none.header())
          .send({ topics: ['test'] })
          .expect(401);

        await request(server)
          .put('/api/events/bus/v1/subscriptions/tester')
          .set('authorization', mockCredentials.user.header())
          .send({ topics: ['test'] })
          .expect(403);

        await request(server)
          .put('/api/events/bus/v1/subscriptions/tester')
          .set('authorization', mockCredentials.service.header())
          .send({ topics: ['test'] })
          .expect(201);

        await request(server)
          .get('/api/events/bus/v1/subscriptions/tester/events')
          .set('authorization', mockCredentials.none.header())
          .send({ topics: ['test'] })
          .expect(401);

        await request(server)
          .get('/api/events/bus/v1/subscriptions/tester/events')
          .set('authorization', mockCredentials.user.header())
          .send({ topics: ['test'] })
          .expect(403);

        await request(server)
          .post('/api/events/bus/v1/events')
          .set('authorization', mockCredentials.service.header())
          .send({ event: { topic: 'test', payload: { n: 1 } } })
          .expect(201); // 201, since there is a subscriber

        await request(server)
          .get('/api/events/bus/v1/subscriptions/tester/events')
          .set('authorization', mockCredentials.service.header())
          .send({ topics: ['test'] })
          .expect(200, {
            events: [{ topic: 'test', payload: { n: 1 } }],
          });

        await backend.stop();
      },
    );

    it.each(databases.eachSupportedId())(
      'should only send an event for each subscriber once, %p',
      async databaseId => {
        const backend = await startTestBackend({
          features: [eventsPlugin(), await mockKnexFactory(databaseId)],
        });
        const { server } = backend;

        // 2 subscribers
        await request(server)
          .put('/api/events/bus/v1/subscriptions/tester-1')
          .set('authorization', mockCredentials.service.header())
          .send({ topics: ['test'] })
          .expect(201);
        await request(server)
          .put('/api/events/bus/v1/subscriptions/tester-2')
          .set('authorization', mockCredentials.service.header())
          .send({ topics: ['test'] })
          .expect(201);

        // A single event
        await request(server)
          .post('/api/events/bus/v1/events')
          .set('authorization', mockCredentials.service.header())
          .send({ event: { topic: 'test', payload: { n: 1 } } })
          .expect(201);

        // Single client for subscriber 1 gets the event
        await request(server)
          .get('/api/events/bus/v1/subscriptions/tester-1/events')
          .set('authorization', mockCredentials.service.header())
          .send({ topics: ['test'] })
          .expect(200, {
            events: [{ topic: 'test', payload: { n: 1 } }],
          });

        // Two clients for subscriber 2, only one  gets the event
        const res1 = request(server)
          .get('/api/events/bus/v1/subscriptions/tester-2/events')
          .set('authorization', mockCredentials.service.header())
          .send({ topics: ['test'] });
        const res2 = request(server)
          .get('/api/events/bus/v1/subscriptions/tester-2/events')
          .set('authorization', mockCredentials.service.header())
          .send({ topics: ['test'] });

        const res = await Promise.race([res1, res2]);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          events: [{ topic: 'test', payload: { n: 1 } }],
        });

        // Post another event, which triggers the other client to return
        await request(server)
          .post('/api/events/bus/v1/events')
          .set('authorization', mockCredentials.service.header())
          .send({ event: { topic: 'test', payload: { n: 2 } } })
          .expect(201);

        const otherRes = await Promise.all([res1, res2]).then(rs =>
          rs.find(r => r !== res),
        );
        expect(otherRes?.status).toBe(202);

        // Reading subscriber 2 should now return the second event only
        await request(server)
          .get('/api/events/bus/v1/subscriptions/tester-2/events')
          .set('authorization', mockCredentials.service.header())
          .send({ topics: ['test'] })
          .expect(200, {
            events: [{ topic: 'test', payload: { n: 2 } }],
          });

        await backend.stop();
      },
    );
  });
});
