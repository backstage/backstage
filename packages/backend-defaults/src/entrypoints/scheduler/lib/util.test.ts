/*
 * Copyright 2021 The Backstage Authors
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
import { Duration } from 'luxon';
import { delegateAbortController, nowPlus, sleep, validateId } from './util';

class KnexBuilder {
  public build(client: string): Knex {
    return knexFactory({ client, useNullAsDefault: true });
  }
}

describe('util', () => {
  describe('validateId', () => {
    it.each(['a', 'a_b', 'ab123c_2', 'a!', 'A', 'a-b', 'a.b', '_a', 'a_'])(
      'accepts valid inputs, %p',
      async input => {
        expect(validateId(input)).toBeUndefined();
      },
    );

    it.each(['', null, Symbol('a')])(
      'rejects invalid inputs, %p',
      async input => {
        expect(() => validateId(input as any)).toThrow();
      },
    );
  });

  describe('sleep', () => {
    it('finishes the wait as expected with no signal', async () => {
      const ac = new AbortController();
      const start = Date.now();
      await sleep(Duration.fromObject({ seconds: 1 }), ac.signal);
      expect(Date.now() - start).toBeGreaterThan(800);
    }, 5_000);

    it('aborts properly on the signal', async () => {
      const ac = new AbortController();
      const promise = sleep(Duration.fromObject({ seconds: 10 }), ac.signal);
      ac.abort();
      await promise;
      expect(true).toBe(true);
    }, 1_000);
  });

  describe('delegateAbortController', () => {
    it('inherits parent abort state', () => {
      const parent = new AbortController();
      const child = delegateAbortController(parent.signal);
      expect(parent.signal.aborted).toBe(false);
      expect(child.signal.aborted).toBe(false);
      parent.abort();
      expect(parent.signal.aborted).toBe(true);
      expect(child.signal.aborted).toBe(true);
    });

    it('does not inherit from child to parent', () => {
      const parent = new AbortController();
      const child = delegateAbortController(parent.signal);
      expect(parent.signal.aborted).toBe(false);
      expect(child.signal.aborted).toBe(false);
      child.abort();
      expect(parent.signal.aborted).toBe(false);
      expect(child.signal.aborted).toBe(true);
    });
  });

  describe('nowPlus', () => {
    describe('without duration', () => {
      const databases = [
        { client: 'sqlite3', expected: 'CURRENT_TIMESTAMP' },
        { client: 'mysql2', expected: 'CURRENT_TIMESTAMP' },
        { client: 'pg', expected: 'CURRENT_TIMESTAMP' },
      ];

      it.each(databases)('for client $client', ({ client, expected }) => {
        const knex = new KnexBuilder().build(client);
        const result = nowPlus(undefined, knex);

        expect(result.toString()).toBe(expected);
      });
    });
    describe('With duration', () => {
      const databases = [
        { client: 'sqlite3', expected: "datetime('now', '20 seconds')" },
        { client: 'mysql2', expected: 'now() + interval 20 second' },
        { client: 'pg', expected: "now() + interval '20 seconds'" },
      ];
      it.each(databases)('for client $client', ({ client, expected }) => {
        const duration = Duration.fromObject({ seconds: 20 });
        const knex = new KnexBuilder().build(client);
        const result = nowPlus(duration, knex);

        expect(result.toString()).toBe(expected);
      });
    });
  });
});
