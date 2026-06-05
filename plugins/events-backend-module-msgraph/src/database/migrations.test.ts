/*
 * Copyright 2026 The Backstage Authors
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
import { applyDatabaseMigrations } from './migrations';
import { DateTime } from 'luxon';

describe('migrations', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())(
    '20251003113817_init.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await applyDatabaseMigrations(knex);

      await knex
        .insert({
          id: 'id1',
          resource: 'resource1',
          expires_at: DateTime.now().plus({ minutes: 10 }).toJSDate(),
          token_hash: 'somehash',
          token_salt: 'somesalt',
        })
        .into('module_msgraph__subscriptions');

      await expect(knex('module_msgraph__subscriptions')).resolves.toEqual([
        expect.objectContaining({
          id: 'id1',
          resource: 'resource1',
          token_hash: 'somehash',
          token_salt: 'somesalt',
        }),
      ]);

      await knex.destroy();
    },
  );
});
