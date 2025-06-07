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
import { initEmptyDatabase } from '../../__fixtures__/initEmptyDatabase';
import { EventsTableRow } from '../tables';
import { getMaxEventId } from './getMaxEventId';

jest.setTimeout(60_000);

describe('getMaxEventId', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())('works, %p', async databaseId => {
    const { knex, shutdown } = await initEmptyDatabase(databases, databaseId);

    await expect(getMaxEventId(knex)).resolves.toBe('0');

    await knex<EventsTableRow>('history_events').insert({
      event_type: 't',
    });

    await expect(getMaxEventId(knex)).resolves.toBe('1');

    await shutdown();
  });
});
