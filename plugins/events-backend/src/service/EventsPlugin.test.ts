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
  TestBackend,
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
      .type('application/json')
      .timeout(1000)
      .send(JSON.stringify({ test: 'fake' }));
    expect(response1.status).toBe(202);

    const response2 = await request(server)
      .post('/api/events/http/fake-ext')
      .type('application/json')
      .timeout(1000)
      .send(JSON.stringify({ test: 'fake-ext' }));
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
    class ReqHelper {
      constructor(private readonly backend: TestBackend) {}

      subscribe(id: string, topics: string[], options?: { auth?: string }) {
        return request(this.backend.server)
          .put(`/api/events/bus/v1/subscriptions/${id}`)
          .set(
            'authorization',
            options?.auth ?? mockCredentials.service.header(),
          )
          .send({ topics });
      }

      publish(
        topic: string,
        payload: unknown,
        options?: { notifiedSubscribers?: string[] },
      ) {
        return request(this.backend.server)
          .post('/api/events/bus/v1/events')
          .set('authorization', mockCredentials.service.header())
          .send({
            event: { topic, payload },
            notifiedSubscribers: options?.notifiedSubscribers,
          });
      }

      readEvents(id: string) {
        return request(this.backend.server)
          .get(`/api/events/bus/v1/subscriptions/${id}/events`)
          .set('authorization', mockCredentials.service.header())
          .send();
      }
    }

    const databases = TestDatabases.create({
      ids: ['SQLITE_3', 'MYSQL_8', 'POSTGRES_13', 'POSTGRES_17'],
    });

    async function mockKnexFactory(databaseId: TestDatabaseId) {
      const knex = await databases.init(databaseId);
      return mockServices.database.factory({ knex });
    }

    let backend: TestBackend | undefined = undefined;
    afterEach(async () => {
      if (backend) {
        await backend.stop();
        backend = undefined;
      }
    });

    it.each(databases.eachSupportedId())(
      'should be possible to publish events as a service, %p',
      async databaseId => {
        backend = await startTestBackend({
          features: [eventsPlugin, await mockKnexFactory(databaseId)],
        });
        const helper = new ReqHelper(backend);

        await helper
          .publish('test', { n: 1 })
          .set('authorization', mockCredentials.none.header())
          .expect(401);

        await helper
          .publish('test', { n: 1 })
          .set('authorization', mockCredentials.user.header())
          .expect(403);

        await helper
          .publish('test', { n: 1 })
          .set('authorization', mockCredentials.service.header())
          .expect(204); // 204, since there are no subscribers
      },
    );

    it.each(databases.eachSupportedId())(
      'should be possible to subscribe as a service and receive an event, %p',
      async databaseId => {
        backend = await startTestBackend({
          features: [eventsPlugin, await mockKnexFactory(databaseId)],
        });
        const helper = new ReqHelper(backend);

        await helper
          .subscribe('tester', ['test'])
          .set('authorization', mockCredentials.none.header())
          .expect(401);

        await helper
          .subscribe('tester', ['test'])
          .set('authorization', mockCredentials.user.header())
          .expect(403);

        await helper.subscribe('tester', ['test']).expect(201);

        await helper
          .readEvents('tester')
          .set('authorization', mockCredentials.none.header())
          .expect(401);

        await helper
          .readEvents('tester')
          .set('authorization', mockCredentials.user.header())
          .expect(403);

        await helper.publish('test', { n: 1 }).expect(201); // 201, since there is a subscriber

        await helper.readEvents('tester').expect(200, {
          events: [{ topic: 'test', payload: { n: 1 } }],
        });
      },
    );

    it.each(databases.eachSupportedId())(
      'should only send an event for each subscriber once, %p',
      async databaseId => {
        backend = await startTestBackend({
          features: [eventsPlugin, await mockKnexFactory(databaseId)],
        });
        const helper = new ReqHelper(backend);

        // 2 subscribers
        await helper.subscribe('tester-1', ['test']).expect(201);
        await helper.subscribe('tester-2', ['test']).expect(201);

        // A single event
        await helper.publish('test', { n: 1 }).expect(201);

        // Single client for subscriber 1 gets the event
        await helper.readEvents('tester-1').expect(200, {
          events: [{ topic: 'test', payload: { n: 1 } }],
        });

        // Two clients for subscriber 2, only one gets the event
        const res1 = helper.readEvents('tester-2');
        const res2 = helper.readEvents('tester-2');

        const res = await Promise.race([res1, res2]);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          events: [{ topic: 'test', payload: { n: 1 } }],
        });

        // Post another event, which triggers the other client to return
        await helper.publish('test', { n: 2 }).expect(201);

        const otherRes = await Promise.all([res1, res2]).then(rs =>
          rs.find(r => r !== res),
        );
        expect(otherRes?.status).toBe(202);

        // Reading subscriber 2 should now return the second event only
        await helper.readEvents('tester-2').expect(200, {
          events: [{ topic: 'test', payload: { n: 2 } }],
        });
      },
    );

    it.each(databases.eachSupportedId())(
      'should not notify subscribers that have already consumed the event, %p',
      async databaseId => {
        backend = await startTestBackend({
          features: [eventsPlugin, await mockKnexFactory(databaseId)],
        });
        const helper = new ReqHelper(backend);

        // 2 subscribers
        await helper.subscribe('tester-1', ['test']).expect(201);
        await helper.subscribe('tester-2', ['test']).expect(201);

        // A single event for each subscriber, that should not be sent to the other one
        await helper
          .publish(
            'test',
            { for: 'tester-2' },
            {
              notifiedSubscribers: ['tester-1'],
            },
          )
          .expect(201);
        await helper
          .publish(
            'test',
            { for: 'tester-1' },
            {
              notifiedSubscribers: ['tester-2'],
            },
          )
          .expect(201);

        // Single client for subscriber 1 gets the event
        await helper.readEvents('tester-1').expect(200, {
          events: [{ topic: 'test', payload: { for: 'tester-1' } }],
        });
        // Single client for subscriber 2 gets the event
        await helper.readEvents('tester-2').expect(200, {
          events: [{ topic: 'test', payload: { for: 'tester-2' } }],
        });
      },
    );

    it.each(databases.eachSupportedId())(
      'should return multiple events in order, %p',
      async databaseId => {
        backend = await startTestBackend({
          features: [eventsPlugin, await mockKnexFactory(databaseId)],
        });
        const helper = new ReqHelper(backend);

        // 2 subscribers
        await helper.subscribe('tester', ['test']).expect(201);

        // A sequence of events published one at a time
        for (let n = 0; n < 15; ++n) {
          await helper.publish('test', { n }).expect(201);
        }

        // Batch size it 10
        await helper.readEvents('tester').expect(200, {
          events: [
            { topic: 'test', payload: { n: 0 } },
            { topic: 'test', payload: { n: 1 } },
            { topic: 'test', payload: { n: 2 } },
            { topic: 'test', payload: { n: 3 } },
            { topic: 'test', payload: { n: 4 } },
            { topic: 'test', payload: { n: 5 } },
            { topic: 'test', payload: { n: 6 } },
            { topic: 'test', payload: { n: 7 } },
            { topic: 'test', payload: { n: 8 } },
            { topic: 'test', payload: { n: 9 } },
          ],
        });

        await helper.readEvents('tester').expect(200, {
          events: [
            { topic: 'test', payload: { n: 10 } },
            { topic: 'test', payload: { n: 11 } },
            { topic: 'test', payload: { n: 12 } },
            { topic: 'test', payload: { n: 13 } },
            { topic: 'test', payload: { n: 14 } },
          ],
        });
      },
    );

    it.each(databases.eachSupportedId())(
      'should skip publishing if all subscribers have already consumed the event, %p',
      async databaseId => {
        backend = await startTestBackend({
          features: [eventsPlugin, await mockKnexFactory(databaseId)],
        });
        const helper = new ReqHelper(backend);

        await helper.subscribe('tester', ['test']).expect(201);

        await helper
          .publish(
            'test',
            { for: 'tester-2' },
            { notifiedSubscribers: ['tester'] },
          )
          .expect(204);
      },
    );

    it.each(databases.eachSupportedId())(
      'should time out when no events are available, %p',
      async databaseId => {
        backend = await startTestBackend({
          features: [eventsPlugin, await mockKnexFactory(databaseId)],
        });
        const helper = new ReqHelper(backend);
        await helper.subscribe('tester', ['test']).expect(201);

        jest.useFakeTimers({
          advanceTimers: true,
        });

        try {
          // Can't use supertest for this one because it can't handle the partially blocking response
          const res = await fetch(
            `http://localhost:${backend.server.port()}/api/events/bus/v1/subscriptions/tester/events`,
            {
              headers: {
                authorization: mockCredentials.service.header(),
              },
            },
          );

          expect(res.status).toBe(202);

          const reader = res.body!.getReader();
          const isClosed = () =>
            Promise.race([
              reader
                .read()
                .then(() => reader.closed)
                .then(() => true),
              new Promise<boolean>(r => setTimeout(r, 100, false)),
            ]);

          await expect(isClosed()).resolves.toBe(false);
          await jest.advanceTimersByTimeAsync(30000);
          await expect(isClosed()).resolves.toBe(false);
          await jest.advanceTimersByTimeAsync(30000);
          await expect(isClosed()).resolves.toBe(true);
        } finally {
          jest.useRealTimers();
        }
      },
    );

    it.each(databases.eachSupportedId())(
      'should refuse listen without a subscription, %p',
      async databaseId => {
        backend = await startTestBackend({
          features: [eventsPlugin, await mockKnexFactory(databaseId)],
        });
        const helper = new ReqHelper(backend);

        await helper.readEvents('nonexistent').expect(404);
      },
    );
  });
});
