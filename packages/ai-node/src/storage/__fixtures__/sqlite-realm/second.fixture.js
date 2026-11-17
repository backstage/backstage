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

// This fixture runs only in the nested Jest regression test.
// eslint-disable-next-line @backstage/no-undeclared-imports
const Database = require('better-sqlite3');

test('checks the rejected trigger error in the second Jest realm', async () => {
  const db = new Database(':memory:');
  try {
    db.exec(
      "CREATE TABLE sample (v INTEGER); CREATE TRIGGER fail BEFORE INSERT ON sample BEGIN SELECT RAISE(ABORT, 'forced write failure'); END",
    );
    const operation = Promise.resolve().then(() =>
      db.prepare('INSERT INTO sample VALUES (1)').run(),
    );
    const outcome = await operation.then(
      () => ({ resolved: true }),
      error => ({ error }),
    );
    expect(outcome.resolved).toBeUndefined();
    expect(outcome.error).toMatchObject({
      code: 'SQLITE_CONSTRAINT_TRIGGER',
      message: 'forced write failure',
    });
    expect(Object.prototype.toString.call(outcome.error)).toBe(
      '[object Object]',
    );
    expect(outcome.error instanceof Error).toBe(false);
    expect(db.prepare('SELECT COUNT(*) AS count FROM sample').get().count).toBe(
      0,
    );
    await expect(Promise.reject(outcome.error)).rejects.toMatchObject({
      code: 'SQLITE_CONSTRAINT_TRIGGER',
      message: expect.stringContaining('forced write failure'),
    });
  } finally {
    db.close();
  }
});
