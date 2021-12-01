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

import { timestampToDateTime, rethrowError } from './conversion';

describe('timestampToDateTime', () => {
  it('converts all known types', () => {
    const js = new Date(Date.UTC(2021, 7, 20, 10, 11, 12));
    const sql = '2021-08-20 10:11:12';
    const iso = '2021-08-20T10:11:12Z';
    expect(timestampToDateTime(js).toISO()).toBe('2021-08-20T10:11:12.000Z');
    expect(timestampToDateTime(sql).toISO()).toBe('2021-08-20T10:11:12.000Z');
    expect(timestampToDateTime(iso).toISO()).toBe('2021-08-20T10:11:12.000Z');
  });
});

describe('rethrowError', () => {
  it('leaves regular errors untouched', () => {
    const e = new Error('nothing special here');
    expect(() => rethrowError(e)).toThrow(e);
  });

  it('translates to conflict error when appropriate', () => {
    const sqliteUnique = new Error('SQLITE_CONSTRAINT: UNIQUE blah');
    const postgresUnique = new Error('unique constraint foo');

    expect(() => rethrowError(sqliteUnique)).toThrow(
      expect.objectContaining({
        name: 'ConflictError',
        message: expect.stringContaining('SQLITE_CONSTRAINT: UNIQUE blah'),
      }),
    );

    expect(() => rethrowError(postgresUnique)).toThrow(
      expect.objectContaining({
        name: 'ConflictError',
        message: expect.stringContaining('unique constraint foo'),
      }),
    );
  });
});
