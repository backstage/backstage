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

import { TestDatabases } from '@backstage/backend-test-utils';
import { Knex } from 'knex';
import waitFor from 'wait-for-expect';
import { initEmptyDatabase } from '../../__fixtures__/initEmptyDatabase';
import { getHistoryConfig } from '../../config';
import { sleep } from '../../helpers';
import { PollingChangeEngine } from './PollingChangeEngine';

jest.setTimeout(60_000);

describe('PollingChangeEngine', () => {
  const databases = TestDatabases.create();

  async function touch(knex: Knex) {
    await knex('history_events').insert({
      event_type: 'test',
    });
  }

  it.each(databases.eachSupportedId())(
    'groups up changes and signals them, %p',
    async databaseId => {
      const { knex, shutdown } = await initEmptyDatabase(databases, databaseId);

      const store = new PollingChangeEngine(
        knex,
        getHistoryConfig({
          overrides: {
            blockPollFrequency: { milliseconds: 50 },
            blockDuration: { milliseconds: 500 },
          },
        }),
      );

      const controller = new AbortController();
      const listener = await store.setupListener(controller.signal);

      // Poll loop doesn't find anything new
      let resolved = false;
      listener.waitForUpdate().then(() => {
        resolved = true;
      });
      await sleep({ milliseconds: 100 });
      expect(resolved).toBe(false);

      // Adding a new event eventually triggers the change
      await touch(knex);
      await waitFor(() => {
        expect(resolved).toBe(true);
      });

      // We can do the same thing again; the second round doesn't have lingering state from the first
      resolved = false;
      listener.waitForUpdate().then(() => {
        resolved = true;
      });
      await sleep({ milliseconds: 100 });
      expect(resolved).toBe(false);
      await touch(knex);
      await waitFor(() => {
        expect(resolved).toBe(true);
      });

      // If we make changes in between calls to waitForUpdate, we should still get an "immediate" signal - but just a single one
      await touch(knex);
      await sleep({ milliseconds: 100 });
      await touch(knex);
      await sleep({ milliseconds: 100 });
      resolved = false;
      listener.waitForUpdate().then(() => {
        resolved = true;
      });
      await waitFor(() => {
        expect(resolved).toBe(true);
      });
      resolved = false;
      let rejected = false;
      listener.waitForUpdate().then(
        () => {
          resolved = true;
        },
        () => {
          // We capture this particular rejection because the signal being aborted below will reject listener promises
          rejected = true;
        },
      );
      await sleep({ milliseconds: 100 });
      expect(resolved).toBe(false);

      controller.abort();
      await sleep({ milliseconds: 1 });
      expect(rejected).toBe(true);

      await store.shutdown();
      await shutdown();
    },
  );
});
