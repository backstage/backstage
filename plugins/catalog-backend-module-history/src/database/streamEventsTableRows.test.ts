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

import {
  TestDatabases,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
import catalogBackend from '@backstage/plugin-catalog-backend';
import waitFor from 'wait-for-expect';
import { createMockEntityProvider } from '../__fixtures__/createMockEntityProvider';
import { catalogModuleHistory } from '../module';
import { streamEventsTableRows } from './streamEventsTableRows';

jest.setTimeout(60_000);

describe('streamEventsTableRows', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())(
    'reads events as they arrive while respecting page sizes, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      const mockProvider = createMockEntityProvider();
      const controller = new AbortController();

      const backend = await startTestBackend({
        features: [
          mockServices.database.mock({ getClient: async () => knex }).factory,
          catalogBackend,
          catalogModuleHistory,
          mockProvider,
        ],
      });

      await waitFor(async () => {
        await mockProvider.ready;
        await expect(knex('module_history__events')).resolves.toEqual([]);
        await expect(knex('module_history__subscriptions')).resolves.toEqual(
          [],
        );
      });

      // Set up a receiver that gets called with each iterator result. Wait for
      // it to appear in the table, since it may take a few tickss for it to
      // land.
      const receiver1 = jest.fn();
      (async () => {
        for await (const events of streamEventsTableRows({
          subscription: {
            subscriptionId: 'receiver1',
            startAt: 'beginning',
            maxPageSize: 2,
          },
          consumerName: 'test',
          knex,
          signal: controller.signal,
        })) {
          receiver1(events);
        }
      })();
      await waitFor(async () => {
        await expect(knex('module_history__subscriptions')).resolves.toEqual(
          expect.objectContaining({ length: 1 }),
        );
      });

      await knex('module_history__events').insert({ event_type: 'e1' });

      await waitFor(async () => {
        expect(receiver1).toHaveBeenCalledTimes(1);
        expect(receiver1).toHaveBeenLastCalledWith([
          expect.objectContaining({ event_type: 'e1' }),
        ]);
      });

      await knex('module_history__events').insert([
        { event_type: 'e2' },
        { event_type: 'e3' },
      ]);

      await waitFor(async () => {
        expect(receiver1).toHaveBeenCalledTimes(2);
        expect(receiver1).toHaveBeenLastCalledWith([
          expect.objectContaining({ event_type: 'e2' }),
          expect.objectContaining({ event_type: 'e3' }),
        ]);
      });

      await knex('module_history__events').insert([
        { event_type: 'e4' },
        { event_type: 'e5' },
        { event_type: 'e6' },
      ]);

      await waitFor(async () => {
        expect(receiver1).toHaveBeenCalledTimes(4);
        expect(receiver1).toHaveBeenNthCalledWith(3, [
          expect.objectContaining({ event_type: 'e4' }),
          expect.objectContaining({ event_type: 'e5' }),
        ]);
        expect(receiver1).toHaveBeenNthCalledWith(4, [
          expect.objectContaining({ event_type: 'e6' }),
        ]);
      });

      // Set up a second receiver, that starts from now
      const receiver2 = jest.fn();
      (async () => {
        for await (const events of streamEventsTableRows({
          subscription: {
            subscriptionId: 'receiver2',
            startAt: 'now',
            maxPageSize: 3,
          },
          consumerName: 'test',
          knex,
          signal: controller.signal,
        })) {
          receiver2(events);
        }
      })();
      await waitFor(async () => {
        await expect(knex('module_history__subscriptions')).resolves.toEqual(
          expect.objectContaining({ length: 2 }),
        );
      });

      await knex('module_history__events').insert([
        { event_type: 'e7' },
        { event_type: 'e8' },
        { event_type: 'e9' },
        { event_type: 'e10' },
      ]);

      await waitFor(async () => {
        expect(receiver1).toHaveBeenCalledTimes(6);
        expect(receiver1).toHaveBeenNthCalledWith(5, [
          expect.objectContaining({ event_type: 'e7' }),
          expect.objectContaining({ event_type: 'e8' }),
        ]);
        expect(receiver1).toHaveBeenNthCalledWith(6, [
          expect.objectContaining({ event_type: 'e9' }),
          expect.objectContaining({ event_type: 'e10' }),
        ]);
      });

      await waitFor(async () => {
        expect(receiver2).toHaveBeenCalledTimes(2);
        expect(receiver2).toHaveBeenNthCalledWith(1, [
          expect.objectContaining({ event_type: 'e7' }),
          expect.objectContaining({ event_type: 'e8' }),
          expect.objectContaining({ event_type: 'e9' }),
        ]);
        expect(receiver2).toHaveBeenNthCalledWith(2, [
          expect.objectContaining({ event_type: 'e10' }),
        ]);
      });

      controller.abort();
      await backend.stop();
      await knex.destroy();
    },
  );
});
