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
import { knexRawNowPlus, knexRawNowMinus } from './util';
import { HumanDuration } from '@backstage/types';

jest.setTimeout(60_000);

describe('knexRawNowPlus', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())(
    'computes sensible timestamps, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      async function run(dt: HumanDuration) {
        const rows = await knex.select({ t: knexRawNowPlus(knex, dt) });
        return new Date(rows[0].t).getTime();
      }

      // Note: a precision of -4 digits amounts to +-5000 milliseconds in this
      // case. Due to how large of a variance there is in the runtime of
      // database based tests, we need a fair bit of margin to not get
      // flakiness.
      await expect(run({ seconds: 0 })).resolves.toBeCloseTo(Date.now(), -4);
      await expect(run({ hours: 24 })).resolves.toBeCloseTo(
        Date.now() + 24 * 60 * 60 * 1000,
        -4,
      );
    },
  );
});

describe('knexRawNowMinus', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())(
    'computes sensible timestamps, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      async function run(dt: HumanDuration) {
        const rows = await knex.select({ t: knexRawNowMinus(knex, dt) });
        return new Date(rows[0].t).getTime();
      }

      await expect(run({ seconds: 0 })).resolves.toBeCloseTo(Date.now(), -4);
      await expect(run({ hours: 24 })).resolves.toBeCloseTo(
        Date.now() - 24 * 60 * 60 * 1000,
        -4,
      );
    },
  );
});
