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

import { isDatabaseConflictError } from './database';

describe('isDatabaseConflictError', () => {
  it('detects PostgreSQL unique violations by SQLSTATE', () => {
    expect(
      isDatabaseConflictError(
        Object.assign(
          new Error(
            'insert into "refresh_state" (...) values (...) - duplicar valor da chave viola a restrição de unicidade "refresh_state_entity_ref_uniq"',
          ),
          {
            code: '23505',
            constraint: 'refresh_state_entity_ref_uniq',
          },
        ),
      ),
    ).toBe(true);

    expect(
      isDatabaseConflictError({
        name: 'error',
        message: '',
        code: '23505',
      }),
    ).toBe(true);

    expect(isDatabaseConflictError({ code: '23505' })).toBe(true);
  });

  it('continues to detect conflicts from existing message patterns', () => {
    expect(
      isDatabaseConflictError(
        new Error(
          'duplicate key value violates unique constraint "refresh_state_entity_ref_uniq"',
        ),
      ),
    ).toBe(true);

    expect(
      isDatabaseConflictError(
        new Error(
          'SQLITE_CONSTRAINT: UNIQUE constraint failed: refresh_state.entity_ref',
        ),
      ),
    ).toBe(true);

    expect(
      isDatabaseConflictError(
        new Error(
          "Duplicate entry 'component:default/a' for key 'refresh_state.refresh_state_entity_ref_uniq'",
        ),
      ),
    ).toBe(true);
  });

  it('ignores unrelated PostgreSQL errors', () => {
    expect(
      isDatabaseConflictError(new Error('Connection terminated unexpectedly')),
    ).toBe(false);

    expect(
      isDatabaseConflictError(
        Object.assign(
          new Error(
            'null value in column "entity_ref" of relation "refresh_state" violates not-null constraint',
          ),
          { code: '23502' },
        ),
      ),
    ).toBe(false);
  });

  it('returns false without throwing for malformed inputs', () => {
    const malformed = [
      undefined,
      null,
      '23505',
      23505,
      {},
      [],
      { name: 'error' },
      { code: 23505 },
      { code: '42P01' },
    ];

    for (const input of malformed) {
      expect(() => isDatabaseConflictError(input)).not.toThrow();
      expect(isDatabaseConflictError(input)).toBe(false);
    }
  });
});
