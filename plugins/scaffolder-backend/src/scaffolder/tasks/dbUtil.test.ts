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
import knexFactory, { Knex } from 'knex';
import { intervalFromNowTill } from './dbUtil';

class KnexBuilder {
  public build(client: string): Knex {
    return knexFactory({ client, useNullAsDefault: true });
  }
}

describe('util', () => {
  describe('intervalFromNowTill', () => {
    const databases = [
      { client: 'sqlite3', expected: "datetime('now', '-5 seconds')" },
      { client: 'mysql', expected: 'date_sub(now(), interval 5 second)' },
      { client: 'pg', expected: "CURRENT_TIMESTAMP - interval '5 seconds'" },
    ];

    it.each(databases)('for client $client', ({ client, expected }) => {
      const knex = new KnexBuilder().build(client);
      const result = intervalFromNowTill(5, knex);

      expect(result.toString()).toBe(expected);
    });
  });
});
