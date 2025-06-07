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

import { TestDatabases } from '@backstage/backend-test-utils';
import { Knex } from 'knex';
import waitFor from 'wait-for-expect';
import { createMockChangeListener } from '../../__fixtures__/createMockChangeListener';
import { initEmptyDatabase } from '../../__fixtures__/initEmptyDatabase';
import { sleep } from '../../helpers';
import { GetEventsModelImpl } from './GetEvents.model';

jest.setTimeout(60_000);

describe('GetEventsModelImpl', () => {
  const databases = TestDatabases.create();

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

  describe('getEvents', () => {
    it.each(databases.eachSupportedId())(
      'reads properly from empty table and then with content, %p',
      async databaseId => {
        const { knex, shutdown } = await initEmptyDatabase(
          databases,
          databaseId,
        );

        const model = new GetEventsModelImpl({
          knexPromise: Promise.resolve(knex),
          changeListener: createMockChangeListener(),
        });

        await expect(
          model.getEvents({
            readOptions: { order: 'asc', limit: 10 },
            block: false,
            signal: new AbortController().signal,
          }),
        ).resolves.toEqual({
          type: 'data',
          events: [],
          cursor: {
            version: 1,
            order: 'asc',
            limit: 10,
            block: false,
          },
        });

        await setEntity(knex, 'foo', 1);

        await expect(
          model.getEvents({
            readOptions: { order: 'asc', limit: 10 },
            block: false,
            signal: new AbortController().signal,
          }),
        ).resolves.toEqual({
          type: 'data',
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

        await shutdown();
      },
    );

    it.each(databases.eachSupportedId())(
      'reads reverse with limit and stops when no more data, %p',
      async databaseId => {
        const { knex, shutdown } = await initEmptyDatabase(
          databases,
          databaseId,
        );

        const model = new GetEventsModelImpl({
          knexPromise: Promise.resolve(knex),
          changeListener: createMockChangeListener(),
        });

        await setEntity(knex, 'foo', 1);
        await setEntity(knex, 'foo', 2);
        await setEntity(knex, 'foo', 3);

        await expect(
          model.getEvents({
            readOptions: { order: 'desc', limit: 2 },
            block: false,
            signal: new AbortController().signal,
          }),
        ).resolves.toEqual({
          type: 'data',
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
          model.getEvents({
            readOptions: { afterEventId: '2', order: 'desc', limit: 2 },
            block: false,
            signal: new AbortController().signal,
          }),
        ).resolves.toEqual({
          type: 'data',
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
          model.getEvents({
            readOptions: {
              afterEventId: '2',
              order: 'desc',
              limit: 2,
              entityId: 'wrong',
            },
            block: false,
            signal: new AbortController().signal,
          }),
        ).resolves.toEqual({
          type: 'data',
          events: [],
          cursor: undefined,
        });

        await shutdown();
      },
    );

    it.each(databases.eachSupportedId())(
      'handles the "last" limit properly, %p',
      async databaseId => {
        const { knex, shutdown } = await initEmptyDatabase(
          databases,
          databaseId,
        );

        const model = new GetEventsModelImpl({
          knexPromise: Promise.resolve(knex),
          changeListener: createMockChangeListener(),
        });

        await setEntity(knex, 'foo', 1);
        await setEntity(knex, 'foo', 2);

        await expect(
          model.getEvents({
            readOptions: { afterEventId: 'last', order: 'asc', limit: 1 },
            block: true,
            signal: new AbortController().signal,
          }),
        ).resolves.toEqual({
          type: 'block',
          wait: expect.any(Function),
          cursor: {
            version: 1,
            afterEventId: '2',
            order: 'asc',
            limit: 1,
            block: true,
          },
        });

        await shutdown();
      },
    );

    it.each(databases.eachSupportedId())(
      'resolves when entities are added, %p',
      async databaseId => {
        const { knex, shutdown } = await initEmptyDatabase(
          databases,
          databaseId,
        );

        const model = new GetEventsModelImpl({
          knexPromise: Promise.resolve(knex),
          changeListener: createMockChangeListener(),
        });

        let resolution: string = '';
        const result = await model.getEvents({
          readOptions: {
            order: 'asc',
            limit: 10,
          },
          block: true,
          signal: new AbortController().signal,
        });
        expect(result).toEqual({
          type: 'block',
          wait: expect.any(Function),
          cursor: {
            version: 1,
            order: 'asc',
            limit: 10,
            block: true,
          },
        });
        (result as { wait: () => Promise<string> }).wait().then(r => {
          resolution = r;
        });

        // TODO(freben): Use fake timers to speed this up. But it did not play
        // well with the way that these promises work, so left that for later
        await sleep({ milliseconds: 100 });
        expect(resolution).toBe('');

        await setEntity(knex, 'foo', 1);

        await waitFor(() => {
          expect(resolution).toBe('ready');
        });

        await shutdown();
      },
    );

    it.each(databases.eachSupportedId())(
      'applies filters and times out the rest, %p',
      async databaseId => {
        const { knex, shutdown } = await initEmptyDatabase(
          databases,
          databaseId,
        );

        const model = new GetEventsModelImpl({
          knexPromise: Promise.resolve(knex),
          changeListener: createMockChangeListener({
            timeout: { seconds: 1 },
          }),
        });

        let resolution1: string = '';
        let resolution2: string = '';
        let result = await model.getEvents({
          readOptions: {
            entityRef: 'k:ns/foo1',
            order: 'asc',
            limit: 10,
          },
          block: true,
          signal: new AbortController().signal,
        });
        expect(result).toEqual({
          type: 'block',
          wait: expect.any(Function),
          cursor: {
            version: 1,
            entityRef: 'k:ns/foo1',
            order: 'asc',
            limit: 10,
            block: true,
          },
        });
        (result as { wait: () => Promise<string> }).wait().then(r => {
          resolution1 = r;
        });

        result = await model.getEvents({
          readOptions: {
            entityRef: 'k:ns/foo2',
            order: 'asc',
            limit: 10,
          },
          block: true,
          signal: new AbortController().signal,
        });
        expect(result).toEqual({
          type: 'block',
          wait: expect.any(Function),
          cursor: {
            version: 1,
            entityRef: 'k:ns/foo2',
            order: 'asc',
            limit: 10,
            block: true,
          },
        });
        (result as { wait: () => Promise<string> }).wait().then(r => {
          resolution2 = r;
        });

        await setEntity(knex, 'foo1', 1);

        await waitFor(() => {
          expect(resolution1).toBe('ready');
          expect(resolution2).toBe('timeout');
        });

        await shutdown();
      },
    );

    it.each(databases.eachSupportedId())(
      'aborts early on request signal, %p',
      async databaseId => {
        const { knex, shutdown } = await initEmptyDatabase(
          databases,
          databaseId,
        );

        const model = new GetEventsModelImpl({
          knexPromise: Promise.resolve(knex),
          changeListener: createMockChangeListener(),
        });

        const abortController = new AbortController();
        let resolution: string = '';
        const result = await model.getEvents({
          readOptions: {
            entityRef: 'component:default/foo1',
            order: 'asc',
            limit: 10,
          },
          block: true,
          signal: abortController.signal,
        });
        expect(result).toEqual({
          type: 'block',
          wait: expect.any(Function),
          cursor: {
            version: 1,
            order: 'asc',
            entityRef: 'component:default/foo1',
            limit: 10,
            block: true,
          },
        });
        (result as { wait: () => Promise<string> }).wait().then(r => {
          resolution = r;
        });

        abortController.abort();
        await waitFor(() => {
          expect(resolution).toBe('aborted');
        });

        await shutdown();
      },
    );
  });
});
