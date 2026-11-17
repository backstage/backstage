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

import { execFile } from 'node:child_process';
import { join } from 'node:path';
import { promisify } from 'node:util';

it('matches SQLite trigger errors from an earlier Jest realm', async () => {
  // better-sqlite3 initializes its native addon's error constructor only once.
  // When Jest reuses the worker for another VM realm, SqliteError is neither
  // instanceof the new realm's Error nor tagged [object Error]. Jest's
  // rejects.toThrow therefore reports "did not throw" for an actual rejection.
  const directory = join(__dirname, '__fixtures__/sqlite-realm');
  const transformer = require.resolve('@backstage/cli/config/jestSwcTransform');
  const module = { ignoreDynamic: true, exportInteropAnnotation: true };
  const config = {
    rootDir: __dirname,
    testEnvironment: 'node',
    testRegex: '(\\.fixture\\.js|\\.test\\.ts)$',
    testSequencer: join(directory, 'sequencer.js'),
    resolver: join(__dirname, 'jestResolver.js'),
    transform: {
      '\\.(mjs|cjs|js)$': [
        transformer,
        { module, jsc: { parser: { syntax: 'ecmascript' } } },
      ],
      '\\.(mts|cts|ts)$': [
        transformer,
        { module, jsc: { parser: { syntax: 'typescript' } } },
      ],
    },
    transformIgnorePatterns: ['/node_modules/(?:knex)/'],
    cache: false,
  };
  const { stdout } = await promisify(execFile)(
    process.execPath,
    [
      require.resolve('jest/bin/jest'),
      '--config',
      JSON.stringify(config),
      '--runInBand',
      '--no-cache',
      '--json',
      '--runTestsByPath',
      join(directory, 'first.fixture.js'),
      join(directory, 'second.fixture.js'),
      join(__dirname, 'knex.test.ts'),
      '--testNamePattern=initializes SQLite|checks the rejected trigger|preserves receipts',
    ],
    { env: { ...process.env, NODE_OPTIONS: '--experimental-vm-modules' } },
  );
  const result = JSON.parse(stdout);
  expect(result.numTotalTestSuites).toBe(3);
  expect(result.numPassedTestSuites).toBe(3);
  expect(result.numPassedTests).toBe(3);
});
