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
import { getHistoryConfig } from '../../config';
import { ackHistorySubscription } from '../../database/operations/ackHistorySubscription';
import { upsertHistorySubscription } from '../../database/operations/upsertHistorySubscription';
import { ReadSubscriptionModelImpl } from './ReadSubscription.model';

jest.setTimeout(60_000);

describe('ReadSubscriptionModelImpl', () => {
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

  describe('readSubscription', () => {
    it.each(databases.eachSupportedId())(
      'reads properly from empty table and then with content without blocking, %p',
      async databaseId => {
        const { knex, shutdown } = await initEmptyDatabase(
          databases,
          databaseId,
        );

        const model = new ReadSubscriptionModelImpl({
          knexPromise: Promise.resolve(knex),
          historyConfig: getHistoryConfig(),
          changeListener: createMockChangeListener(),
        });

        await expect(
          model.readSubscription({
            readOptions: { subscriptionId: '1', limit: 10, block: false },
            signal: new AbortController().signal,
          }),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
          `"Subscription 1 not found"`,
        );

        await knex('history_subscriptions').insert({
          subscription_id: '1',
          state: 'idle',
          last_sent_event_id: '0',
          last_acknowledged_event_id: '0',
        });

        await expect(
          model.readSubscription({
            readOptions: { subscriptionId: '1', limit: 10, block: false },
            signal: new AbortController().signal,
          }),
        ).resolves.toEqual({
          type: 'empty',
        });

        await setEntity(knex, 'foo', 1);

        await expect(
          model.readSubscription({
            readOptions: { subscriptionId: '1', limit: 10, block: false },
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
          ackId: expect.any(String),
        });

        await shutdown();
      },
    );

    it.each(databases.eachSupportedId())(
      'handles the limit properly, %p',
      async databaseId => {
        const { knex, shutdown } = await initEmptyDatabase(
          databases,
          databaseId,
        );

        const model = new ReadSubscriptionModelImpl({
          knexPromise: Promise.resolve(knex),
          historyConfig: getHistoryConfig(),
          changeListener: createMockChangeListener(),
        });

        await setEntity(knex, 'foo', 1);
        await setEntity(knex, 'foo', 2);
        await upsertHistorySubscription(knex, {
          subscriptionId: '1',
          afterEventId: '0',
        });

        let result = await model.readSubscription({
          readOptions: { subscriptionId: '1', limit: 1, block: true },
          signal: new AbortController().signal,
        });
        expect(result).toEqual({
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
          ackId: expect.any(String),
        });

        await ackHistorySubscription(knex, {
          subscriptionId: '1',
          ackId: (result as any).ackId,
        });

        result = await model.readSubscription({
          readOptions: { subscriptionId: '1', limit: 1, block: true },
          signal: new AbortController().signal,
        });
        expect(result).toEqual({
          type: 'data',
          events: [
            {
              eventId: '2',
              eventType: 'entity_updated',
              eventAt: expect.any(Date),
              entityRef: 'k:ns/foo',
              entityId: 'id-foo',
              entityJsonBefore: '{"data":1}',
              entityJson: '{"data":2}',
            },
          ],
          ackId: expect.any(String),
        });

        await ackHistorySubscription(knex, {
          subscriptionId: '1',
          ackId: (result as any).ackId,
        });

        result = await model.readSubscription({
          readOptions: { subscriptionId: '1', limit: 1, block: true },
          signal: new AbortController().signal,
        });
        expect(result).toEqual({
          type: 'block',
          wait: expect.any(Function),
        });

        await setEntity(knex, 'foo', 3);

        await expect((result as any).wait()).resolves.toBe('ready');

        result = await model.readSubscription({
          readOptions: { subscriptionId: '1', limit: 1, block: true },
          signal: new AbortController().signal,
        });
        expect(result).toEqual({
          type: 'data',
          events: [
            {
              eventId: '3',
              eventType: 'entity_updated',
              eventAt: expect.any(Date),
              entityRef: 'k:ns/foo',
              entityId: 'id-foo',
              entityJsonBefore: '{"data":2}',
              entityJson: '{"data":3}',
            },
          ],
          ackId: expect.any(String),
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

        const model = new ReadSubscriptionModelImpl({
          knexPromise: Promise.resolve(knex),
          historyConfig: getHistoryConfig(),
          changeListener: createMockChangeListener({
            timeout: { seconds: 1 },
          }),
        });

        await upsertHistorySubscription(knex, {
          subscriptionId: '1',
          afterEventId: '0',
          entityRef: 'k:ns/foo1',
        });
        await upsertHistorySubscription(knex, {
          subscriptionId: '2',
          afterEventId: '0',
          entityRef: 'k:ns/foo2',
        });

        let resolution1: string = '';
        let resolution2: string = '';
        let result = await model.readSubscription({
          readOptions: {
            subscriptionId: '1',
            limit: 10,
            block: true,
          },
          signal: new AbortController().signal,
        });
        expect(result).toEqual({
          type: 'block',
          wait: expect.any(Function),
        });
        (result as { wait: () => Promise<string> }).wait().then(r => {
          resolution1 = r;
        });

        result = await model.readSubscription({
          readOptions: {
            subscriptionId: '2',
            limit: 10,
            block: true,
          },
          signal: new AbortController().signal,
        });
        expect(result).toEqual({
          type: 'block',
          wait: expect.any(Function),
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

        const model = new ReadSubscriptionModelImpl({
          knexPromise: Promise.resolve(knex),
          historyConfig: getHistoryConfig(),
          changeListener: createMockChangeListener(),
        });

        await upsertHistorySubscription(knex, {
          subscriptionId: '1',
          afterEventId: '0',
        });

        const abortController = new AbortController();
        let resolution: string = '';
        const result = await model.readSubscription({
          readOptions: {
            subscriptionId: '1',
            limit: 10,
            block: true,
          },
          signal: abortController.signal,
        });
        expect(result).toEqual({
          type: 'block',
          wait: expect.any(Function),
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
