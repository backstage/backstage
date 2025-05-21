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
  mockServices,
  startTestBackend,
  TestBackend,
  TestDatabaseId,
  TestDatabases,
} from '@backstage/backend-test-utils';
import catalogBackend from '@backstage/plugin-catalog-backend';
import { Knex } from 'knex';
import waitFor from 'wait-for-expect';
import { createMockEntityProvider } from '../../__fixtures__/createMockEntityProvider';
import { getHistoryConfig } from '../../config';
import { applyDatabaseMigrations } from '../../database/migrations';
import { GetEventsModelImpl } from './GetEvents.model';

jest.setTimeout(60_000);

describe('GetEventsModelImpl', () => {
  const databases = TestDatabases.create();

  // Helper to ensure the catalog is started and our migrations are applied
  async function init(databaseId: TestDatabaseId): Promise<{
    knex: Knex;
    backend: TestBackend;
  }> {
    const knex = await databases.init(databaseId);
    const provider = createMockEntityProvider();
    const backend = await startTestBackend({
      features: [
        mockServices.database.factory({ knex }),
        catalogBackend,
        provider,
      ],
    });
    await provider.ready;
    await applyDatabaseMigrations(knex);
    return { knex, backend };
  }

  // Upserts an enitity into the catalog
  async function setEntity(knex: Knex, name: string, data: number) {
    const ref = `k:ns/${name}`;
    const id = `id-${name}`;

    await knex('refresh_state')
      .insert({
        entity_id: id,
        entity_ref: ref,
        unprocessed_entity: JSON.stringify({ data }),
        errors: '{}',
        last_discovery_at: knex.fn.now(),
        next_update_at: knex.fn.now(),
      })
      .onConflict(['entity_ref'])
      .ignore();

    await knex('final_entities')
      .insert({
        entity_id: id,
        entity_ref: ref,
        stitch_ticket: 'a',
        hash: 'b',
        final_entity: JSON.stringify({ data }),
      })
      .onConflict('entity_id')
      .merge(['final_entity']);
  }

  describe('readEventsNonblocking', () => {
    it.each(databases.eachSupportedId())(
      'reads properly from empty table and then with content, %p',
      async databaseId => {
        const { knex, backend } = await init(databaseId);

        const model = new GetEventsModelImpl({
          knexPromise: Promise.resolve(knex),
          shutdownSignal: new AbortController().signal,
          historyConfig: getHistoryConfig(),
        });

        await waitFor(async () => {
          await expect(
            model.readEventsNonblocking({
              readOptions: { order: 'asc', limit: 10 },
              block: false,
            }),
          ).resolves.toEqual({
            events: [],
            cursor: {
              version: 1,
              order: 'asc',
              limit: 10,
              block: false,
            },
          });
        });

        await setEntity(knex, 'foo', 1);

        await expect(
          model.readEventsNonblocking({
            readOptions: { order: 'asc', limit: 10 },
            block: false,
          }),
        ).resolves.toEqual({
          events: [
            {
              eventId: '1',
              eventType: 'entity_created',
              eventAt: expect.any(Date),
              entityRef: 'k:ns/foo',
              entityId: 'id-foo',
              entityJson: '{"data":1}',
            },
          ],
          cursor: {
            version: 1,
            afterEventId: '1',
            order: 'asc',
            limit: 10,
            block: false,
          },
        });

        await backend.stop();
      },
    );

    it.each(databases.eachSupportedId())(
      'reads reverse with limit and stops when no more data, %p',
      async databaseId => {
        const { knex, backend } = await init(databaseId);

        const model = new GetEventsModelImpl({
          knexPromise: Promise.resolve(knex),
          shutdownSignal: new AbortController().signal,
          historyConfig: getHistoryConfig(),
        });

        await setEntity(knex, 'foo', 1);
        await setEntity(knex, 'foo', 2);
        await setEntity(knex, 'foo', 3);

        await expect(
          model.readEventsNonblocking({
            readOptions: { order: 'desc', limit: 2 },
            block: false,
          }),
        ).resolves.toEqual({
          events: [
            {
              eventId: '3',
              eventType: 'entity_updated',
              eventAt: expect.any(Date),
              entityRef: 'k:ns/foo',
              entityId: 'id-foo',
              entityJson: '{"data":3}',
            },
            {
              eventId: '2',
              eventType: 'entity_updated',
              eventAt: expect.any(Date),
              entityRef: 'k:ns/foo',
              entityId: 'id-foo',
              entityJson: '{"data":2}',
            },
          ],
          cursor: {
            version: 1,
            afterEventId: '2',
            order: 'desc',
            limit: 2,
            block: false,
          },
        });

        await expect(
          model.readEventsNonblocking({
            readOptions: { afterEventId: '2', order: 'desc', limit: 2 },
            block: false,
          }),
        ).resolves.toEqual({
          events: [
            {
              eventId: '1',
              eventType: 'entity_created',
              eventAt: expect.any(Date),
              entityRef: 'k:ns/foo',
              entityId: 'id-foo',
              entityJson: '{"data":1}',
            },
          ],
          cursor: undefined,
        });

        await expect(
          model.readEventsNonblocking({
            readOptions: {
              afterEventId: '2',
              order: 'desc',
              limit: 2,
              entityId: 'wrong',
            },
            block: false,
          }),
        ).resolves.toEqual({
          events: [],
          cursor: undefined,
        });

        await backend.stop();
      },
    );

    it.each(databases.eachSupportedId())(
      'handles the "last" limit properly, %p',
      async databaseId => {
        const { knex, backend } = await init(databaseId);

        const model = new GetEventsModelImpl({
          knexPromise: Promise.resolve(knex),
          shutdownSignal: new AbortController().signal,
          historyConfig: getHistoryConfig(),
        });

        await setEntity(knex, 'foo', 1);
        await setEntity(knex, 'foo', 2);

        await expect(
          model.readEventsNonblocking({
            readOptions: { afterEventId: 'last', order: 'asc', limit: 1 },
            block: true,
          }),
        ).resolves.toEqual({
          events: [],
          cursor: {
            version: 1,
            afterEventId: '2',
            order: 'asc',
            limit: 1,
            block: true,
          },
        });

        await backend.stop();
      },
    );
  });

  describe('blockUntilDataIsReady', () => {
    it.each(databases.eachSupportedId())(
      'resolves when entities are added, %p',
      async databaseId => {
        const { knex, backend } = await init(databaseId);

        const model = new GetEventsModelImpl({
          knexPromise: Promise.resolve(knex),
          shutdownSignal: new AbortController().signal,
          historyConfig: getHistoryConfig({
            overrides: {
              blockDuration: { seconds: 1 },
              blockPollFrequency: { milliseconds: 100 },
            },
          }),
        });

        let resolution: string = '';
        model
          .blockUntilDataIsReady({
            readOptions: {
              order: 'asc',
              limit: 10,
            },
          })
          .then(r => {
            resolution = r;
          });

        // TODO(freben): Use fake timers to speed this up. But it did not play
        // well with the way that these promises work, so left that for later
        await new Promise(r => setTimeout(r, 100));
        expect(resolution).toBe('');

        await setEntity(knex, 'foo', 1);

        await waitFor(() => {
          expect(resolution).toBe('ready');
        });

        await backend.stop();
      },
    );

    it.each(databases.eachSupportedId())(
      'applies filters and times out the rest, %p',
      async databaseId => {
        const { knex, backend } = await init(databaseId);

        const model = new GetEventsModelImpl({
          knexPromise: Promise.resolve(knex),
          shutdownSignal: new AbortController().signal,
          historyConfig: getHistoryConfig({
            overrides: {
              blockDuration: { seconds: 1 },
              blockPollFrequency: { milliseconds: 100 },
            },
          }),
        });

        let resolution1: string = '';
        let resolution2: string = '';
        model
          .blockUntilDataIsReady({
            readOptions: {
              entityRef: 'k:ns/foo1',
              order: 'asc',
              limit: 10,
            },
          })
          .then(r => {
            resolution1 = r;
          });
        model
          .blockUntilDataIsReady({
            readOptions: {
              entityRef: 'k:ns/foo2',
              order: 'asc',
              limit: 10,
            },
          })
          .then(r => {
            resolution2 = r;
          });

        await setEntity(knex, 'foo1', 1);

        await waitFor(() => {
          expect(resolution1).toBe('ready');
          expect(resolution2).toBe('timeout');
        });

        await backend.stop();
      },
    );

    it.each(databases.eachSupportedId())(
      'aborts early on shutdown signal, %p',
      async databaseId => {
        const { knex, backend } = await init(databaseId);

        const abortController = new AbortController();
        const model = new GetEventsModelImpl({
          knexPromise: Promise.resolve(knex),
          shutdownSignal: abortController.signal,
          historyConfig: getHistoryConfig({
            overrides: {
              blockDuration: { seconds: 1 },
              blockPollFrequency: { milliseconds: 100 },
            },
          }),
        });

        let resolution: string = '';
        model
          .blockUntilDataIsReady({
            readOptions: {
              entityRef: 'component:default/foo1',
              order: 'asc',
              limit: 10,
            },
          })
          .then(r => {
            resolution = r;
          });

        abortController.abort();
        await waitFor(() => {
          expect(resolution).toBe('aborted');
        });

        await backend.stop();
      },
    );

    it.each(databases.eachSupportedId())(
      'aborts early on request signal, %p',
      async databaseId => {
        const { knex, backend } = await init(databaseId);

        const model = new GetEventsModelImpl({
          knexPromise: Promise.resolve(knex),
          shutdownSignal: new AbortController().signal, // not used here
          historyConfig: getHistoryConfig({
            overrides: {
              blockDuration: { seconds: 1 },
              blockPollFrequency: { milliseconds: 100 },
            },
          }),
        });

        const abortController = new AbortController();
        let resolution: string = '';
        model
          .blockUntilDataIsReady({
            readOptions: {
              entityRef: 'component:default/foo1',
              order: 'asc',
              limit: 10,
            },
            signal: abortController.signal,
          })
          .then(r => {
            resolution = r;
          });

        abortController.abort();
        await waitFor(() => {
          expect(resolution).toBe('aborted');
        });

        await backend.stop();
      },
    );
  });
});
