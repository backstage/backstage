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

import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import {
  TestDatabases,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
import catalogBackend from '@backstage/plugin-catalog-backend';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import request from 'supertest';
import { createMockEntityProvider } from '../__fixtures__/createMockEntityProvider';
import { initializeDatabaseAfterCatalog } from '../database/migrations';
import { createRouter } from './createRouter';
import { parseCursor } from './endpoints/GetEvents.utils';
import { getHistoryConfig } from '../config';

jest.setTimeout(60_000);

describe('createRouter', () => {
  const databases = TestDatabases.create();

  const router = createBackendModule({
    pluginId: 'catalog',
    moduleId: 'test',
    register(reg) {
      reg.registerInit({
        deps: {
          database: coreServices.database,
          httpRouter: coreServices.httpRouter,
          lifecycle: coreServices.lifecycle,
          catalogProcessing: catalogProcessingExtensionPoint,
        },
        async init({ database, httpRouter, lifecycle, catalogProcessing }) {
          const dbPromise = initializeDatabaseAfterCatalog({
            database,
            lifecycle,
            catalogProcessing,
          });
          httpRouter.use(
            await createRouter({
              knexPromise: dbPromise,
              historyConfig: getHistoryConfig(),
              shutdownSignal: new AbortController().signal,
            }),
          );
        },
      });
    },
  });

  it.each(databases.eachSupportedId())(
    'follows the happy path with cursor pagination, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      const provider = createMockEntityProvider();

      const backend = await startTestBackend({
        features: [
          mockServices.database.factory({ knex }),
          mockServices.rootConfig.factory({
            data: { catalog: { processingInterval: { milliseconds: 100 } } },
          }),
          catalogBackend,
          provider,
          router,
        ],
      });
      await provider.ready;

      // Ascending query on empty data gives a response with a cursor
      let response = await request(backend.server).get(
        '/api/catalog/history/v1/events',
      );
      expect(response.status).toBe(202);
      expect(response.body).toEqual({
        items: [],
        pageInfo: { cursor: expect.any(String) },
      });
      expect(parseCursor(response.body.pageInfo.cursor)).toEqual({
        version: 1,
        afterEventId: undefined,
        entityRef: undefined,
        entityId: undefined,
        order: 'asc',
        limit: 100,
        block: false,
      });

      // Descending query on empty data gives a response without a cursor
      response = await request(backend.server)
        .get('/api/catalog/history/v1/events')
        .query({ order: 'desc' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ items: [], pageInfo: {} });

      // Blocking request on empty data blocks
      let blocked = request(backend.server)
        .get('/api/catalog/history/v1/events')
        .query({ block: true })
        .then(r => r);

      // Eventually add an entity
      await new Promise(r => setTimeout(r, 200));
      provider.addEntity({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'foo',
        },
        spec: {
          type: 'service',
          owner: 'me',
          lifecycle: 'experimental',
        },
      });

      // Shortly after adding the entity, the blocking request should resolve
      // with a 202 and a cursor that can be used to follow up
      response = await blocked;
      expect(response.status).toBe(202);
      expect(response.body).toEqual({
        items: [],
        pageInfo: { cursor: expect.any(String) },
      });
      expect(parseCursor(response.body.pageInfo.cursor)).toEqual({
        version: 1,
        afterEventId: undefined,
        entityRef: undefined,
        entityId: undefined,
        order: 'asc',
        limit: 100,
        block: true,
      });

      // Send that same cursor, expect a 200 with that event back and a cursor
      // that points past the returned event
      response = await request(backend.server)
        .get('/api/catalog/history/v1/events')
        .query({ cursor: response.body.pageInfo.cursor });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        items: [
          {
            eventId: '1',
            eventAt: expect.any(String),
            eventType: 'entity_created',
            entityId: expect.any(String),
            entityRef: 'component:default/foo',
            entityJson: expect.objectContaining({
              kind: 'Component',
            }),
            locationRef: 'url:http://mockEntityProvider.com',
          },
        ],
        pageInfo: { cursor: expect.any(String) },
      });
      expect(parseCursor(response.body.pageInfo.cursor)).toEqual({
        version: 1,
        afterEventId: '1',
        entityRef: undefined,
        entityId: undefined,
        order: 'asc',
        limit: 100,
        block: true,
      });

      // Make another request with that cursor, which has retained the blocking
      // flag - expect it to block since the event stream is exhausted
      blocked = request(backend.server)
        .get('/api/catalog/history/v1/events')
        .query({ cursor: response.body.pageInfo.cursor });

      // Eventually modify the previously addded entity
      await new Promise(r => setTimeout(r, 200));
      provider.addEntity({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'foo',
        },
        spec: {
          type: 'service',
          owner: 'you',
          lifecycle: 'experimental',
        },
      });

      // Shortly after modifying the entity, the blocking request should resolve
      // with a 200 and a cursor that can be used to follow up
      response = await blocked;
      expect(response.status).toBe(202);
      expect(response.body).toEqual({
        items: [],
        pageInfo: { cursor: expect.any(String) },
      });
      expect(parseCursor(response.body.pageInfo.cursor)).toEqual({
        version: 1,
        afterEventId: '1',
        entityRef: undefined,
        entityId: undefined,
        order: 'asc',
        limit: 100,
        block: true,
      });

      // Send that same cursor, expect a 200 with that event back and a cursor
      // that points past the returned event
      response = await request(backend.server)
        .get('/api/catalog/history/v1/events')
        .query({ cursor: response.body.pageInfo.cursor });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        items: [
          {
            eventId: '2',
            eventAt: expect.any(String),
            eventType: 'entity_updated',
            entityRef: 'component:default/foo',
            entityId: expect.any(String),
            entityJson: expect.objectContaining({
              kind: 'Component',
            }),
            locationRef: 'url:http://mockEntityProvider.com',
          },
        ],
        pageInfo: { cursor: expect.any(String) },
      });
      expect(parseCursor(response.body.pageInfo.cursor)).toEqual({
        version: 1,
        afterEventId: '2',
        entityRef: undefined,
        entityId: undefined,
        order: 'asc',
        limit: 100,
        block: true,
      });

      // Read in descending order with limit
      response = await request(backend.server)
        .get('/api/catalog/history/v1/events')
        .query({ order: 'desc', limit: 1 });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        items: [
          {
            eventId: '2',
            eventAt: expect.any(String),
            eventType: 'entity_updated',
            entityRef: 'component:default/foo',
            entityId: expect.any(String),
            entityJson: expect.objectContaining({
              kind: 'Component',
            }),
            locationRef: 'url:http://mockEntityProvider.com',
          },
        ],
        pageInfo: { cursor: expect.any(String) },
      });
      expect(parseCursor(response.body.pageInfo.cursor)).toEqual({
        version: 1,
        afterEventId: '2',
        entityRef: undefined,
        entityId: undefined,
        order: 'desc',
        limit: 1,
        block: false,
      });

      // Continue descending read with limit
      response = await request(backend.server)
        .get('/api/catalog/history/v1/events')
        .query({ cursor: response.body.pageInfo.cursor });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        items: [
          {
            eventId: '1',
            eventAt: expect.any(String),
            eventType: 'entity_created',
            entityRef: 'component:default/foo',
            entityId: expect.any(String),
            entityJson: expect.objectContaining({
              kind: 'Component',
            }),
            locationRef: 'url:http://mockEntityProvider.com',
          },
        ],
        pageInfo: { cursor: expect.any(String) },
      });
      expect(parseCursor(response.body.pageInfo.cursor)).toEqual({
        version: 1,
        afterEventId: '1',
        entityRef: undefined,
        entityId: undefined,
        order: 'desc',
        limit: 1,
        block: false,
      });

      // Final descending read with limit, giving no events and no cursor
      response = await request(backend.server)
        .get('/api/catalog/history/v1/events')
        .query({ cursor: response.body.pageInfo.cursor });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ items: [], pageInfo: {} });

      // Read filtering by entity ref, blocking, from last. Since there by
      // definition are no new entities after "last" yet, it immediately returns
      // an empty response and a cursor that is used to make a blocking request
      // for the next data.
      response = await request(backend.server)
        .get('/api/catalog/history/v1/events')
        .query({
          block: true,
          afterEventId: 'last',
          entityRef: 'component:default/foo',
        });
      expect(response.status).toBe(202);
      expect(response.body).toEqual({
        items: [],
        pageInfo: { cursor: expect.any(String) },
      });
      expect(parseCursor(response.body.pageInfo.cursor)).toEqual({
        version: 1,
        afterEventId: '2',
        entityRef: 'component:default/foo',
        entityId: undefined,
        order: 'asc',
        limit: 100,
        block: true,
      });

      // The immediately following request using that cursor should block
      blocked = request(backend.server)
        .get('/api/catalog/history/v1/events')
        .query({ cursor: response.body.pageInfo.cursor })
        .then(r => r);

      // Soon after, remove the entity
      await new Promise(r => setTimeout(r, 2000));
      provider.removeEntity('component:default/foo');

      // Shortly after removing the entity, the blocking request should resolve
      response = await blocked;
      expect(response.status).toBe(202);
      expect(response.body).toEqual({
        items: [],
        pageInfo: { cursor: expect.any(String) },
      });
      expect(parseCursor(response.body.pageInfo.cursor)).toEqual({
        version: 1,
        afterEventId: '2',
        entityRef: 'component:default/foo',
        entityId: undefined,
        order: 'asc',
        limit: 100,
        block: true,
      });

      // And finally reading the deletion event using the same cursor
      response = await request(backend.server)
        .get('/api/catalog/history/v1/events')
        .query({ cursor: response.body.pageInfo.cursor });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        items: [
          {
            eventId: '3',
            eventAt: expect.any(String),
            eventType: 'entity_deleted',
            entityRef: 'component:default/foo',
            entityId: expect.any(String),
            entityJson: expect.objectContaining({
              kind: 'Component',
            }),
            locationRef: 'url:http://mockEntityProvider.com',
          },
        ],
        pageInfo: { cursor: expect.any(String) },
      });
      expect(parseCursor(response.body.pageInfo.cursor)).toEqual({
        version: 1,
        afterEventId: '3',
        entityRef: 'component:default/foo',
        entityId: undefined,
        order: 'asc',
        limit: 100,
        block: true,
      });

      await backend.stop();
    },
  );
});
